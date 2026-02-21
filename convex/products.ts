import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    sortBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Prepare the initial query
    const baseQuery =
      args.category && args.category !== "all"
        ? ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("category", args.category!))
        : ctx.db.query("products");

    // Apply global query-level ordering
    const orderedQuery =
      args.sortBy === "oldest"
        ? baseQuery.order("asc")
        : baseQuery.order("desc"); // Default to newest (descending)

    const result = await orderedQuery.paginate(args.paginationOpts);

    // Filter by status and search in memory
    if (args.status && args.status !== "all") {
      result.page = result.page.filter((p) => p.status === args.status);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      result.page = result.page.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    // Sort remaining fields in memory (price, name)
    // Note: time-based sorting is handled at the query level above
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

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.number(),
    category: v.string(),
    image: v.string(),
    images: v.optional(v.array(v.string())),
    status: v.string(),
    dateAdded: v.string(),
    isCodAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.number(),
    category: v.string(),
    image: v.string(),
    images: v.optional(v.array(v.string())),
    status: v.string(),
    dateAdded: v.string(),
    isCodAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
