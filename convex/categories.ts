import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const products = await ctx.db.query("products").collect();

    return categories.map((category) => ({
      ...category,
      productsCount: products.filter((p) => p.category === category.name)
        .length,
    }));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const slug = args.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return await ctx.db.insert("categories", {
      name: args.name,
      image: args.image,
      slug,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const slug = args.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return await ctx.db.patch(args.id, {
      name: args.name,
      image: args.image,
      slug,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
