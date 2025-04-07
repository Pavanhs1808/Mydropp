import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./mongoStorage";
import { UserDocument } from "@shared/mongoSchema";
import mongoose from "mongoose";

// Override the User type for Express session to use our MongoDB document
declare global {
  namespace Express {
    // This is a complete override of User interface, not an extension
    interface User {
      id: string; // MongoDB document _id 
      username: string;
      password: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
      country: string | null;
      phone: string | null;
      phoneNumber: string | null;
      avatarUrl: string | null;
      supplierStatus: string | null;
      companyName: string | null;
      companyDescription: string | null;
      businessLicense: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'dropmart-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Helper function to adapt MongoDB document to Express User
  function adaptUserDocument(user: UserDocument): Express.User | false {
    if (!user) return false;
    
    // Cast user to any to access _id safely
    const userDoc = user as any;
    
    // MongoDB stores _id which we map to id for Express.User
    const adaptedUser: Express.User = {
      id: userDoc._id ? userDoc._id.toString() : '', // Now we can access _id safely
      username: user.username,
      password: user.password,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country || null, // Ensure these exist
      phone: user.phone,
      phoneNumber: user.phoneNumber || null, // Ensure these exist
      avatarUrl: user.avatarUrl,
      supplierStatus: user.supplierStatus,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      businessLicense: user.businessLicense,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return adaptedUser;
  }

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, adaptUserDocument(user));
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user ? adaptUserDocument(user) : null);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Convert to Express User format before login
      const expressUser = adaptUserDocument(user);
      if (!expressUser) {
        return res.status(500).send("Error creating user");
      }

      req.login(expressUser, (err) => {
        if (err) return next(err);
        res.status(201).json(expressUser);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}