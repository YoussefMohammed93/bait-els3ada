import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getStats = query({
  args: {
    month: v.string(),
    year: v.string(),
  },
  handler: async (ctx, args) => {
    const month = parseInt(args.month);
    const year = parseInt(args.year);

    const startOfMonth = new Date(year, month - 1, 1).getTime();
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    // Previous month range
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const startOfPrevMonth = new Date(prevYear, prevMonth - 1, 1).getTime();
    const endOfPrevMonth = new Date(
      prevYear,
      prevMonth,
      0,
      23,
      59,
      59,
      999,
    ).getTime();

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_created_at", (q) =>
        q.gte("createdAt", startOfMonth).lte("createdAt", endOfMonth),
      )
      .collect();

    const prevOrders = await ctx.db
      .query("orders")
      .withIndex("by_created_at", (q) =>
        q.gte("createdAt", startOfPrevMonth).lte("createdAt", endOfPrevMonth),
      )
      .collect();

    const currentTotalOrders = orders.length;
    const prevTotalOrders = prevOrders.length;

    const currentRevenue = orders.reduce(
      (acc, order) =>
        order.status !== "cancelled" ? acc + order.totalAmount : acc,
      0,
    );
    const prevRevenue = prevOrders.reduce(
      (acc, order) =>
        order.status !== "cancelled" ? acc + order.totalAmount : acc,
      0,
    );

    const currentCustomers = new Set(orders.map((o) => o.customerId)).size;
    const prevCustomers = new Set(prevOrders.map((o) => o.customerId)).size;

    const products = await ctx.db.query("products").collect();
    const totalProducts = products.length;

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0)
        return current > 0
          ? { value: "+100%", type: "up" as const }
          : { value: "0%", type: "neutral" as const };
      const diff = ((current - previous) / previous) * 100;
      const type =
        diff > 0
          ? ("up" as const)
          : diff < 0
            ? ("down" as const)
            : ("neutral" as const);
      const sign = diff > 0 ? "+" : "";
      return { value: `${sign}${diff.toFixed(1)}%`, type };
    };

    return {
      totalProducts: {
        value: totalProducts.toString(),
        trend: { value: "0%", type: "neutral" as const },
        description: "إجمالي المنتجات المتاحة",
      },
      totalOrders: {
        value: currentTotalOrders.toLocaleString(),
        trend: calculateTrend(currentTotalOrders, prevTotalOrders),
        description: "طلب خلال هذا الشهر",
      },
      totalRevenue: {
        value: `${currentRevenue.toLocaleString()} ج.م`,
        trend: calculateTrend(currentRevenue, prevRevenue),
        description: "إجمالي إيرادات الشهر",
      },
      totalCustomers: {
        value: currentCustomers.toString(),
        trend: calculateTrend(currentCustomers, prevCustomers),
        description: "عميل فريد هذا الشهر",
      },
    };
  },
});

export const getRevenueData = query({
  args: {
    month: v.string(),
    year: v.string(),
  },
  handler: async (ctx, args) => {
    const monthInt = parseInt(args.month);
    const yearInt = parseInt(args.year);
    const daysInMonth = new Date(yearInt, monthInt, 0).getDate();

    const startOfMonth = new Date(yearInt, monthInt - 1, 1).getTime();
    const endOfMonth = new Date(
      yearInt,
      monthInt - 1,
      daysInMonth,
      23,
      59,
      59,
      999,
    ).getTime();

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_created_at", (q) =>
        q.gte("createdAt", startOfMonth).lte("createdAt", endOfMonth),
      )
      .collect();

    // Group by day
    const dailyData: Record<number, { sales: number; orders: number }> = {};
    for (let i = 1; i <= daysInMonth; i++) {
      dailyData[i] = { sales: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const day = new Date(order.createdAt).getDate();
      if (dailyData[day]) {
        dailyData[day].orders += 1;
        if (order.status !== "cancelled") {
          dailyData[day].sales += order.totalAmount;
        }
      }
    });

    return Object.entries(dailyData).map(([day, stats]) => ({
      day: day, // This could be formatted as date string if needed
      sales: stats.sales,
      orders: stats.orders,
    }));
  },
});

export const getRecentOrders = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);

    return orders.map((order) => ({
      id: `#${order._id.toString().slice(-4).toUpperCase()}`,
      customer: order.customerName,
      product:
        order.items[0]?.productName +
        (order.items.length > 1 ? ` +${order.items.length - 1}` : ""),
      amount: `${order.totalAmount.toLocaleString()} ج.م`,
      status: mapStatusToArabic(order.status),
      statusColor: getStatusColor(order.status),
    }));
  },
});

export const getBestSellers = query({
  args: {
    limit: v.optional(v.number()),
    month: v.optional(v.string()),
    year: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;

    let orders;
    if (args.month && args.year) {
      const month = parseInt(args.month);
      const year = parseInt(args.year);
      const startOfPeriod = new Date(year, month - 1, 1).getTime();
      const endOfPeriod = new Date(year, month, 0, 23, 59, 59, 999).getTime();

      orders = await ctx.db
        .query("orders")
        .withIndex("by_created_at", (q) =>
          q.gte("createdAt", startOfPeriod).lte("createdAt", endOfPeriod),
        )
        .collect();
    } else {
      orders = await ctx.db.query("orders").collect();
    }

    // Aggregate sales by productId
    const salesMap = new Map<string, number>();

    orders.forEach((order) => {
      if (order.status === "cancelled") return;

      order.items.forEach((item) => {
        const currentSales = salesMap.get(item.productId) || 0;
        salesMap.set(item.productId, currentSales + item.quantity);
      });
    });

    // Convert map to array and sort by quantity
    const sortedSales = Array.from(salesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    // Fetch product details for the best sellers
    const results = await Promise.all(
      sortedSales.map(async ([productId, sales]) => {
        const product = await ctx.db.get(productId as Id<"products">);
        if (!product) return null;

        return {
          name: product.name,
          category: product.category,
          sales: sales,
          image: product.image,
          price: `${product.price.toLocaleString()} ج.م`,
        };
      }),
    );

    return results.filter((r) => r !== null);
  },
});

function mapStatusToArabic(status: string) {
  const map: Record<string, string> = {
    pending: "قيد الانتظار",
    processing: "قيد التنفيذ",
    shipped: "جاري الشحن",
    completed: "مكتمل",
    cancelled: "ملغي",
    declined: "مرفوض",
    failed: "فشل في الدفع",
  };
  return map[status] || status;
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    pending: "bg-slate-500/10 text-slate-600",
    processing: "bg-blue-500/10 text-blue-600",
    shipped: "bg-orange-500/10 text-orange-600",
    completed: "bg-emerald-500/10 text-emerald-600",
    cancelled: "bg-rose-500/10 text-rose-600",
    declined: "bg-rose-500/10 text-rose-600",
    failed: "bg-rose-500/10 text-rose-600",
  };
  return map[status] || "bg-gray-500/10 text-gray-600";
}
