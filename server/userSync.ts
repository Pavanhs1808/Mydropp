import { hashPassword as mongoHashPassword } from './mongoAuth';
import { storage as pgStorage } from './storage';
import { storage as mongoStorage } from './mongoStorage';
import { InsertUser as MongoInsertUser } from '@shared/mongoSchema';
import { InsertUser as PgInsertUser } from '@shared/schema';
import { connectToDatabase } from './mongodb';
import { log } from './vite';

// Connect to MongoDB first
let mongoConnected = false;
connectToDatabase().then((connection) => {
  if (connection) {
    mongoConnected = true;
    log('MongoDB connection established for user sync', 'userSync');
  } else {
    log('MongoDB connection failed, will still try to sync users', 'userSync');
  }
}).catch(() => {
  log('MongoDB connection error, will still try to sync users', 'userSync');
});

/**
 * Synchronize user creation between PostgreSQL and MongoDB
 * @param userData The user data to save
 * @param hashedPassword The already-hashed password for PostgreSQL
 * @returns The PostgreSQL user object
 */
export async function createUserInBothDatabases(userData: PgInsertUser, hashedPassword: string): Promise<any> {
  try {
    // First create the user in PostgreSQL
    const pgUser = await pgStorage.createUser({
      ...userData,
      password: hashedPassword
    });

    // Try to create the same user in MongoDB
    try {
      if (mongoConnected) {
        // Need to prepare the MongoDB data - MongoDB uses strings for IDs
        const mongoUserData: MongoInsertUser = {
          ...userData,
          password: await mongoHashPassword(userData.password), // Re-hash using MongoDB's function
        };

        // Create user in MongoDB - don't wait for this to complete
        mongoStorage.createUser(mongoUserData)
          .then(() => log(`User ${userData.username} synced to MongoDB`, 'userSync'))
          .catch(error => log(`Failed to sync user ${userData.username} to MongoDB: ${error}`, 'userSync'));
      }
    } catch (mongoError) {
      // Log error but don't fail the registration
      log(`Error syncing user to MongoDB: ${mongoError}`, 'userSync');
    }

    return pgUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
}

/**
 * Check if a username already exists in either PostgreSQL or MongoDB
 * @param username The username to check
 * @returns Boolean indicating if the username exists
 */
export async function usernameExistsInEitherDatabase(username: string): Promise<boolean> {
  // Check PostgreSQL first
  const pgUser = await pgStorage.getUserByUsername(username);
  if (pgUser) return true;
  
  // If MongoDB is connected, check there too
  if (mongoConnected) {
    try {
      const mongoUser = await mongoStorage.getUserByUsername(username);
      return !!mongoUser;
    } catch (error) {
      log(`Error checking username in MongoDB: ${error}`, 'userSync');
    }
  }
  
  return false;
}

/**
 * Check if an email already exists in either PostgreSQL or MongoDB
 * @param email The email to check
 * @returns Boolean indicating if the email exists
 */
export async function emailExistsInEitherDatabase(email: string): Promise<boolean> {
  // Check PostgreSQL first
  const pgUser = await pgStorage.getUserByEmail(email);
  if (pgUser) return true;
  
  // If MongoDB is connected, check there too
  if (mongoConnected) {
    try {
      const mongoUser = await mongoStorage.getUserByEmail(email);
      return !!mongoUser;
    } catch (error) {
      log(`Error checking email in MongoDB: ${error}`, 'userSync');
    }
  }
  
  return false;
}