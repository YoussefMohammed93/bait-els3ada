import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const listPublic = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const baseQuery =
      args.category && args.category !== "all"
        ? ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("category", args.category!))
        : ctx.db.query("products");

    const orderedQuery =
      args.sortBy === "oldest"
        ? baseQuery.order("asc")
        : baseQuery.order("desc");

    const result = await orderedQuery.paginate(args.paginationOpts);

    result.page = result.page.filter((p) => !p.status || p.status !== "draft");

    if (args.minPrice !== undefined) {
      result.page = result.page.filter((p) => p.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      result.page = result.page.filter((p) => p.price <= args.maxPrice!);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      result.page = result.page.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    if (args.sortBy && !["newest", "oldest"].includes(args.sortBy)) {
      switch (args.sortBy) {
        case "price-high":
          result.page.sort((a, b) => b.price - a.price);
          break;
        case "price-low":
          result.page.sort((a, b) => a.price - b.price);
          break;
        case "name":
          result.page.sort((a, b) => a.name.localeCompare(b.name, "ar"));
          break;
      }
    }

    return result;
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getRelated = query({
  args: {
    category: v.string(),
    excludeId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .take(5);

    return products
      .filter(
        (p) => p._id !== args.excludeId && (!p.status || p.status !== "draft"),
      )
      .slice(0, 4);
  },
});
