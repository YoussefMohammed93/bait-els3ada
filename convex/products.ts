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
    let query;
    if (args.category && args.category !== "all") {
      query = ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!));
    } else {
      query = ctx.db.query("products");
    }

    // Note: status filtering could also be indexed if needed, but for now we filter after collecting if not using category index
    // However, Convex allows only one withIndex. If category is used, we must filter status in memory or vice-versa.
    // For simplicity and small datasets, we'll collect and then filter for search/status if category index is already used.

    const result = await query.paginate(args.paginationOpts);

    // Filter by status and search in memory for now (Convex search is better with searchIndex, but let's keep it simple first)
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

    // Sort
    if (args.sortBy) {
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
        case "oldest":
          result.page.sort(
            (a, b) =>
              new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
          );
          break;
        case "newest":
        default:
          result.page.sort(
            (a, b) =>
              new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
          );
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
