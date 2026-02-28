import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  ...authTables,

  accounts: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    providerAccountId: v.string(),
    secret: v.optional(v.string()),
  }).index("userId", ["userId"]),

  sessions: defineTable({
    userId: v.id("users"),
    expirationTime: v.number(),
  }).index("userId", ["userId"]),

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
  }).index("by_category", ["category"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    image: v.optional(v.string()),
  }),

  favorites: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productIds: v.array(v.id("products")),
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),
});
