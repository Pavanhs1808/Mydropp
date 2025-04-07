import { 
  users, User, InsertUser,
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  reviews, Review, InsertReview
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByCategorySlug(slug: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Order operations
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Review operations
  getReviews(productId?: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewHelpfulness(id: number, increment: boolean): Promise<Review | undefined>;
  updateProductRating(productId: number): Promise<Product | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private productCurrentId: number;
  private orderCurrentId: number;
  private orderItemCurrentId: number;
  private reviewCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.productCurrentId = 1;
    this.orderCurrentId = 1;
    this.orderItemCurrentId = 1;
    this.reviewCurrentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Create categories
    const categories: InsertCategory[] = [
      {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and electronic devices",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      },
      {
        name: "Fashion",
        slug: "fashion",
        description: "Trendy clothing and accessories",
        imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5"
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        description: "Stylish furniture and home accessories",
        imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25"
      },
      {
        name: "Sports",
        slug: "sports",
        description: "Sports equipment and activewear",
        imageUrl: "https://images.unsplash.com/photo-1556760544-74068565f05c"
      }
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Create products
    const products: InsertProduct[] = [
      {
        name: "Wireless Noise-Cancelling Headphones",
        slug: "wireless-noise-cancelling-headphones",
        description: "High-quality wireless headphones with noise-cancelling technology for an immersive listening experience.",
        price: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
        categoryId: 1,
        isNew: true,
        rating: 5,
        reviewCount: 121
      },
      {
        name: "Premium Smart Watch",
        slug: "premium-smart-watch",
        description: "Track your fitness, receive notifications, and more with this premium smart watch.",
        price: 299.99,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        categoryId: 1,
        rating: 5,
        reviewCount: 94
      },
      {
        name: "Fitness Tracker Band",
        slug: "fitness-tracker-band",
        description: "Monitor your activity, sleep, and more with this comfortable fitness tracker.",
        price: 89.99,
        comparePrice: 129.99,
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
        categoryId: 1,
        isSale: true,
        rating: 4,
        reviewCount: 76
      },
      {
        name: "Portable Bluetooth Speaker",
        slug: "portable-bluetooth-speaker",
        description: "Take your music anywhere with this compact yet powerful Bluetooth speaker.",
        price: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
        categoryId: 1,
        rating: 4,
        reviewCount: 43
      },
      {
        name: "Professional Camera",
        slug: "professional-camera",
        description: "Capture stunning photos and videos with this professional-grade camera.",
        price: 999.99,
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        categoryId: 1,
        rating: 5,
        reviewCount: 28
      },
      {
        name: "Laptop Backpack",
        slug: "laptop-backpack",
        description: "Comfortable and stylish backpack with padded compartment for laptops up to 15 inches.",
        price: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
        categoryId: 2,
        rating: 4,
        reviewCount: 53
      },
      {
        name: "Designer Sunglasses",
        slug: "designer-sunglasses",
        description: "Protect your eyes in style with these fashionable designer sunglasses.",
        price: 129.99,
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        categoryId: 2,
        rating: 4,
        reviewCount: 37
      },
      {
        name: "Ceramic Plant Pot",
        slug: "ceramic-plant-pot",
        description: "Beautifully crafted ceramic pot for your indoor plants.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
        categoryId: 3,
        isNew: true,
        rating: 5,
        reviewCount: 19
      }
    ];
    
    products.forEach(product => this.createProduct(product));
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...existingUser,
      ...userData,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }
  
  async getProductsByCategorySlug(slug: string): Promise<Product[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) {
      return [];
    }
    return this.getProductsByCategory(category.id);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercaseQuery)),
    );
  }
  
  // Order operations
  async getOrders(userId?: number): Promise<Order[]> {
    const orders = Array.from(this.orders.values());
    if (userId) {
      return orders.filter((order) => order.userId === userId);
    }
    return orders;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) {
      return undefined;
    }
    
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date(),
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (orderItem) => orderItem.orderId === orderId,
    );
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCurrentId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  // Review operations
  async getReviews(productId?: number): Promise<Review[]> {
    const reviews = Array.from(this.reviews.values());
    if (productId) {
      return reviews.filter((review) => review.productId === productId);
    }
    return reviews;
  }
  
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId,
    );
  }
  
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const now = new Date();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: now,
      updatedAt: now,
      helpfulCount: 0
    };
    this.reviews.set(id, review);
    
    // Update product rating after adding a review
    await this.updateProductRating(review.productId);
    
    return review;
  }
  
  async updateReviewHelpfulness(id: number, increment: boolean): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) {
      return undefined;
    }
    
    const updatedReview: Review = {
      ...review,
      helpfulCount: increment 
        ? (review.helpfulCount || 0) + 1 
        : Math.max(0, (review.helpfulCount || 0) - 1),
      updatedAt: new Date(),
    };
    
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }
  
  async updateProductRating(productId: number): Promise<Product | undefined> {
    const product = this.products.get(productId);
    if (!product) {
      return undefined;
    }
    
    const productReviews = await this.getReviews(productId);
    if (productReviews.length === 0) {
      const updatedProduct: Product = {
        ...product,
        rating: 0,
        reviewCount: 0,
      };
      this.products.set(productId, updatedProduct);
      return updatedProduct;
    }
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / productReviews.length;
    
    const updatedProduct: Product = {
      ...product,
      rating: averageRating,
      reviewCount: productReviews.length,
    };
    
    this.products.set(productId, updatedProduct);
    return updatedProduct;
  }
}

