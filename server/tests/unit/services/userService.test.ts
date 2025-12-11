import { UserService, User } from '../../../src/services/userService';
import { QueryResult } from 'pg';

// Create mock query function first
const mockQueryFn = jest.fn();

// Mock the database connection
jest.mock('../../../src/database/connection', () => ({
  pool: {
    query: (...args: any[]) => mockQueryFn(...args),
  },
}));

describe('UserService', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedpassword',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword: User = {
    id: '1',
    email: 'test@example.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found by ID', async () => {
      mockQueryFn.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
      } as any);

      const result = await UserService.getUserById('1');

      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by ID', async () => {
      mockQueryFn.mockResolvedValue({
        rows: [],
        rowCount: 0,
      } as any);

      const result = await UserService.getUserById('999');

      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['999']);
      expect(result).toBeNull();
    });

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database connection failed');
      mockQueryFn.mockRejectedValue(dbError);

      await expect(UserService.getUserById('1')).rejects.toThrow(dbError);
      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found by email', async () => {
      mockQueryFn.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
      } as any);

      const result = await UserService.getUserByEmail('test@example.com');

      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      mockQueryFn.mockResolvedValue({
        rows: [],
        rowCount: 0,
      } as any);

      const result = await UserService.getUserByEmail('nonexistent@example.com');

      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['nonexistent@example.com']);
      expect(result).toBeNull();
    });

    it('should throw error when database query fails', async () => {
      const dbError = new Error('Database error');
      mockQueryFn.mockRejectedValue(dbError);

      await expect(UserService.getUserByEmail('test@example.com')).rejects.toThrow(dbError);
      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    });
  });

  describe('createUser', () => {
    it('should create user with all required fields', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        isActive: true,
      };

      const expectedUser = {
        ...userData,
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockQueryFn.mockResolvedValue({
        rows: [expectedUser],
        rowCount: 1,
      } as any);

      const result = await UserService.createUser(userData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users (email, password, is_active, created_at, updated_at)'),
        ['newuser@example.com', 'password123', true]
      );
      expect(result).toEqual(expectedUser);
    });

    it('should create user with default isActive true when not provided', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      const expectedUser = {
        ...userData,
        isActive: true,
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockQueryFn.mockResolvedValue({
        rows: [expectedUser],
        rowCount: 1,
      } as any);

      const result = await UserService.createUser(userData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['newuser@example.com', 'password123', true]
      );
      expect(result).toEqual(expectedUser);
    });

    it('should create user with explicit isActive false', async () => {
      const userData = {
        email: 'inactive@example.com',
        password: 'password123',
        isActive: false,
      };

      mockQueryFn.mockResolvedValue({
        rows: [userData],
        rowCount: 1,
      } as any);

      const result = await UserService.createUser(userData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['inactive@example.com', 'password123', false]
      );
      expect(result).toEqual(userData);
    });

    it('should throw error when database insertion fails', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
      };

      const dbError = new Error('Duplicate email');
      mockQueryFn.mockRejectedValue(dbError);

      await expect(UserService.createUser(userData)).rejects.toThrow(dbError);
      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['duplicate@example.com', 'password123', true]
      );
    });
  });

  describe('updateUser', () => {
    it('should update user with partial data', async () => {
      const updateData = {
        email: 'updated@example.com',
        isActive: false,
      };

      const updatedUser = {
        ...mockUser,
        ...updateData,
        updatedAt: new Date(),
      };

      mockQueryFn.mockResolvedValue({
        rows: [updatedUser],
        rowCount: 1,
      } as any);

      const result = await UserService.updateUser('1', updateData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        expect.arrayContaining(['updated@example.com', false, '1'])
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null when trying to update non-existent user', async () => {
      const updateData = {
        email: 'updated@example.com',
      };

      mockQueryFn.mockResolvedValue({
        rows: [],
        rowCount: 0,
      } as any);

      const result = await UserService.updateUser('999', updateData);

      expect(result).toBeNull();
    });

    it('should return existing user when no valid update fields provided', async () => {
      const updateData = {
        id: 'should-not-update',
        createdAt: new Date(),
      };

      mockQueryFn.mockResolvedValueOnce({
        rows: [mockUser],
        rowCount: 1,
      } as any);

      const result = await UserService.updateUser('1', updateData);

      expect(mockQueryFn).toHaveBeenCalledTimes(1);
      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
      expect(result).toEqual(mockUser);
    });

    it('should handle updating only email', async () => {
      const updateData = {
        email: 'only-email@example.com',
      };

      const updatedUser = {
        ...mockUser,
        email: 'only-email@example.com',
        updatedAt: new Date(),
      };

      mockQueryFn.mockResolvedValue({
        rows: [updatedUser],
        rowCount: 1,
      } as any);

      const result = await UserService.updateUser('1', updateData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('email = $1, updated_at = NOW()'),
        ['only-email@example.com', '1']
      );
      expect(result).toEqual(updatedUser);
    });

    it('should handle updating only isActive', async () => {
      const updateData = {
        isActive: false,
      };

      const updatedUser = {
        ...mockUser,
        isActive: false,
        updatedAt: new Date(),
      };

      mockQueryFn.mockResolvedValue({
        rows: [updatedUser],
        rowCount: 1,
      } as any);

      const result = await UserService.updateUser('1', updateData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('is_active = $1, updated_at = NOW()'),
        [false, '1']
      );
      expect(result).toEqual(updatedUser);
    });

    it('should ignore undefined values in update data', async () => {
      const updateData = {
        email: 'updated@example.com',
        password: undefined,
        isActive: true,
      };

      const updatedUser = {
        ...mockUser,
        email: 'updated@example.com',
        updatedAt: new Date(),
      };

      mockQueryFn.mockResolvedValue({
        rows: [updatedUser],
        rowCount: 1,
      } as any);

      const result = await UserService.updateUser('1', updateData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET email = $1, is_active = $2, updated_at = NOW()'),
        ['updated@example.com', true, '1']
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when database update fails', async () => {
      const updateData = {
        email: 'error@example.com',
      };

      const dbError = new Error('Update failed');
      mockQueryFn.mockRejectedValue(dbError);

      await expect(UserService.updateUser('1', updateData)).rejects.toThrow(dbError);
      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        expect.arrayContaining(['error@example.com', '1'])
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty user object in createUser', async () => {
      const userData = {};

      mockQueryFn.mockResolvedValue({
        rows: [mockUser],
        rowCount: 1,
      } as any);

      const result = await UserService.createUser(userData);

      expect(mockQueryFn).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [undefined, undefined, true]
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle special characters in email', async () => {
      const email = 'test+special@example-domain.co.uk';
      mockQueryFn.mockResolvedValue({
        rows: [{ ...mockUser, email }],
        rowCount: 1,
      } as any);

      const result = await UserService.getUserByEmail(email);

      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [email]);
      expect(result?.email).toBe(email);
    });

    it('should handle very long user ID', async () => {
      const longId = 'a'.repeat(100);
      mockQueryFn.mockResolvedValue({
        rows: [],
        rowCount: 0,
      } as any);

      const result = await UserService.getUserById(longId);

      expect(mockQueryFn).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [longId]);
      expect(result).toBeNull();
    });
  });
});
