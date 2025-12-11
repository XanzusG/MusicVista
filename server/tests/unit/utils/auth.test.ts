import { jwtService, TokenPayload } from '../../../src/utils/auth';

// Mock the environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('JWT Service', () => {
  const mockPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId: '123',
    email: 'test@example.com',
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = jwtService.generateAccessToken(mockPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should use default secret when JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;
      const token = jwtService.generateAccessToken(mockPayload);
      expect(typeof token).toBe('string');
      
      // Should still be verifiable with default secret
      const verified = jwtService.verifyAccessToken(token);
      expect(verified).toBeTruthy();
    });

    it('should use custom expiration when provided', () => {
      process.env.JWT_EXPIRES_IN = '1h';
      const token = jwtService.generateAccessToken(mockPayload);
      expect(typeof token).toBe('string');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = jwtService.generateRefreshToken(mockPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should use default refresh secret when JWT_REFRESH_SECRET is not set', () => {
      delete process.env.JWT_REFRESH_SECRET;
      const token = jwtService.generateRefreshToken(mockPayload);
      expect(typeof token).toBe('string');
      
      const verified = jwtService.verifyRefreshToken(token);
      expect(verified).toBeTruthy();
    });

    it('should use custom refresh expiration when provided', () => {
      process.env.JWT_REFRESH_EXPIRES_IN = '30d';
      const token = jwtService.generateRefreshToken(mockPayload);
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = jwtService.generateAccessToken(mockPayload);
      const verified = jwtService.verifyAccessToken(token);
      
      expect(verified).toBeTruthy();
      expect(verified!.userId).toBe(mockPayload.userId);
      expect(verified!.email).toBe(mockPayload.email);
      expect(verified!.iat).toBeDefined();
      expect(verified!.exp).toBeDefined();
    });

    it('should return null for invalid access token', () => {
      const invalidToken = 'invalid.token.here';
      const verified = jwtService.verifyAccessToken(invalidToken);
      expect(verified).toBeNull();
    });

    it('should return null for expired token', () => {
      process.env.JWT_EXPIRES_IN = '-1s'; // Already expired
      const token = jwtService.generateAccessToken(mockPayload);
      const verified = jwtService.verifyAccessToken(token);
      expect(verified).toBeNull();
    });

    it('should return null for token signed with wrong secret', () => {
      const token = jwtService.generateAccessToken(mockPayload);
      // Change secret before verification
      process.env.JWT_SECRET = 'different-secret';
      const verified = jwtService.verifyAccessToken(token);
      expect(verified).toBeNull();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = jwtService.generateRefreshToken(mockPayload);
      const verified = jwtService.verifyRefreshToken(token);
      
      expect(verified).toBeTruthy();
      expect(verified!.userId).toBe(mockPayload.userId);
      expect(verified!.email).toBe(mockPayload.email);
    });

    it('should return null for invalid refresh token', () => {
      const invalidToken = 'invalid.refresh.token';
      const verified = jwtService.verifyRefreshToken(invalidToken);
      expect(verified).toBeNull();
    });

    it('should return null for expired refresh token', () => {
      process.env.JWT_REFRESH_EXPIRES_IN = '-1s'; // Already expired
      const token = jwtService.generateRefreshToken(mockPayload);
      const verified = jwtService.verifyRefreshToken(token);
      expect(verified).toBeNull();
    });

    it('should return null for token signed with wrong refresh secret', () => {
      const token = jwtService.generateRefreshToken(mockPayload);
      process.env.JWT_REFRESH_SECRET = 'different-refresh-secret';
      const verified = jwtService.verifyRefreshToken(token);
      expect(verified).toBeNull();
    });
  });

  describe('Token roundtrip', () => {
    it('should maintain payload integrity through access token cycle', () => {
      const token = jwtService.generateAccessToken(mockPayload);
      const verified = jwtService.verifyAccessToken(token);
      
      expect(verified!.userId).toBe(mockPayload.userId);
      expect(verified!.email).toBe(mockPayload.email);
    });

    it('should maintain payload integrity through refresh token cycle', () => {
      const token = jwtService.generateRefreshToken(mockPayload);
      const verified = jwtService.verifyRefreshToken(token);
      
      expect(verified!.userId).toBe(mockPayload.userId);
      expect(verified!.email).toBe(mockPayload.email);
    });

    it('should generate different tokens for access and refresh', () => {
      const accessToken = jwtService.generateAccessToken(mockPayload);
      const refreshToken = jwtService.generateRefreshToken(mockPayload);
      
      expect(accessToken).not.toBe(refreshToken);
    });
  });
});
