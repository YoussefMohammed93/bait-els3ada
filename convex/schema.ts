import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    userRole: v.string(), // "user", "admin"
    sessionId: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_session", ["sessionId"])
    .index("by_role", ["userRole"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    price: v.number(),
    stock: v.number(),
    image: v.string(),
    images: v.optional(v.array(v.string())),
    status: v.string(),
    dateAdded: v.string(),
    isCodAvailable: v.optional(v.boolean()),
  }).index("by_category", ["category"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    image: v.optional(v.string()),
  }),

  carts: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      }),
    ),
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  orders: defineTable({
    customerId: v.union(v.id("users"), v.string()),
    customerName: v.string(),
    phone: v.string(),
    address: v.string(),
    governorate: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        productImage: v.optional(v.string()),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
    totalAmount: v.number(),
    status: v.string(),
    paymentMethod: v.string(),
    paymentStatus: v.string(),
    senderWallet: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_customer", ["customerId"])
    .index("by_created_at", ["createdAt"]),

  favorites: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productIds: v.array(v.id("products")),
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),
});
