import { Pool } from 'pg';
import { pool } from '../../../src/database/connection';

// Mock the pg module
jest.mock('pg');
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Mock console methods to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);

describe('Database Connection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'test_db',
      DB_USER: 'test_user',
      DB_PASSWORD: 'test_password'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Pool Configuration', () => {
    it('should create pool with correct configuration', () => {
      const mockPool = {
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined)
      } as any;

      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      // Re-require the module to test constructor
      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith({
        host: 'localhost',
        port: 5432,
        database: 'test_db',
        user: 'test_user',
        password: 'test_password',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 100000,
        ssl: {
          rejectUnauthorized: false
        }
      });
    });

    it('should use default port when DB_PORT is not set', () => {
      delete process.env.DB_PORT;
      const mockPool = { on: jest.fn(), end: jest.fn() } as any;
      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 5432
        })
      );
    });

    it('should use custom port when DB_PORT is set', () => {
      process.env.DB_PORT = '5433';
      const mockPool = { on: jest.fn(), end: jest.fn() } as any;
      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 5433
        })
      );
    });

    it('should configure SSL to allow unauthorized certificates', () => {
      const mockPool = { on: jest.fn(), end: jest.fn() } as any;
      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith(
        expect.objectContaining({
          ssl: {
            rejectUnauthorized: false
          }
        })
      );
    });

    it('should set max connections to 20', () => {
      const mockPool = { on: jest.fn(), end: jest.fn() } as any;
      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith(
        expect.objectContaining({
          max: 20
        })
      );
    });

    it('should set connection timeout to 100000ms', () => {
      const mockPool = { on: jest.fn(), end: jest.fn() } as any;
      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith(
        expect.objectContaining({
          connectionTimeoutMillis: 100000
        })
      );
    });
  });

  describe('Event Handlers', () => {
    it('should set up connect event handler', () => {
      const mockPool = {
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined)
      } as any;

      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(mockPool.on).toHaveBeenCalledWith('connect', expect.any(Function));
    });

    it('should set up error event handler', () => {
      const mockPool = {
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined)
      } as any;

      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(mockPool.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should log message on connect event', () => {
      const mockPool = {
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined)
      } as any;

      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      // Get the connect handler
      const connectHandler = mockPool.on.mock.calls.find(
        (call: any) => call[0] === 'connect'
      )?.[1];

      if (connectHandler) {
        connectHandler();
        expect(mockConsoleLog).toHaveBeenCalledWith('Database connected successfully');
      }
    });

    it('should log error and exit process on error event', () => {
      const mockPool = {
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined)
      } as any;
      const testError = new Error('Database error');

      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      // Get the error handler
      const errorHandler = mockPool.on.mock.calls.find(
        (call: any) => call[0] === 'error'
      )?.[1];

      if (errorHandler) {
        errorHandler(testError);
        expect(mockConsoleError).toHaveBeenCalledWith('Unexpected error on idle client', testError);
        expect(mockProcessExit).toHaveBeenCalledWith(-1);
      }
    });
  });

  describe('Process Signal Handlers', () => {
    it('should set up SIGINT handler', () => {
      const mockPool = {
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined)
      } as any;

      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      // Simulate SIGINT
      const originalListeners = process.listeners('SIGINT');
      const sigintListener = originalListeners[originalListeners.length - 1];

      expect(typeof sigintListener).toBe('function');
    });

    it('should end pool and exit on SIGINT', async () => {
      const mockPool = {
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(undefined)
      } as any;

      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      // Get the SIGINT handler
      const originalListeners = process.listeners('SIGINT');
      const sigintListener = originalListeners[originalListeners.length - 1];

      if (typeof sigintListener === 'function') {
        await (sigintListener as any)('SIGINT');
        expect(mockPool.end).toHaveBeenCalled();
        expect(mockConsoleLog).toHaveBeenCalledWith('Database pool has ended');
        expect(mockProcessExit).toHaveBeenCalledWith(0);
      }
    });
  });

  describe('Export', () => {
    it('should export pool instance', () => {
      expect(pool).toBeDefined();
      expect(pool).toBeInstanceOf(Pool);
    });

    it('should export pool as default export', () => {
      const defaultExport = require('../../../src/database/connection').default;
      expect(defaultExport).toBe(pool);
    });
  });

  describe('Environment Variables', () => {
    it('should handle missing environment variables', () => {
      process.env = {
        DB_HOST: undefined,
        DB_PORT: undefined,
        DB_NAME: undefined,
        DB_USER: undefined,
        DB_PASSWORD: undefined
      };

      const mockPool = { on: jest.fn(), end: jest.fn() } as any;
      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith(
        expect.objectContaining({
          host: undefined,
          database: undefined,
          user: undefined,
          password: undefined
        })
      );
    });

    it('should handle invalid DB_PORT value', () => {
      process.env.DB_PORT = 'invalid_port';
      const mockPool = { on: jest.fn(), end: jest.fn() } as any;
      (Pool as jest.MockedClass<typeof Pool>).mockImplementation(() => mockPool);

      jest.isolateModules(() => {
        require('../../../src/database/connection');
      });

      expect(Pool).toHaveBeenCalledWith(
        expect.objectContaining({
          port: undefined // parseInt returns NaN for invalid input
        })
      );
    });
  });
});
