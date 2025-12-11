// Mock pg library
import { jest } from '@jest/globals';

export const pool = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
  on: jest.fn(),
} as any;

export const Pool = jest.fn().mockImplementation(() => pool) as any;