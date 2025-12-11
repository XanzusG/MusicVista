import 'jest';
import { pool } from '../src/database/connection';

// Test environment setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = process.env.TEST_DB_NAME || 'musicvista_test';
});

afterAll(async () => {
  // Close database connection
  await pool.end();
});

// Clean up database before each test
beforeEach(async () => {
  // Logic for cleaning test data can be added here
  // Note: You need to write cleanup logic according to your database structure
});

// Global test timeout
jest.setTimeout(30000);