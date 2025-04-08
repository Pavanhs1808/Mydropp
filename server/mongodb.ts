import mongoose from 'mongoose';
import { log } from './vite';
import dotenv from 'dotenv';
dotenv.config();

// Check for MongoDB URI in environment variables, otherwise use a default that
// we know will fail gracefully for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fallback';

console.log('MONGODB_URI:', MONGODB_URI); // Debug log to confirm the URI

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    // Only attempt to connect if a valid URI is provided
    if (MONGODB_URI.includes('mongo-not-configured')) {
      log('No MongoDB URI configured, using PostgreSQL only', 'mongodb');
      return null;
    }

    console.log('Attempting to connect to MongoDB...'); // Debug log before connection
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Optional: Adjust timeout for better error handling
      directConnection: true,        // Force direct connection to the specified host
    });
    log('Connected to MongoDB successfully', 'mongodb');
    return mongoose.connection;
  } catch (error) {
    // In development, we'll log the error but continue
    log(`Error connecting to MongoDB: ${error}`, 'mongodb');
  }
}

export default mongoose;