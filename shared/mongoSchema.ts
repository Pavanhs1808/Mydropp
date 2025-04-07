import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  address: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  zipCode: { type: String, default: null },
  country: { type: String, default: null },
  phone: { type: String, default: null },
  phoneNumber: { type: String, default: null }, // Compatibility with schema.ts
  avatarUrl: { type: String, default: null },
  supplierStatus: { type: String, default: null }, // 'active', 'pending', 'rejected', or null
  companyName: { type: String, default: null },
  companyDescription: { type: String, default: null },
  businessLicense: { type: String, default: null }
}, { timestamps: true });

// Category Schema
const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: null },
  imageUrl: { type: String, default: null }
});

// Product Schema
const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: null },
  price: { type: Number, required: true },
  comparePrice: { type: Number, default: null },
  imageUrl: { type: String, required: true },
  status: { type: String, default: 'active' }, // 'active', 'draft', etc.
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  stockQuantity: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  isNew: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  rating: { type: Number, default: null },
  reviewCount: { type: Number, default: null }
});

// Order Schema
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, required: true, default: 'pending' }, // 'pending', 'processing', 'shipped', 'delivered'
  total: { type: Number, required: true },
  tax: { type: Number, default: null },
  shipping: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Item Schema
const orderItemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true }
});

// Define interfaces
export interface UserDocument extends Document {
  username: string;
  password: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone: string | null;
  phoneNumber: string | null; // Compatibility with schema.ts
  avatarUrl: string | null;
  supplierStatus: string | null;
  companyName: string | null;
  companyDescription: string | null;
  businessLicense: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  imageUrl: string;
  status: string | null;
  categoryId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId | null;
  stockQuantity: number;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  rating: number | null;
  reviewCount: number | null;
}

export interface OrderDocument extends Document {
  userId: mongoose.Types.ObjectId | null;
  status: string;
  total: number;
  tax: number | null;
  shipping: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface OrderItemDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
}

// Zod validation schemas
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  supplierStatus: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  companyDescription: z.string().nullable().optional(),
  businessLicense: z.string().nullable().optional()
});

export const insertCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional()
});

export const insertProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  comparePrice: z.number().nullable().optional(),
  imageUrl: z.string(),
  status: z.string().nullable().optional(),
  categoryId: z.string(),
  supplierId: z.string().nullable().optional(),
  stockQuantity: z.number().optional(),
  inStock: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isSale: z.boolean().optional(),
  rating: z.number().nullable().optional(),
  reviewCount: z.number().nullable().optional()
});

export const insertOrderSchema = z.object({
  userId: z.string().nullable().optional(),
  status: z.string(),
  total: z.number(),
  tax: z.number().nullable().optional(),
  shipping: z.number().nullable().optional()
});

export const insertOrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  name: z.string()
});

// Create models
export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
export const Category = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', categorySchema);
export const Product = mongoose.models.Product || mongoose.model<ProductDocument>('Product', productSchema);
export const Order = mongoose.models.Order || mongoose.model<OrderDocument>('Order', orderSchema);
export const OrderItem = mongoose.models.OrderItem || mongoose.model<OrderItemDocument>('OrderItem', orderItemSchema);

// Types for inserting documents
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Cart types (unchanged from original)
export type CartItem = {
  productId: string;
  quantity: number;
  product: ProductDocument;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};