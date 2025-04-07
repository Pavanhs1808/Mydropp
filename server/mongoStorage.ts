import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import {
  User, Category, Product, Order, OrderItem,
  type UserDocument, type CategoryDocument, type ProductDocument,
  type OrderDocument, type OrderItemDocument,
  type InsertUser, type InsertCategory, type InsertProduct,
  type InsertOrder, type InsertOrderItem
} from '@shared/mongoSchema';

// MongoDB connection string - will use environment variable or default to local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dropmart';

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User operations
  getUser(id: string): Promise<UserDocument | null>;
  getUserByUsername(username: string): Promise<UserDocument | null>;
  getUserByEmail(email: string): Promise<UserDocument | null>;
  createUser(user: InsertUser): Promise<UserDocument>;
  updateUser(id: string, userData: Partial<UserDocument>): Promise<UserDocument | null>;
  
  // Category operations
  getCategories(): Promise<CategoryDocument[]>;
  getCategory(id: string): Promise<CategoryDocument | null>;
  getCategoryBySlug(slug: string): Promise<CategoryDocument | null>;
  createCategory(category: InsertCategory): Promise<CategoryDocument>;
  
  // Product operations
  getProducts(): Promise<ProductDocument[]>;
  getProductsByCategory(categoryId: string): Promise<ProductDocument[]>;
  getProductsByCategorySlug(slug: string): Promise<ProductDocument[]>;
  getProduct(id: string): Promise<ProductDocument | null>;
  getProductBySlug(slug: string): Promise<ProductDocument | null>;
  createProduct(product: InsertProduct): Promise<ProductDocument>;
  searchProducts(query: string): Promise<ProductDocument[]>;
  
  // Order operations
  getOrders(userId?: string): Promise<OrderDocument[]>;
  getOrder(id: string): Promise<OrderDocument | null>;
  createOrder(order: InsertOrder): Promise<OrderDocument>;
  updateOrderStatus(id: string, status: string): Promise<OrderDocument | null>;
  
  // Order item operations
  getOrderItems(orderId: string): Promise<OrderItemDocument[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItemDocument>;
}

export class MongoDBStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions'
    });
  }

  // User operations
  async getUser(id: string): Promise<UserDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    return await User.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email });
  }

  async createUser(insertUser: InsertUser): Promise<UserDocument> {
    const user = new User(insertUser);
    return await user.save();
  }

  async updateUser(id: string, userData: Partial<UserDocument>): Promise<UserDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  // Category operations
  async getCategories(): Promise<CategoryDocument[]> {
    return await Category.find();
  }

  async getCategory(id: string): Promise<CategoryDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Category.findById(id);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDocument | null> {
    return await Category.findOne({ slug });
  }

  async createCategory(insertCategory: InsertCategory): Promise<CategoryDocument> {
    const category = new Category(insertCategory);
    return await category.save();
  }

  // Product operations
  async getProducts(): Promise<ProductDocument[]> {
    return await Product.find();
  }

  async getProductsByCategory(categoryId: string): Promise<ProductDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return [];
    return await Product.find({ categoryId });
  }

  async getProductsByCategorySlug(slug: string): Promise<ProductDocument[]> {
    const category = await Category.findOne({ slug });
    if (!category) return [];
    return await Product.find({ categoryId: category._id });
  }

  async getProduct(id: string): Promise<ProductDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Product.findById(id);
  }

  async getProductBySlug(slug: string): Promise<ProductDocument | null> {
    return await Product.findOne({ slug });
  }

  async createProduct(insertProduct: InsertProduct): Promise<ProductDocument> {
    const product = new Product(insertProduct);
    return await product.save();
  }

  async searchProducts(query: string): Promise<ProductDocument[]> {
    return await Product.find({ 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
  }

  // Order operations
  async getOrders(userId?: string): Promise<OrderDocument[]> {
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) return [];
      return await Order.find({ userId });
    }
    return await Order.find();
  }

  async getOrder(id: string): Promise<OrderDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Order.findById(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<OrderDocument> {
    const order = new Order(insertOrder);
    return await order.save();
  }

  async updateOrderStatus(id: string, status: string): Promise<OrderDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
  }

  // Order item operations
  async getOrderItems(orderId: string): Promise<OrderItemDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) return [];
    return await OrderItem.find({ orderId });
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItemDocument> {
    const orderItem = new OrderItem(insertOrderItem);
    return await orderItem.save();
  }
}

// Create and export the storage instance
export const storage = new MongoDBStorage();