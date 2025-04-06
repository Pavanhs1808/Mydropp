/**
 * Database seeding script
 * This script populates the database with initial data for testing and development
 */

import { db } from "../server/db";
import { 
  users, 
  categories, 
  products, 
  InsertCategory, 
  InsertProduct 
} from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data
  try {
    await db.delete(products);
    await db.delete(categories);
    console.log("Cleared existing products and categories");
  } catch (error) {
    console.error("Error clearing existing data:", error);
  }

  // Create categories
  const categoryData: InsertCategory[] = [
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
    },
    {
      name: "Beauty",
      slug: "beauty",
      description: "Skincare, makeup, and beauty products",
      imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da"
    }
  ];

  const createdCategories = [];
  
  for (const category of categoryData) {
    try {
      const result = await db.insert(categories).values(category).returning();
      createdCategories.push(result[0]);
      console.log(`Added category: ${category.name}`);
    } catch (error) {
      console.error(`Error adding category ${category.name}:`, error);
    }
  }

  // Create products
  const productsData: InsertProduct[] = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-noise-cancelling-headphones",
      description: "High-quality wireless headphones with noise-cancelling technology for an immersive listening experience.",
      price: 149.99,
      comparePrice: 199.99,
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      categoryId: 1, // Electronics
      inStock: true,
      isNew: true,
      isSale: true,
      rating: 4.5,
      reviewCount: 121
    },
    {
      name: "Premium Smart Watch",
      slug: "premium-smart-watch",
      description: "Track your fitness, receive notifications, and more with this premium smart watch.",
      price: 299.99,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      categoryId: 1, // Electronics
      inStock: true,
      rating: 4.8,
      reviewCount: 94
    },
    {
      name: "4K Ultra HD Smart TV",
      slug: "4k-ultra-hd-smart-tv",
      description: "Experience stunning picture quality and smart features with this 55-inch 4K television.",
      price: 699.99,
      comparePrice: 899.99,
      imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
      categoryId: 1, // Electronics
      inStock: true,
      isSale: true,
      rating: 4.7,
      reviewCount: 68
    },
    {
      name: "Portable Bluetooth Speaker",
      slug: "portable-bluetooth-speaker",
      description: "Take your music anywhere with this compact yet powerful Bluetooth speaker.",
      price: 79.99,
      imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      categoryId: 1, // Electronics
      inStock: true,
      rating: 4.2,
      reviewCount: 43
    },
    {
      name: "Designer Leather Jacket",
      slug: "designer-leather-jacket",
      description: "Premium quality leather jacket with modern design.",
      price: 299.99,
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
      categoryId: 2, // Fashion
      inStock: true,
      rating: 4.6,
      reviewCount: 37
    },
    {
      name: "Classic Denim Jeans",
      slug: "classic-denim-jeans",
      description: "Comfortable and durable classic fit jeans for everyday wear.",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb",
      categoryId: 2, // Fashion
      inStock: true,
      rating: 4.4,
      reviewCount: 52
    },
    {
      name: "Designer Sunglasses",
      slug: "designer-sunglasses",
      description: "Protect your eyes in style with these fashionable designer sunglasses.",
      price: 129.99,
      comparePrice: 159.99,
      imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666",
      categoryId: 2, // Fashion
      inStock: true,
      isSale: true,
      rating: 4.3,
      reviewCount: 29
    },
    {
      name: "Modern Coffee Table",
      slug: "modern-coffee-table",
      description: "Sleek and stylish coffee table that complements any living room.",
      price: 249.99,
      imageUrl: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc",
      categoryId: 3, // Home Decor
      inStock: true,
      rating: 4.5,
      reviewCount: 18
    },
    {
      name: "Ceramic Plant Pot",
      slug: "ceramic-plant-pot",
      description: "Beautifully crafted ceramic pot for your indoor plants.",
      price: 24.99,
      imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
      categoryId: 3, // Home Decor
      inStock: true,
      isNew: true,
      rating: 4.9,
      reviewCount: 41
    },
    {
      name: "Luxury Scented Candle",
      slug: "luxury-scented-candle",
      description: "Long-lasting scented candle made with natural ingredients.",
      price: 34.99,
      imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59",
      categoryId: 3, // Home Decor
      inStock: true,
      rating: 4.7,
      reviewCount: 26
    },
    {
      name: "Professional Basketball",
      slug: "professional-basketball",
      description: "Official size and weight basketball for indoor and outdoor play.",
      price: 49.99,
      imageUrl: "https://images.unsplash.com/photo-1519861531473-9200262188bf",
      categoryId: 4, // Sports
      inStock: true,
      rating: 4.6,
      reviewCount: 33
    },
    {
      name: "Yoga Mat",
      slug: "yoga-mat",
      description: "Non-slip, comfortable yoga mat for all types of yoga practices.",
      price: 29.99,
      comparePrice: 39.99,
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
      categoryId: 4, // Sports
      inStock: true,
      isSale: true,
      rating: 4.8,
      reviewCount: 47
    },
    {
      name: "Premium Facial Serum",
      slug: "premium-facial-serum",
      description: "Advanced formula serum that hydrates and revitalizes your skin.",
      price: 59.99,
      imageUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e",
      categoryId: 5, // Beauty
      inStock: true,
      isNew: true,
      rating: 4.7,
      reviewCount: 39
    },
    {
      name: "Luxury Perfume",
      slug: "luxury-perfume",
      description: "Elegant and long-lasting fragrance for a sophisticated scent.",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1566977776052-050fa5a6dfcf",
      categoryId: 5, // Beauty
      inStock: true,
      rating: 4.9,
      reviewCount: 28
    }
  ];

  // Map the category positions (1-5) to the actual database IDs
  const categoryMap = {};
  
  // Create a mapping from numeric identifier to actual DB ID
  createdCategories.forEach((category, index) => {
    categoryMap[index + 1] = category.id;
  });
  
  console.log("Category mapping:", categoryMap);
  
  for (const product of productsData) {
    try {
      // Replace the category ID with the actual database ID
      if (categoryMap[product.categoryId]) {
        product.categoryId = categoryMap[product.categoryId];
        
        const result = await db.insert(products).values(product).returning();
        console.log(`Added product: ${product.name}`);
      } else {
        console.error(`Invalid category ID for product ${product.name}`);
      }
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
    }
  }

  console.log("Database seeding completed!");
  process.exit(0);
}

main().catch(error => {
  console.error("Error during seeding:", error);
  process.exit(1);
});