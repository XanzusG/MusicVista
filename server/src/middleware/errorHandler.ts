import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const createError = (message: string, statusCode: number = 500, code?: string, details?: any): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

// Global error handling middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details;

  // Error details in development environment
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Request data validation failed';
    code = 'VALIDATION_ERROR';
    details = err.details || 'Input data does not meet requirements';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // Handle not found errors
  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
    code = 'NOT_FOUND';
  }

  // Handle duplicate key errors (database level)
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === '23505') {
    statusCode = 409;
    message = 'Data already exists';
    code = 'DUPLICATE_RESOURCE';
    details = 'The requested resource already exists';
  }

  // Handle permission errors
  if (err.name === 'UnauthorizedError') {
    statusCode = 403;
    message = 'Insufficient permissions';
    code = 'INSUFFICIENT_PERMISSIONS';
  }

  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  
  // Build error response
  const errorResponse: any = {
    success: false,
    message,
    error: {
      code,
    }
  };

  // Include details and error stack in development environment
  if (isDevelopment) {
    errorResponse.error.details = details;
    if (err.stack) {
      errorResponse.stack = err.stack;
    }
  }

  res.status(statusCode).json(errorResponse);
};

// 404 handling middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = createError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

// Async error handling wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url, ip } = req;
    const { statusCode } = res;
    
    // Set log level based on status code
    const level = statusCode >= 400 ? 'ERROR' : statusCode >= 300 ? 'WARN' : 'INFO';
    
    console.log(`[${new Date().toISOString()}] ${level} ${method} ${url} - ${statusCode} - ${duration}ms - IP: ${ip}`);
  });
  
  next();
};