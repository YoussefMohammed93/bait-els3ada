import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

// Helper to get cart by userId or sessionId
const getCartInternal = async (
  ctx: QueryCtx | MutationCtx,
  userId?: Id<"users">,
  sessionId?: string,
) => {
  if (userId) {
    return await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  }
  if (sessionId) {
    return await ctx.db
      .query("carts")
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
    const userId = await ctx.auth.getUserIdentity();
    const userDoc = userId
      ? await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", userId.email!))
          .unique()
      : null;

    const cart = await getCartInternal(ctx, userDoc?._id, args.sessionId);
    if (!cart) return { items: [] };

    // Fetch product details for each item
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item: Doc<"carts">["items"][number]) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      }),
    );

    return {
      ...cart,
      items: itemsWithDetails.filter(
        (
          item: (typeof itemsWithDetails)[0],
        ): item is (typeof itemsWithDetails)[0] & {
          product: Doc<"products">;
        } => item.product !== null,
      ),
    };
  },
});

export const updateItems = mutation({
  args: {
    sessionId: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    const userDoc = userId
      ? await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", userId.email!))
          .unique()
      : null;

    const existingCart = await getCartInternal(
      ctx,
      userDoc?._id,
      args.sessionId,
    );

    if (existingCart) {
      await ctx.db.patch(existingCart._id, {
        items: args.items,
        lastUpdated: Date.now(),
        // If user logged in, ensure userId is set
        ...(userDoc?._id && !existingCart.userId
          ? { userId: userDoc._id, sessionId: undefined }
          : {}),
      });
    } else {
      await ctx.db.insert("carts", {
        userId: userDoc?._id,
        sessionId: userDoc?._id ? undefined : args.sessionId,
        items: args.items,
        lastUpdated: Date.now(),
      });
    }
  },
});

export const syncCart = mutation({
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

    const guestCart = await ctx.db
      .query("carts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (!guestCart) return;

    const userCart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userDoc._id))
      .unique();

    if (userCart) {
      // Merge items
      const mergedItems = [...userCart.items];
      guestCart.items.forEach((gItem: Doc<"carts">["items"][number]) => {
        const existing = mergedItems.find(
          (uItem: Doc<"carts">["items"][number]) =>
            uItem.productId === gItem.productId,
        );
        if (existing) {
          existing.quantity = Math.max(existing.quantity, gItem.quantity);
        } else {
          mergedItems.push(gItem);
        }
      });

      await ctx.db.patch(userCart._id, {
        items: mergedItems,
        lastUpdated: Date.now(),
      });
      await ctx.db.delete(guestCart._id);
    } else {
      // Transfer guest cart to user
      await ctx.db.patch(guestCart._id, {
        userId: userDoc._id,
        sessionId: undefined,
        lastUpdated: Date.now(),
      });
    }
  },
});
