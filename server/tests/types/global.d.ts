// Jest global types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveBeenCalledWithTimes(times: number): R;
    }
  }
}

// Global test utilities
declare namespace NodeJS {
  interface Global {
    testDbConfig: any;
    testPool: any;
  }
}

export {};