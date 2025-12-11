import { Response } from 'express';
import { sendSuccess, sendError, handleControllerError } from '../../../src/utils/response';

// Mock Express Response object
const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
} as any;

// Mock console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

beforeEach(() => {
  jest.clearAllMocks();
  mockResponse.status.mockReturnValue(mockResponse);
  mockResponse.json.mockReturnValue(mockResponse);
});

afterEach(() => {
  mockConsoleError.mockClear();
});

describe('Response Utils', () => {
  describe('sendSuccess', () => {
    it('should send success response with default status code', () => {
      const testData = { id: 1, name: 'Test' };
      
      sendSuccess(mockResponse, testData);
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        timestamp: expect.any(String)
      });
    });

    it('should send success response with custom status code', () => {
      const testData = { created: true };
      
      sendSuccess(mockResponse, testData, 201);
      
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        timestamp: expect.any(String)
      });
    });

    it('should send success response with null data', () => {
      sendSuccess(mockResponse, null);
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: null,
        timestamp: expect.any(String)
      });
    });

    it('should send success response with undefined data', () => {
      sendSuccess(mockResponse, undefined);
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: undefined,
        timestamp: expect.any(String)
      });
    });

    it('should send success response with empty object', () => {
      sendSuccess(mockResponse, {});
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {},
        timestamp: expect.any(String)
      });
    });

    it('should send success response with array data', () => {
      const testData = [1, 2, 3];
      
      sendSuccess(mockResponse, testData);
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        timestamp: expect.any(String)
      });
    });

    it('should include timestamp in ISO format', () => {
      const before = new Date().toISOString();
      sendSuccess(mockResponse, { test: 'data' });
      const after = new Date().toISOString();
      
      const callArgs = mockResponse.json.mock.calls[0][0];
      const timestamp = callArgs.timestamp;
      
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(timestamp >= before).toBe(true);
      expect(timestamp <= after).toBe(true);
    });
  });

  describe('sendError', () => {
    it('should send error response with default status code', () => {
      const errorMessage = 'Something went wrong';
      
      sendError(mockResponse, errorMessage);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
        timestamp: expect.any(String)
      });
    });

    it('should send error response with custom status code', () => {
      const errorMessage = 'Not found';
      
      sendError(mockResponse, errorMessage, 404);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
        timestamp: expect.any(String)
      });
    });

    it('should send error response with empty string', () => {
      sendError(mockResponse, '', 400);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: '',
        timestamp: expect.any(String)
      });
    });

    it('should send error response with long error message', () => {
      const longErrorMessage = 'A'.repeat(1000);
      
      sendError(mockResponse, longErrorMessage);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: longErrorMessage,
        timestamp: expect.any(String)
      });
    });

    it('should include timestamp in error response', () => {
      sendError(mockResponse, 'Test error');
      
      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('handleControllerError', () => {
    it('should log error and send error response', () => {
      const error = new Error('Controller error');
      const context = 'testController';
      
      handleControllerError(mockResponse, error, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith(`Error in ${context}:`, error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: error.message,
        timestamp: expect.any(String)
      });
    });

    it('should handle string error', () => {
      const error = 'String error message';
      const context = 'testController';
      
      handleControllerError(mockResponse, error, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith(`Error in ${context}:`, error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'String error message',
        timestamp: expect.any(String)
      });
    });

    it('should handle error object without message property', () => {
      const error = { code: 1234, details: 'Something failed' };
      const context = 'testController';
      
      handleControllerError(mockResponse, error, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith(`Error in ${context}:`, error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 1234, details: 'Something failed' },
        timestamp: expect.any(String)
      });
    });

    it('should handle null error', () => {
      const context = 'testController';
      
      handleControllerError(mockResponse, null, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith(`Error in ${context}:`, null);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown error',
        timestamp: expect.any(String)
      });
    });

    it('should handle undefined error', () => {
      const context = 'testController';
      
      handleControllerError(mockResponse, undefined, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith(`Error in ${context}:`, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unknown error',
        timestamp: expect.any(String)
      });
    });

    it('should handle error with custom context', () => {
      const error = new Error('Custom error');
      const context = 'customControllerHandler';
      
      handleControllerError(mockResponse, error, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith(`Error in ${context}:`, error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should always use status 500 for controller errors', () => {
      handleControllerError(mockResponse, new Error('Any error'), 'anyContext');
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });

    it('should include timestamp in controller error response', () => {
      handleControllerError(mockResponse, new Error('Test error'), 'testContext');
      
      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Response consistency', () => {
    it('should always include success field set to true in success responses', () => {
      sendSuccess(mockResponse, {});
      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs.success).toBe(true);
    });

    it('should always include success field set to false in error responses', () => {
      sendError(mockResponse, 'Error');
      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs.success).toBe(false);
    });

    it('should always include timestamp in all response types', () => {
      sendSuccess(mockResponse, {});
      const successCallArgs = mockResponse.json.mock.calls[0][0];
      expect(successCallArgs.timestamp).toBeDefined();
      
      mockResponse.json.mockClear();
      
      sendError(mockResponse, 'Error');
      const errorCallArgs = mockResponse.json.mock.calls[0][0];
      expect(errorCallArgs.timestamp).toBeDefined();
      
      mockResponse.json.mockClear();
      
      handleControllerError(mockResponse, new Error('Error'), 'context');
      const controllerCallArgs = mockResponse.json.mock.calls[0][0];
      expect(controllerCallArgs.timestamp).toBeDefined();
    });
  });
});
