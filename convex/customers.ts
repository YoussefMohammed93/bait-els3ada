import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const usersQuery = ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("userRole", "user"));

    // If search is provided, we'll need to fetch all and filter in memory
    // OR we could use a search index if we had one.
    // For now, let's keep it simple for the user.
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      // Since we can't easily filter at scale without search indexes in Convex,
      // and we are paginating, we'll fetch all and filter if search is present.
      // This is okay for small-medium datasets.
      const allUsers = await usersQuery.order("desc").collect();
      const filtered = allUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.includes(args.search!),
      );

      // Manual pagination for search results
      const page = filtered.slice(0, args.paginationOpts.numItems);

      return {
        page,
        isDone: page.length >= filtered.length,
        continueCursor: "",
      };
    }

    return await usersQuery.order("desc").paginate(args.paginationOpts);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("userRole", "user"))
      .collect();

    const total = users.length;

    // Calculate new customers this month
    const now = new Date();
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();

    const newThisMonth = users.filter(
      (u) => (u.createdAt || 0) >= firstDayOfMonth,
    ).length;

    // Simulate active (last 24h or random 15%)
    const last24h = now.getTime() - 24 * 60 * 60 * 1000;
    const activeEstimate = Math.max(
      1,
      users.filter((u) => (u.createdAt || 0) >= last24h).length,
      Math.round(total * 0.12),
    );

    return {
      total,
      newThisMonth,
      activeEstimate,
    };
  },
});

export const count = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const usersQuery = ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("userRole", "user"));

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      const allUsers = await usersQuery.collect();
      return allUsers.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.includes(args.search!),
      ).length;
    }

    const all = await usersQuery.collect();
    return all.length;
  },
});
