import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    userRole: v.optional(v.union(v.literal("user"), v.literal("admin"))),
  }).index("email", ["email"]),

  categories: defineTable({
    name: v.string(),
    image: v.optional(v.string()),
    slug: v.string(),
  }).index("slug", ["slug"]),

  products: defineTable({
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
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"]),

  orders: defineTable({
    customerId: v.string(),
    customerName: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    paymentStatus: v.union(v.literal("paid"), v.literal("unpaid")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_customer", ["customerId"])
    .index("by_created_at", ["createdAt"]),
});

export default schema;
