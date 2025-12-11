// User related types
export interface User {
  id: string;
  email: string;
  password?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  timestamp: string;
}

// Request/Response extensions
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
      tokenPayload?: TokenPayload;
    }
  }
}

export {};