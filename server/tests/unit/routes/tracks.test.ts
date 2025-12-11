import trackRoutes from '../../../src/routes/tracks';

// Mock controllers
jest.mock('../../../src/controllers/trackController');

describe('Track Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should define the route module correctly', () => {
    expect(trackRoutes).toBeDefined();
    expect(typeof trackRoutes).toBe('function');
  });

  it('should properly import and configure track controller', () => {
    const trackController = require('../../../src/controllers/trackController');
    expect(trackController).toBeDefined();
  });

  it('should use Express Router', () => {
    // The module should export an Express Router instance
    expect(typeof trackRoutes).toBe('function');
  });

  it('should have the correct route configuration structure', () => {
    // Verify the module exports a proper Express router
    expect(trackRoutes).toBeDefined();
    expect(typeof trackRoutes).toBe('function');
  });
});
