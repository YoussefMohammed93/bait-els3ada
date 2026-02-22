import { v } from "convex/values";
import { query } from "./_generated/server";

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
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    // In a real app, we'd aggregate from orders. For now, let's just return products.
    // Ideally: count occurrences in "orders" items.
    const products = await ctx.db.query("products").take(limit);

    return products.map((p) => ({
      name: p.name,
      category: p.category,
      sales: Math.floor(Math.random() * 100), // Mock sales count for now
      image: p.image,
      price: `${p.price.toLocaleString()} ج.م`,
    }));
  },
});

function mapStatusToArabic(status: string) {
  const map: Record<string, string> = {
    pending: "قيد الانتظار",
    processing: "قيد التنفيذ",
    shipped: "جاري الشحن",
    completed: "مكتمل",
    cancelled: "ملغي",
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
  };
  return map[status] || "bg-gray-500/10 text-gray-600";
}
