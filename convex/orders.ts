import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const createOrder = mutation({
  args: {
    sessionId: v.optional(v.string()),
    customerName: v.string(),
    phone: v.string(),
    address: v.string(),
    governorate: v.string(),
    paymentMethod: v.string(),
    senderWallet: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let userId = null;

    // 1. Try to find user by identity/email
    if (identity?.email) {
      const userDoc = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .unique();
      if (userDoc) userId = userDoc._id;
    }

    // 2. If not found by email, try by phone
    if (!userId && args.phone) {
      const userByPhone = await ctx.db
        .query("users")
        .withIndex("phone", (q) => q.eq("phone", args.phone))
        .unique();
      if (userByPhone) userId = userByPhone._id;
    }

    // 3. Still not found? Create a new user (customer)
    if (!userId) {
      userId = await ctx.db.insert("users", {
        name: args.customerName,
        email: identity?.email || undefined,
        phone: args.phone,
        userRole: "user",
        sessionId: args.sessionId,
        createdAt: Date.now(),
      });
    }

    // Get current cart - check by userId first, then by sessionId
    let cart = userId
      ? await ctx.db
          .query("carts")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .unique()
      : null;

    if (!cart && args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .unique();
    }

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Prepare order items and calculate total
    let totalAmount = 0;
    const orderItems = await Promise.all(
      cart.items.map(async (item: Doc<"carts">["items"][number]) => {
        const product = await ctx.db.get(item.productId);
        if (!product) throw new Error("Product not found");

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        return {
          productId: item.productId,
          productName: product.name,
          productImage: product.image,
          price: product.price,
          quantity: item.quantity,
        };
      }),
    );

    // Add shipping cost
    const shippingCost = 50;
    totalAmount += shippingCost;

    // Create Order object
    const orderData = {
      customerId: userId, // Use the proper userId now
      customerName: args.customerName,
      phone: args.phone,
      address: args.address,
      governorate: args.governorate,
      items: orderItems,
      totalAmount,
      status: "pending" as const,
      paymentMethod: args.paymentMethod,
      paymentStatus: "unpaid" as const,
      senderWallet: args.senderWallet,
      createdAt: Date.now(),
    };

    const orderId = await ctx.db.insert("orders", orderData);

    // Clear cart
    await ctx.db.delete(cart._id);

    return {
      _id: orderId,
      ...orderData,
    };
  },
});

export const getOrders = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userDoc = identity
      ? await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", identity.email!))
          .unique()
      : null;

    if (userDoc) {
      return await ctx.db
        .query("orders")
        .withIndex("by_customer", (q) => q.eq("customerId", userDoc._id))
        .order("desc")
        .collect();
    }

    if (args.sessionId) {
      const guestUser = await ctx.db
        .query("users")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .unique();

      if (guestUser) {
        return await ctx.db
          .query("orders")
          .withIndex("by_customer", (q) => q.eq("customerId", guestUser._id))
          .order("desc")
          .collect();
      }
    }

    return [];
  },
});

export const cancelOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "pending") {
      throw new Error("Only pending orders can be cancelled");
    }

    await ctx.db.patch(args.orderId, {
      status: "cancelled",
    });

    return { success: true };
  },
});
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      status: args.status,
    });

    return { success: true };
  },
});
