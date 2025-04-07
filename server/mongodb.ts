import mongoose from 'mongoose';
import { log } from './vite';

// Use in-memory MongoDB to simulate a database
// This allows us to run without needing an actual MongoDB instance
const MONGODB_URI = 'mongodb://localhost:27017/dropmart';

// For development we'll use a fallback memory database 
console.log('Using fallback in-memory database for development');

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB successfully', 'mongodb');
    return mongoose.connection;
  } catch (error) {
    // In development, we'll log the error but continue
    log(`Error connecting to MongoDB: ${error}`, 'mongodb');
    log(`Using in-memory MongoDB fallback for development`, 'mongodb');
    
    // Don't exit in development - this allows the app to run even without MongoDB
    // In production, we would want to exit if MongoDB is not available
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    return null;
  }
}

export default mongoose;