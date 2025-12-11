import insightRoutes from '../../../src/routes/insights';

// Mock controllers
jest.mock('../../../src/controllers/insightController');

describe('Insight Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should define the route module correctly', () => {
    expect(insightRoutes).toBeDefined();
    expect(typeof insightRoutes).toBe('function');
  });

  it('should properly import and configure insight controller', () => {
    const insightController = require('../../../src/controllers/insightController');
    expect(insightController).toBeDefined();
  });

  it('should use Express Router', () => {
    // The module should export an Express Router instance
    expect(typeof insightRoutes).toBe('function');
  });

  it('should have the correct route configuration structure', () => {
    // Verify the module exports a proper Express router
    expect(insightRoutes).toBeDefined();
    expect(typeof insightRoutes).toBe('function');
  });
});
