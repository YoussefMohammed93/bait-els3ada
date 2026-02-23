import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

// Helper to get favorites by userId or sessionId
const getFavoritesInternal = async (
  ctx: QueryCtx | MutationCtx,
  userId?: Id<"users">,
  sessionId?: string,
) => {
  if (userId) {
    return await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  }
  if (sessionId) {
    return await ctx.db
      .query("favorites")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .unique();
  }
  return null;
};

export const get = query({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userDoc = identity
      ? await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", identity.email!))
          .unique()
      : null;

    const favorites = await getFavoritesInternal(
      ctx,
      userDoc?._id,
      args.sessionId,
    );
    if (!favorites) return [];

    // Fetch product details for each favorited product in REVERSE order (newest first)
    const products = await Promise.all(
      [...favorites.productIds]
        .reverse()
        .map(async (productId: Id<"products">) => {
          return await ctx.db.get(productId);
        }),
    );

    return products.filter((p): p is Doc<"products"> => p !== null);
  },
});

export const toggle = mutation({
  args: {
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userDoc = identity
      ? await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", identity.email!))
          .unique()
      : null;

    const existingFavorites = await getFavoritesInternal(
      ctx,
      userDoc?._id,
      args.sessionId,
    );

    if (existingFavorites) {
      const productIds = [...existingFavorites.productIds];
      const index = productIds.indexOf(args.productId);

      if (index !== -1) {
        // Remove if exists
        productIds.splice(index, 1);
      } else {
        // Add if not exists to the FRONT
        productIds.push(args.productId);
      }

      await ctx.db.patch(existingFavorites._id, {
        productIds,
        lastUpdated: Date.now(),
        // Ensure userId is set if logged in
        ...(userDoc?._id && !existingFavorites.userId
          ? { userId: userDoc._id, sessionId: undefined }
          : {}),
      });
      return index === -1; // true if added, false if removed
    } else {
      await ctx.db.insert("favorites", {
        userId: userDoc?._id,
        sessionId: userDoc?._id ? undefined : args.sessionId,
        productIds: [args.productId],
        lastUpdated: Date.now(),
      });
      return true; // true if added
    }
  },
});

export const syncFavorites = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const userDoc = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .unique();
    if (!userDoc) return;

    const guestFavorites = await ctx.db
      .query("favorites")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (!guestFavorites) return;

    const userFavorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userDoc._id))
      .unique();

    if (userFavorites) {
      // Merge product IDs (guest favorites are usually newer, so put them first)
      const mergedProductIds = Array.from(
        new Set([...guestFavorites.productIds, ...userFavorites.productIds]),
      );

      await ctx.db.patch(userFavorites._id, {
        productIds: mergedProductIds,
        lastUpdated: Date.now(),
      });
      await ctx.db.delete(guestFavorites._id);
    } else {
      // Transfer guest favorites to user
      await ctx.db.patch(guestFavorites._id, {
        userId: userDoc._id,
        sessionId: undefined,
        lastUpdated: Date.now(),
      });
    }
  },
});
