interface BaseLogContext {
  requestId?: string;
  userId?: string;
  action?: string;
}

type LogContext = BaseLogContext & Record<string, unknown>;

export function logInfo(message: string, context: LogContext = {}): void {
  const { level, timestamp, message: _omitMessage, ...safeContext } = context;
  console.log(
    JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      context: safeContext,
    })
  );
}

export function logError(message: string, error: Error, context: LogContext = {}): void {
  const { level, timestamp, message: _omitMessage, ...safeContext } = context;
  console.error(
    JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      context: safeContext,
    })
  );
}
