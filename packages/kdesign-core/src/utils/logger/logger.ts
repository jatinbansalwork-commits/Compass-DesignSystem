type LogType = 'error' | 'warn' | 'log';

type LoggerOptions = {
  message: string;
  moduleName?: string;
  type: LogType;
};

type ThrowKdesignErrorOptions = {
  message: string;
  moduleName?: string;
};

const PREFIX = '[Kdesign]:';

const throwKdesignError = ({ message, moduleName }: ThrowKdesignErrorOptions): void | never => {
  if (__DEV__) {
    const prefix = moduleName ? `[Kdesign: ${moduleName}]:` : PREFIX;
    throw new Error(`${prefix} ${message}`);
  }
};

const getCommonLogger = (
  type: LogType,
): typeof console.log | typeof console.error | typeof console.warn => {
  switch (type) {
    case 'error':
      return console.error;
    case 'warn':
      return console.warn;
    case 'log':
    default:
      return console.log;
  }
};

const logger = ({ message, moduleName, type }: LoggerOptions): void => {
  if (__DEV__) {
    const prefix = moduleName ? `[Kdesign: ${moduleName}]:` : PREFIX;
    getCommonLogger(type)(`${prefix} ${message}`);
  }
};

export { throwKdesignError, logger };
