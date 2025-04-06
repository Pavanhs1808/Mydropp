import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  phoneNumber: text("phone_number"),
  companyName: text("company_name"),
  companyDescription: text("company_description"),
  businessLicense: text("business_license"),
  supplierStatus: text("supplier_status"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  phoneNumber: true,
  supplierStatus: true,
  companyName: true,
  companyDescription: true,
  businessLicense: true,
});

// Category Schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
});

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  comparePrice: doublePrecision("compare_price"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  supplierId: integer("supplier_id").references(() => users.id),
  inStock: boolean("in_stock").default(true),
  isNew: boolean("is_new").default(false),
  isSale: boolean("is_sale").default(false),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  status: text("status").default("pending"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  comparePrice: true,
  imageUrl: true,
  categoryId: true,
  supplierId: true,
  inStock: true,
  isNew: true,
  isSale: true,
  rating: true,
  reviewCount: true,
  status: true,
});

// Order Schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"),
  total: doublePrecision("total").notNull(),
  tax: doublePrecision("tax"),
  shipping: doublePrecision("shipping"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  total: true,
  tax: true,
  shipping: true,
});

// Order Item Schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(users, {
    fields: [products.supplierId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Cart Type (not stored in database, just for client-side)
export type CartItem = {
  productId: number;
  quantity: number;
  product: Product;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};
