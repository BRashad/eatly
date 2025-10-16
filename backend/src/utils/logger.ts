interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

export function logInfo(message: string, context: LogContext = {}): void {
  console.log(
    JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...context,
    })
  );
}

export function logError(message: string, error: Error, context: LogContext = {}): void {
  console.error(
    JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      ...context,
    })
  );
}
