import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { db } from "@db";
import { adminUsers, type AdminUser } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Set up local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.query.adminUsers.findFirst({
        where: eq(adminUsers.username, username),
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user for the session
passport.serializeUser((user: Express.User, done) => {
  const adminUser = user as AdminUser;
  done(null, adminUser.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, id),
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is not authenticated
export const isNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({ message: "Already authenticated" });
};

// Admin role check middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as AdminUser | undefined;
  if (req.isAuthenticated() && user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
};