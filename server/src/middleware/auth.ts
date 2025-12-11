import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../utils/auth';
import { UserService } from '../services/userService';
import { User, TokenPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
      tokenPayload?: TokenPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Missing access token',
      error: {
        code: 'MISSING_TOKEN',
        details: 'Bearer token must be provided in request header'
      }
    });
    return;
  }

  const payload = jwtService.verifyAccessToken(token);
  
  if (!payload) {
    res.status(403).json({
      success: false,
      message: 'Invalid access token',
      error: {
        code: 'INVALID_TOKEN',
        details: 'Token is expired or invalid'
      }
    });
    return;
  }

  // Verify that user exists and is active
  const user = await UserService.getUserById(payload.userId);
  if (!user) {
    res.status(403).json({
      success: false,
      message: 'User does not exist',
      error: {
        code: 'USER_NOT_FOUND',
        details: 'User corresponding to token does not exist'
      }
    });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      success: false,
      message: 'User account has been disabled',
      error: {
        code: 'USER_INACTIVE',
        details: 'User account is in inactive state'
      }
    });
    return;
  }

  // Attach user information (excluding password) to request object
  req.user = user;
  req.tokenPayload = payload;
  
  next();
};

// Optional authentication middleware - validates token if present, but allows access without token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  const payload = jwtService.verifyAccessToken(token);
  
  if (payload) {
    const user = await UserService.getUserById(payload.userId);
    if (user && user.isActive) {
      req.user = user;
      req.tokenPayload = payload;
    }
  }
  
  next();
};

// Middleware to check if user is admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthenticated',
      error: {
        code: 'UNAUTHENTICATED',
        details: 'Authentication required to access this resource'
      }
    });
    return;
  }

  // Admin permission check logic can be added here
  // For example, check user role or specific permissions
  // Currently we assume all authenticated users have basic permissions
  
  next();
};

// Middleware to verify if user is accessing their own resources
export const requireSelfOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthenticated',
      error: {
        code: 'UNAUTHENTICATED',
        details: 'Authentication required to access this resource'
      }
    });
    return;
  }

  const targetUserId = req.params.userId || req.params.id;
  
  if (req.user.id === targetUserId) {
    next();
    return;
  }

  // Admin check logic can be added here
  // Currently denying access
  res.status(403).json({
    success: false,
    message: 'Insufficient permissions',
    error: {
      code: 'INSUFFICIENT_PERMISSIONS',
      details: 'Can only access own resources'
    }
  });
};