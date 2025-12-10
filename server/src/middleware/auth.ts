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
      message: '缺少访问令牌',
      error: {
        code: 'MISSING_TOKEN',
        details: '需要在请求头中提供Bearer token'
      }
    });
    return;
  }

  const payload = jwtService.verifyAccessToken(token);
  
  if (!payload) {
    res.status(403).json({
      success: false,
      message: '无效的访问令牌',
      error: {
        code: 'INVALID_TOKEN',
        details: '令牌已过期或无效'
      }
    });
    return;
  }

  // 验证用户是否存在且处于活跃状态
  const user = await UserService.getUserById(payload.userId);
  if (!user) {
    res.status(403).json({
      success: false,
      message: '用户不存在',
      error: {
        code: 'USER_NOT_FOUND',
        details: '令牌对应的用户不存在'
      }
    });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      success: false,
      message: '用户账户已被禁用',
      error: {
        code: 'USER_INACTIVE',
        details: '用户账户处于非活跃状态'
      }
    });
    return;
  }

  // 将用户信息（不包含密码）附加到请求对象
  req.user = user;
  req.tokenPayload = payload;
  
  next();
};

// 可选的认证中间件 - 如果有token则验证，没有token也允许访问
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

// 检查用户是否为管理员的中间件
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: '未认证',
      error: {
        code: 'UNAUTHENTICATED',
        details: '需要认证才能访问此资源'
      }
    });
    return;
  }

  // 在这里可以添加管理员权限检查逻辑
  // 例如检查用户角色或特定权限
  // 目前我们假设所有认证用户都有基本权限
  
  next();
};

// 验证用户是否正在访问自己的资源的中间件
export const requireSelfOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: '未认证',
      error: {
        code: 'UNAUTHENTICATED',
        details: '需要认证才能访问此资源'
      }
    });
    return;
  }

  const targetUserId = req.params.userId || req.params.id;
  
  if (req.user.id === targetUserId) {
    next();
    return;
  }

  // 在这里可以添加管理员检查逻辑
  // 目前拒绝访问
  res.status(403).json({
    success: false,
    message: '权限不足',
    error: {
      code: 'INSUFFICIENT_PERMISSIONS',
      details: '只能访问自己的资源'
    }
  });
};