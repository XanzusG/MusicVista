# MusicVista Backend Testing Guide

This document explains the testing structure and execution methods for the MusicVista backend project.

## 📁 Test Directory Structure

```
tests/
├── __mocks__/           # Mock files
├── database/            # Test database configuration
│   └── testDbConfig.ts
├── integration/         # Integration tests
│   └── artists.test.ts
├── unit/                # Unit tests
│   ├── controllers/     # Controller tests
│   ├── middleware/      # Middleware tests
│   ├── services/        # Service layer tests
│   └── utils/           # Utility function tests
├── setup.ts             # Test environment setup
├── runTests.js          # Test execution script
└── README.md            # This document
```

## 🧪 Test Types

### 1. Unit Tests
Tests individual functions, classes, or component functionality.

- **Location**: `tests/unit/`
- **Scope**: Utility functions, service methods, controller methods, middleware
- **Characteristics**: Fast execution, isolated tests, uses Mocks

### 2. Integration Tests
Tests collaboration between multiple components.

- **Location**: `tests/integration/`
- **Scope**: API endpoints, database interactions
- **Characteristics**: Real environment testing, slower execution

## 🚀 Running Tests

### Using npm Scripts

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests in CI mode
npm run test:ci
```

### Using Test Script

```bash
# Run all tests
node tests/runTests.js

# Run unit tests
node tests/runTests.js unit

# Run integration tests
node tests/runTests.js integration

# Watch mode
node tests/runTests.js watch

# Generate coverage
node tests/runTests.js coverage
```

## 📊 Coverage Configuration

Coverage thresholds are defined in `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 80,
    statements: 80
  }
}
```

## 🔧 Test Configuration

### Jest Configuration (jest.config.js)
- TypeScript support: `ts-jest`
- Test environment: Node.js
- Coverage reports: text, lcov, html, json
- Path mapping: Supports @/ alias

### Test Environment Setup (tests/setup.ts)
- Set test environment variables
- Clean test data
- Configure global timeout

### Mock Configuration
- External services: Configured separately in test files

## 📝 Writing Tests Guide

### 1. Unit Test Example

```typescript
describe('FunctionName', () => {
  beforeEach(() => {
    // Pre-test setup
  });

  it('should return expected result when given valid input', () => {
    // Test logic
  });

  it('should handle errors when given invalid input', () => {
    // Error handling test
  });
});
```

### 2. Integration Test Example

```typescript
describe('API Endpoint', () => {
  it('should return 200 on success', async () => {
    const response = await request(app)
      .get('/api/resource')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
  });
});
```

## 🎯 Testing Best Practices

### 1. Test Naming
- Use descriptive test names
- Format: `should [expected behavior] when [condition]`

### 2. Test Structure (AAA Pattern)
- **Arrange**: Prepare test data and Mocks
- **Act**: Execute the code being tested
- **Assert**: Verify results

### 3. Mock Usage
- Mock external dependencies
- Avoid real database connections
- Reset Mock state

### 4. Test Data
- Use minimal test data
- Avoid depending on external data
- Clean up data produced by tests

## 🔍 Debugging Tests

### 1. Use Debug Mode
```bash
npm run test:debug
```

### 2. View Verbose Output
```bash
npm run test:verbose
```

### 3. Run Specific Tests
```bash
npm test -- path/to/test.test.ts
```

## 📈 CI/CD Integration

Use in continuous integration environments:

```bash
npm run test:ci
```

This command will:
- Run all tests
- Generate coverage reports
- Output machine-readable results
- Not enter watch mode

## 🐛 Common Issues

### 1. Database Connection Error
Ensure test database configuration is correct:
- Check test database settings in `.env` file
- Ensure test database is accessible

### 2. Mock Not Working
- Check Mock file path
- Ensure Mocks are properly imported before use

### 3. Test Timeout
- Increase test timeout duration
- Check if async operations are handled correctly

## 📚 Reference Resources

- [Jest Official Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [TypeScript Jest Configuration](https://kulshekhar.github.io/ts-jest/)
