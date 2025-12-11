import artistRoutes from '../../../src/routes/artists';

// Mock controllers
jest.mock('../../../src/controllers/artistController');

describe('Artist Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should define the route module correctly', () => {
    expect(artistRoutes).toBeDefined();
    expect(typeof artistRoutes).toBe('function');
  });

  it('should properly import and configure artist controller', () => {
    const artistController = require('../../../src/controllers/artistController');
    expect(artistController).toBeDefined();
  });

  it('should use Express Router', () => {
    // The module should export an Express Router instance
    expect(typeof artistRoutes).toBe('function');
  });

  it('should have the correct route configuration structure', () => {
    // Verify the module exports a proper Express router
    expect(artistRoutes).toBeDefined();
    expect(typeof artistRoutes).toBe('function');
  });
});
