import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_SECRET } from '../config';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔒 Auth Middleware - Starting authentication check');
    console.log('🔒 Auth Middleware - Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('🔒 Auth Middleware - Auth Header:', authHeader);

    if (!authHeader) {
      console.warn('⚠️ Auth Middleware - No authorization header');
      return res.status(401).json({
        success: false,
        message: 'No authorization header',
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔒 Auth Middleware - Token:', token);

    if (!token) {
      console.warn('⚠️ Auth Middleware - No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    try {
      console.log('🔒 Auth Middleware - Verifying token with secret:', JWT_SECRET);
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      console.log('🔒 Auth Middleware - Decoded token:', decoded);

      if (!decoded.userId) {
        console.warn('⚠️ Auth Middleware - No userId in token');
        return res.status(401).json({
          success: false,
          message: 'Invalid token format',
        });
      }

      // Ensure userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
        console.warn('⚠️ Auth Middleware - Invalid userId format:', decoded.userId);
        return res.status(401).json({
          success: false,
          message: 'Invalid user ID format',
        });
      }

      // Convert userId to ObjectId to ensure proper format
      const userId = new mongoose.Types.ObjectId(decoded.userId);

      // Set the user object with the validated userId
      req.user = {
        userId: userId.toString(),
        email: decoded.email
      };
      
      console.log('✅ Auth Middleware - Authentication successful');
      console.log('✅ Auth Middleware - User:', req.user);
      next();
    } catch (error) {
      console.error('❌ Auth Middleware - Token verification failed:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('❌ Auth Middleware - Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}; 