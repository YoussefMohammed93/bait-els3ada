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
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"]),
});

export default schema;
