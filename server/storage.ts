import { 
  users, User, InsertUser,
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private productCurrentId: number;
  private orderCurrentId: number;
  private orderItemCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.productCurrentId = 1;
    this.orderCurrentId = 1;
    this.orderItemCurrentId = 1;
    
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
}

export const storage = new MemStorage();
