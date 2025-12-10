import { Response } from 'express';

export function sendSuccess(res: Response, data: any, statusCode: number = 200): void {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
}

export function sendError(res: Response, error: string, statusCode: number = 500): void {
  res.status(statusCode).json({
    success: false,
    error,
    timestamp: new Date().toISOString()
  });
}

export function handleControllerError(res: Response, error: any, context: string): void {
  console.error(`Error in ${context}:`, error);
  sendError(res, error.message, 500);
}