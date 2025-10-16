import 'dotenv/config';

interface EnvironmentConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  databaseUrl: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const environment: EnvironmentConfig = {
  nodeEnv: (process.env.NODE_ENV as EnvironmentConfig['nodeEnv']) ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: requireEnv('DATABASE_URL'),
  logLevel: (process.env.LOG_LEVEL as EnvironmentConfig['logLevel']) ?? 'info',
};
