import mongoose from 'mongoose';
import { log } from './vite';

// Check for MongoDB URI in environment variables, otherwise use a default that
// we know will fail gracefully for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mongo-not-configured:example@cluster.mongodb.net/dropmart';

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    // Only attempt to connect if a valid URI is provided
    if (MONGODB_URI.includes('mongo-not-configured')) {
      log('No MongoDB URI configured, using PostgreSQL only', 'mongodb');
      return null;
    }
    
    await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB successfully', 'mongodb');
    return mongoose.connection;
  } catch (error) {
    // In development, we'll log the error but continue
    log(`Error connecting to MongoDB: ${error}`, 'mongodb');
    log(`Continuing with PostgreSQL only`, 'mongodb');
    
    // Don't exit in development - this allows the app to run even without MongoDB
    // In production, we would want to handle this differently
    if (process.env.NODE_ENV === 'production') {
      log('MongoDB connection failed in production - continuing with fallback', 'mongodb');
    }
    
    return null;
  }
}

export default mongoose;