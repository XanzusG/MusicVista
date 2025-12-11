import 'jest';
import { pool } from '../src/database/connection';

// 测试环境设置
beforeAll(async () => {
  // 设置测试环境变量
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = process.env.TEST_DB_NAME || 'musicvista_test';
});

afterAll(async () => {
  // 关闭数据库连接
  await pool.end();
});

// 每个测试前清理数据库
beforeEach(async () => {
  // 清理测试数据的逻辑可以在这里添加
  // 注意：实际使用时需要根据您的数据库结构来编写清理逻辑
});

// 全局测试超时时间
jest.setTimeout(30000);