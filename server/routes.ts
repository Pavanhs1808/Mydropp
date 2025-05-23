import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // PostgreSQL storage
import { insertOrderSchema, insertOrderItemSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth"; // Using standard auth for PostgreSQL
import { connectToDatabase } from "./mongodb"; // Import MongoDB connection
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Try to connect to MongoDB for user syncing
  try {
    const connection = await connectToDatabase();
    if (connection) {
      log('MongoDB connected successfully during application startup', 'mongodb');
    } else {
      log('MongoDB connection failed, but application will continue with PostgreSQL', 'mongodb');
    }
  } catch (error) {
    log(`MongoDB connection error: ${error}`, 'mongodb');
    log('Application will continue with PostgreSQL only', 'mongodb');
  }

  // Set up authentication routes
  setupAuth(app);
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      if (category && typeof category === "string") {
        const products = await storage.getProductsByCategorySlug(category);
        return res.json(products);
      }
      
      if (search && typeof search === "string") {
        const products = await storage.searchProducts(search);
        return res.json(products);
      }
      
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by slug
  app.get("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Note: Authentication routes are now handled by setupAuth

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Add item to order
  app.post("/api/orders/:orderId/items", async (req, res) => {
    try {
      const { orderId } = req.params;
      const orderItemData = insertOrderItemSchema.parse({
        ...req.body,
        orderId: orderId,
      });
      
      // Verify order exists
      const order = await storage.getOrder(Number(orderId));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Verify product exists
      const product = await storage.getProduct(Number(orderItemData.productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const orderItem = await storage.createOrderItem(orderItemData);
      
      res.status(201).json(orderItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to order" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(Number(id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(order.id);
      
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Get user orders
  app.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await storage.getOrders(Number(userId));
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });
  
  // Update user information
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const numId = Number(id);
      
      // Check if the user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update your profile" });
      }
      
      // For now, we'll allow any authenticated user to update their profile without ID check
      // In production, we'd check if req.user.id matches numId
      
      // Check if the user exists
      const existingUser = await storage.getUser(numId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Prevent updating sensitive fields
      const { password, username, ...updateData } = req.body;
      
      // Update the user
      const updatedUser = await storage.updateUser(numId, updateData);
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get product reviews
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await storage.getReviews(Number(productId));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get user's reviews
  app.get("/api/users/:userId/reviews", async (req, res) => {
    try {
      const { userId } = req.params;
      const reviews = await storage.getReviewsByUser(Number(userId));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  // Create a review for a product
  app.post("/api/products/:productId/reviews", async (req, res) => {
    try {
      // Check if the user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to leave a review" });
      }
      
      const { productId } = req.params;
      const userId = req.user!.id;
      
      // Verify the product exists
      const product = await storage.getProduct(Number(productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Parse and validate the review data
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId: Number(productId),
        userId: userId,
      });
      
      // Create the review
      const review = await storage.createReview(reviewData);
      
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Mark a review as helpful or not helpful
  app.post("/api/reviews/:reviewId/helpful", async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { helpful } = req.body;
      
      // Validate helpful parameter
      if (typeof helpful !== 'boolean') {
        return res.status(400).json({ message: "The 'helpful' parameter must be a boolean" });
      }
      
      // Update the review helpfulness count
      const review = await storage.updateReviewHelpfulness(Number(reviewId), helpful);
      
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to update review helpfulness" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
