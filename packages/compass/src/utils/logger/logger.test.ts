import { throwCompassError, logger } from './logger';

describe('throwCompassError', () => {
  it('should throw an error with the correct message', () => {
    expect(() => throwCompassError({ message: 'Test Error' })).toThrowError(
      '[Compass]: Test Error',
    );
  });

  it('should throw an error with the correct message and moduleName', () => {
    expect(() => throwCompassError({ message: 'Test Error', moduleName: 'ModuleX' })).toThrowError(
      '[Compass: ModuleX]: Test Error',
    );
  });
});

describe('logger', () => {
  // Mock console methods to capture logs during tests
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

  afterEach(() => {
    // Clear mock console methods after each test
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleLog.mockClear();
  });

  it('should log an error message without the module name', () => {
    logger({ message: 'Test Error', type: 'error' });
    expect(mockConsoleError).toHaveBeenCalledWith('[Compass]: Test Error');
  });

  it('should log an error message with the correct prefix', () => {
    logger({ message: 'Test Error', moduleName: 'ModuleX', type: 'error' });
    expect(mockConsoleError).toHaveBeenCalledWith('[Compass: ModuleX]: Test Error');
  });

  it('should log a warning message with the correct prefix', () => {
    logger({ message: 'Test Warning', moduleName: 'ModuleY', type: 'warn' });
    expect(mockConsoleWarn).toHaveBeenCalledWith('[Compass: ModuleY]: Test Warning');
  });

  it('should log a regular message with the correct prefix', () => {
    logger({ message: 'Test Log', moduleName: 'ModuleZ', type: 'log' });
    expect(mockConsoleLog).toHaveBeenCalledWith('[Compass: ModuleZ]: Test Log');
  });
});
