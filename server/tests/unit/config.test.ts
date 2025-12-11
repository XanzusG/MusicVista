describe('Jest Configuration Test', () => {
  it('should recognize Jest globals', () => {
    expect(true).toBe(true);
    expect(jest).toBeDefined();
  });

  it('should support async/await', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });

  it('should support mocking', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
