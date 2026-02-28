import { auth } from "./auth";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // If image is a storageId, get the URL
    let imageUrl = user.image;
    if (user.image && !user.image.startsWith("http")) {
      try {
        const url = await ctx.storage.getUrl(user.image);
        if (url) imageUrl = url;
      } catch (e) {
        console.error("Error getting storage URL", e);
      }
    }

    return {
      ...user,
      image: imageUrl,
    };
  },
});

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()), // This can be a storageId or a URL
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("غير مصرح لك بالقيام بهذا الإجراء");
    }

    await ctx.db.patch(userId, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.image !== undefined && { image: args.image }),
      ...(args.phone !== undefined && { phone: args.phone }),
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("غير مصرح لك بالقيام بهذا الإجراء");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("غير مصرح لك بالقيام بهذا الإجراء");
    }

    // Delete user's favorites first
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (favorites) {
      await ctx.db.delete(favorites._id);
    }

    // Delete associated accounts
    const accounts = await ctx.db
      .query("accounts")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }

    // Delete associated sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete the user
    await ctx.db.delete(userId);
  },
});
