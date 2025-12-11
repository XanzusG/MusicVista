import { Request, Response, NextFunction } from 'express';
import { authenticateToken, optionalAuth, requireAdmin, requireSelfOrAdmin } from '../../../src/middleware/auth';
import { jwtService } from '../../../src/utils/auth';
import { UserService } from '../../../src/services/userService';
import { User } from '../../../src/types/index';

// Mock dependencies
jest.mock('../../../src/utils/auth');
jest.mock('../../../src/services/userService');

const mockJwtService = jwtService as jest.Mocked<typeof jwtService>;
const mockUserService = UserService as jest.Mocked<typeof UserService>;

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token provided', async () => {
      mockReq.headers = {};

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '缺少访问令牌',
        error: {
          code: 'MISSING_TOKEN',
          details: '需要在请求头中提供Bearer token'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(null);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockJwtService.verifyAccessToken).toHaveBeenCalledWith('invalid-token');
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '无效的访问令牌',
        error: {
          code: 'INVALID_TOKEN',
          details: '令牌已过期或无效'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not exist', async () => {
      const mockPayload = { userId: 'user123', email: 'user@example.com' };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(null);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '用户不存在',
        error: {
          code: 'USER_NOT_FOUND',
          details: '令牌对应的用户不存在'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user is inactive', async () => {
      const mockPayload = { userId: 'user123', email: 'user@example.com' };
      const mockUser = { id: 'user123', isActive: false };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(mockUser as User);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '用户账户已被禁用',
        error: {
          code: 'USER_INACTIVE',
          details: '用户账户处于非活跃状态'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should authenticate user successfully and call next', async () => {
      const mockPayload = { userId: 'user123', email: 'test@example.com' };
      const mockUser = { id: 'user123', isActive: true, email: 'test@example.com' };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(mockUser as User);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockReq.tokenPayload).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should call next if no token provided', async () => {
      mockReq.headers = {};

      await optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockJwtService.verifyAccessToken).not.toHaveBeenCalled();
    });

    it('should authenticate user if valid token provided', async () => {
      const mockPayload = { userId: 'user123', email: 'user@example.com' };
      const mockUser = { id: 'user123', isActive: true, email: 'user@example.com' };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(mockUser as User);

      await optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockReq.tokenPayload).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next without auth if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(null);

      await optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
      expect(mockReq.tokenPayload).toBeUndefined();
    });
  });

  describe('requireAdmin', () => {
    it('should return 401 if user is not authenticated', () => {
      mockReq.user = undefined;

      requireAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '未认证',
        error: {
          code: 'UNAUTHENTICATED',
          details: '需要认证才能访问此资源'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user is authenticated', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;

      requireAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('requireSelfOrAdmin', () => {
    it('should return 401 if user is not authenticated', () => {
      mockReq.user = undefined;
      mockReq.params = {};

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '未认证',
        error: {
          code: 'UNAUTHENTICATED',
          details: '需要认证才能访问此资源'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access to own resources via userId param', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;
      mockReq.params = { userId: 'user123' };

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow access to own resources via id param', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;
      mockReq.params = { id: 'user123' };

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access to other user resources', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;
      mockReq.params = { userId: 'user456' };

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: '权限不足',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: '只能访问自己的资源'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
