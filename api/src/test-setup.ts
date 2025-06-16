import 'reflect-metadata';

// Declare Jest globals to fix TypeScript errors
declare global {
  var jest: any;
  var describe: any;
  var it: any;
  var expect: any;
  var beforeEach: any;
  var afterEach: any;
  var beforeAll: any;
  var afterAll: any;
}

// Setup test environment
beforeEach(() => {
  // Clear all mocks before each test
  if (typeof jest !== 'undefined') {
    jest.clearAllMocks();
  }
}); 