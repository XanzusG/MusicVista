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

// 全局错误处理中间件
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || '服务器内部错误';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details;

  // 开发环境下的错误详情
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // 处理验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '请求数据验证失败';
    code = 'VALIDATION_ERROR';
    details = err.details || '输入数据不符合要求';
  }

  // 处理JWT错误
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的令牌';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '令牌已过期';
    code = 'TOKEN_EXPIRED';
  }

  // 处理文件未找到错误
  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = '资源未找到';
    code = 'NOT_FOUND';
  }

  // 处理重复键错误（数据库层面）
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === '23505') {
    statusCode = 409;
    message = '数据已存在';
    code = 'DUPLICATE_RESOURCE';
    details = '请求的资源已存在';
  }

  // 处理权限错误
  if (err.name === 'UnauthorizedError') {
    statusCode = 403;
    message = '权限不足';
    code = 'INSUFFICIENT_PERMISSIONS';
  }

  // 设置响应头
  res.setHeader('Content-Type', 'application/json');
  
  // 构建错误响应
  const errorResponse: any = {
    success: false,
    message,
    error: {
      code,
    }
  };

  // 在开发环境中包含详细信息和错误堆栈
  if (isDevelopment) {
    errorResponse.error.details = details;
    if (err.stack) {
      errorResponse.stack = err.stack;
    }
  }

  res.status(statusCode).json(errorResponse);
};

// 404处理中间件
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = createError(`路由 ${req.originalUrl} 未找到`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

// 异步错误处理包装器
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 请求日志记录中间件
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url, ip } = req;
    const { statusCode } = res;
    
    // 根据状态码设置日志级别颜色
    const level = statusCode >= 400 ? 'ERROR' : statusCode >= 300 ? 'WARN' : 'INFO';
    
    console.log(`[${new Date().toISOString()}] ${level} ${method} ${url} - ${statusCode} - ${duration}ms - IP: ${ip}`);
  });
  
  next();
};