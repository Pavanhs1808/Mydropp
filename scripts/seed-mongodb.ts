/**
 * MongoDB Database seeding script
 * This script populates the MongoDB database with initial data for testing and development
 */
import mongoose from 'mongoose';
import { connectToDatabase } from '../server/mongodb';
import { 
  User, Category, Product,
  type InsertUser, type InsertCategory, type InsertProduct
} from '../shared/mongoSchema';
import { hashPassword } from '../server/mongoAuth';

async function main() {
  console.log('Connecting to MongoDB...');
  await connectToDatabase();
  console.log('Connected to MongoDB');

  // Clear existing data
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log('Existing data cleared');

  // Create admin user
  console.log('Creating admin user...');
  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: await hashPassword('admin123'),
    firstName: 'Admin',
    lastName: 'User',
    supplierStatus: 'active'
  });
  console.log(`Admin user created with ID: ${adminUser.id}`);

  // Create categories
  console.log('Creating categories...');
  const categories = await Category.insertMany([
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and electronic devices',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80'
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80'
    },
    {
      name: 'Home Decor',
      slug: 'home-decor',
      description: 'Beautiful items for your home',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80'
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Equipment and apparel for all sports',
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80'
    },
    {
      name: 'Beauty',
      slug: 'beauty',
      description: 'Cosmetics and personal care',
      imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80'
    }
  ]);
  console.log(`Created ${categories.length} categories`);

  // Create products for Electronics category
  console.log('Creating products...');
  const electronicsCategory = categories.find(c => c.slug === 'electronics');
  if (electronicsCategory) {
    const electronicsProducts = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        slug: 'wireless-noise-cancelling-headphones',
        description: 'Premium headphones with active noise cancellation and 30-hour battery life.',
        price: 299.99,
        comparePrice: 349.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
        categoryId: electronicsCategory._id,
        supplierId: adminUser._id,
        stockQuantity: 50,
        inStock: true,
        isNew: true,
        isSale: true,
        rating: 4.8,
        reviewCount: 124
      },
      {
        name: '4K Smart TV',
        slug: '4k-smart-tv',
        description: '55-inch 4K Ultra HD Smart LED TV with built-in streaming apps.',
        price: 699.99,
        comparePrice: 799.99,
        imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80',
        categoryId: electronicsCategory._id,
        supplierId: adminUser._id,
        stockQuantity: 30,
        inStock: true,
        isNew: true,
        isSale: false,
        rating: 4.5,
        reviewCount: 89
      },
      {
        name: 'Smartphone',
        slug: 'smartphone',
        description: 'Latest model with 128GB storage, 5G capability, and pro-level camera system.',
        price: 999.99,
        comparePrice: null,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80',
        categoryId: electronicsCategory._id,
        supplierId: adminUser._id,
        stockQuantity: 100,
        inStock: true,
        isNew: true,
        isSale: false,
        rating: 4.9,
        reviewCount: 212
      }
    ];

    await Product.insertMany(electronicsProducts);
    console.log(`Created ${electronicsProducts.length} electronics products`);
  }

  // Create products for Fashion category
  const fashionCategory = categories.find(c => c.slug === 'fashion');
  if (fashionCategory) {
    const fashionProducts = [
      {
        name: 'Denim Jacket',
        slug: 'denim-jacket',
        description: 'Classic denim jacket with a modern fit.',
        price: 79.99,
        comparePrice: 99.99,
        imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80',
        categoryId: fashionCategory._id,
        supplierId: adminUser._id,
        stockQuantity: 75,
        inStock: true,
        isNew: false,
        isSale: true,
        rating: 4.3,
        reviewCount: 65
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Lightweight running shoes with responsive cushioning.',
        price: 129.99,
        comparePrice: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80',
        categoryId: fashionCategory._id,
        supplierId: adminUser._id,
        stockQuantity: 60,
        inStock: true,
        isNew: false,
        isSale: true,
        rating: 4.7,
        reviewCount: 98
      }
    ];

    await Product.insertMany(fashionProducts);
    console.log(`Created ${fashionProducts.length} fashion products`);
  }

  console.log('Database seeding complete!');
  mongoose.disconnect();
}

main().catch(err => {
  console.error('Error seeding database:', err);
  mongoose.disconnect();
  process.exit(1);
});