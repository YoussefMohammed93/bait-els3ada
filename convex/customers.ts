import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {
    search: v.optional(v.string()),
    status: v.optional(v.string()),
    sortBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("userRole", "user"))
      .collect();

    const customersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await ctx.db
          .query("orders")
          .withIndex("by_customer", (q) => q.eq("customerId", user._id))
          .collect();

        const totalOrders = orders.length;
        const totalSpent = orders.reduce(
          (acc, order) =>
            order.status !== "cancelled" ? acc + order.totalAmount : acc,
          0,
        );
        const lastOrder = orders.sort((a, b) => b.createdAt - a.createdAt)[0];
        const lastOrderDate = lastOrder
          ? new Date(lastOrder.createdAt).toISOString()
          : null;

        // Active if joined or ordered in last 30 days
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const isActive =
          (lastOrder && lastOrder.createdAt > thirtyDaysAgo) ||
          (user.createdAt && user.createdAt > thirtyDaysAgo);

        return {
          id: user._id,
          name: user.name || "عميل غير معروف",
          phone: user.phone || "بدون رقم",
          email: user.email || "بدون بريد",
          address: "غير محدد", // Can be extended with address fields later
          totalOrders,
          totalSpent,
          status: isActive ? "نشط" : "غير نشط",
          joinDate: user.createdAt
            ? new Date(user.createdAt).toISOString()
            : "2024-01-01",
          lastOrderDate,
        };
      }),
    );

    let result = customersWithStats;

    // Backend Filtering
    if (args.search) {
      const q = args.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }

    if (args.status && args.status !== "all") {
      result = result.filter((c) => c.status === args.status);
    }

    // Backend Sorting
    switch (args.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
        );
        break;
      case "orders-high":
        result.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case "spend-high":
        result.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
    }

    return result;
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("userRole", "user"))
      .collect();

    let activeCount = 0;
    let newThisMonthCount = 0;
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    for (const user of users) {
      const orders = await ctx.db
        .query("orders")
        .withIndex("by_customer", (q) => q.eq("customerId", user._id))
        .collect();

      const lastOrder = orders.sort((a, b) => b.createdAt - a.createdAt)[0];
      const isActive =
        (lastOrder && lastOrder.createdAt > thirtyDaysAgo) ||
        (user.createdAt && user.createdAt > thirtyDaysAgo);

      if (isActive) activeCount++;
      if (user.createdAt && user.createdAt >= startOfMonth) newThisMonthCount++;
    }

    return {
      totalCustomers: users.length,
      activeCustomers: activeCount,
      inactiveCustomers: users.length - activeCount,
      newThisMonth: newThisMonthCount,
    };
  },
});