import { db } from "./db";
import { eq, like, or } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import postgres from "postgres";

const PostgresSessionStore = connectPg(session);
// Create postgres connection
const sql = postgres(process.env.DATABASE_URL!);

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      conObject: {
        connectionString: process.env.DATABASE_URL!,
      },
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(insertCategory).returning();
    return result[0];
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.categoryId, categoryId));
  }
  
  async getProductsByCategorySlug(slug: string): Promise<Product[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) {
      return [];
    }
    return this.getProductsByCategory(category.id);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug));
    return result[0];
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    return db.select().from(products).where(
      or(
        like(products.name, searchPattern),
        like(products.description || '', searchPattern)
      )
    );
  }
  
  // Order operations
  async getOrders(userId?: number): Promise<Order[]> {
    if (userId) {
      return db.select().from(orders).where(eq(orders.userId, userId));
    }
    return db.select().from(orders);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder).returning();
    return result[0];
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db
      .update(orders)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }
  
  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(insertOrderItem).returning();
    return result[0];
  }
  
  // Review operations
  async getReviews(productId?: number): Promise<Review[]> {
    if (productId) {
      return db.select().from(reviews).where(eq(reviews.productId, productId));
    }
    return db.select().from(reviews);
  }
  
  async getReviewsByUser(userId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.userId, userId));
  }
  
  async getReview(id: number): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id));
    return result[0];
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(insertReview).returning();
    const review = result[0];
    
    // Update product rating after adding a review
    await this.updateProductRating(review.productId);
    
    return review;
  }
  
  async updateReviewHelpfulness(id: number, increment: boolean): Promise<Review | undefined> {
    // First get the current review
    const currentReview = await this.getReview(id);
    if (!currentReview) {
      return undefined;
    }
    
    // Calculate new helpfulness count
    const helpfulCount = increment 
      ? (currentReview.helpfulCount || 0) + 1 
      : Math.max(0, (currentReview.helpfulCount || 0) - 1);
    
    // Update the review
    const result = await db
      .update(reviews)
      .set({ 
        helpfulCount, 
        updatedAt: new Date() 
      })
      .where(eq(reviews.id, id))
      .returning();
    
    return result[0];
  }
  
  async updateProductRating(productId: number): Promise<Product | undefined> {
    // Get the product
    const product = await this.getProduct(productId);
    if (!product) {
      return undefined;
    }
    
    // Get all reviews for this product
    const productReviews = await this.getReviews(productId);
    
    // If no reviews, set rating to 0
    if (productReviews.length === 0) {
      const result = await db
        .update(products)
        .set({ 
          rating: 0, 
          reviewCount: 0 
        })
        .where(eq(products.id, productId))
        .returning();
      
      return result[0];
    }
    
    // Calculate average rating
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / productReviews.length;
    
    // Update the product
    const result = await db
      .update(products)
      .set({ 
        rating: averageRating, 
        reviewCount: productReviews.length 
      })
      .where(eq(products.id, productId))
      .returning();
    
    return result[0];
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
