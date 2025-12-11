# MusicVista 后端测试指南

本文档说明了 MusicVista 后端项目的测试结构和运行方式。

## 📁 测试目录结构

```
tests/
├── __mocks__/           # Mock 文件
│   └── pg.ts           # PostgreSQL Mock
├── database/           # 测试数据库配置
│   └── testDbConfig.ts
├── integration/        # 集成测试
│   └── artists.test.ts
├── unit/              # 单元测试
│   ├── controllers/   # 控制器测试
│   ├── middleware/    # 中间件测试
│   ├── services/      # 服务层测试
│   └── utils/         # 工具函数测试
├── setup.ts           # 测试环境设置
├── runTests.js        # 测试运行脚本
└── README.md          # 本文档
```

## 🧪 测试类型

### 1. 单元测试 (Unit Tests)
测试单个函数、类或组件的功能。

- **位置**: `tests/unit/`
- **范围**: 工具函数、服务方法、控制器方法、中间件
- **特点**: 快速执行、隔离测试、使用 Mock

### 2. 集成测试 (Integration Tests)
测试多个组件之间的协作。

- **位置**: `tests/integration/`
- **范围**: API 端点、数据库交互
- **特点**: 真实环境测试、较慢执行

## 🚀 运行测试

### 使用 npm 脚本

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch

# CI 模式运行测试
npm run test:ci
```

### 使用测试运行脚本

```bash
# 运行所有测试
node tests/runTests.js all

# 运行单元测试
node tests/runTests.js unit

# 运行集成测试
node tests/runTests.js integration

# 监听模式
node tests/runTests.js watch

# 生成覆盖率
node tests/runTests.js coverage
```

## 📊 覆盖率配置

覆盖率阈值在 `jest.config.js` 中定义：

```javascript
coverageThresholds: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  },
  './src/utils/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  }
}
```

## 🔧 测试配置

### Jest 配置 (jest.config.js)
- TypeScript 支持: `ts-jest`
- 测试环境: Node.js
- 覆盖率报告: text, lcov, html, json
- 路径映射: 支持 @/ 别名

### 测试环境设置 (tests/setup.ts)
- 设置测试环境变量
- 清理测试数据
- 配置全局超时时间

### Mock 配置
- PostgreSQL: `tests/__mocks__/pg.ts`
- 外部服务: 在测试文件中单独配置

## 📝 编写测试指南

### 1. 单元测试示例

```typescript
import { functionName } from '../../../src/utils/file';
describe('functionName', () => {
  beforeEach(() => {
    // 测试前准备
  });

  it('should return expected result', () => {
    // 测试逻辑
    expect(result).toEqual(expected);
  });

  it('should handle errors', () => {
    // 错误处理测试
  });
});
```

### 2. 集成测试示例

```typescript
import request from 'supertest';
import app from '../../src/app';

describe('API Endpoint', () => {
  it('should return 200 for valid request', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

## 🎯 测试最佳实践

### 1. 测试命名
- 使用描述性的测试名称
- 格式: `should [expected behavior] when [condition]`

### 2. 测试结构 (AAA 模式)
- **Arrange**: 准备测试数据和 Mock
- **Act**: 执行被测试的代码
- **Assert**: 验证结果

### 3. Mock 使用
- Mock 外部依赖
- 避免真实数据库连接
- 重置 Mock 状态

### 4. 测试数据
- 使用最小化的测试数据
- 避免依赖外部数据
- 清理测试产生的数据

## 🔍 调试测试

### 1. 使用调试模式
```bash
npm run test:debug
```

### 2. 查看详细输出
```bash
npm run test:verbose
```

### 3. 运行特定测试
```bash
npm test -- --testNamePattern="specific test name"
```

## 📈 CI/CD 集成

在持续集成环境中使用：
```bash
npm run test:ci
```

该命令会：
- 运行所有测试
- 生成覆盖率报告
- 输出机器可读的结果
- 不进入监听模式

## 🐛 常见问题

### 1. 数据库连接错误
确保测试数据库配置正确：
- 检查 `.env` 文件中的测试数据库设置
- 确保测试数据库可访问

### 2. Mock 不生效
- 检查 Mock 文件路径
- 确保在使用前正确引入 Mock

### 3. 测试超时
- 增加测试超时时间
- 检查异步操作是否正确处理

## 📚 参考资源

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [Supertest 文档](https://github.com/visionmedia/supertest)
- [TypeScript Jest 配置](https://kulshekhar.github.io/ts-jest/)