import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const jwtService = {
  generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    
    // Use type assertion to handle jwt.sign type issues
    return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
  },

  generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    
    // Use type assertion to handle jwt.sign type issues
    return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
  },

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  },

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  },
};