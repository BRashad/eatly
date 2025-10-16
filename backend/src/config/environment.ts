import "dotenv/config";

interface EnvironmentConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  databaseUrl: string;
  logLevel: "error" | "warn" | "info" | "debug";
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateNodeEnv(
  value: string | undefined
): EnvironmentConfig["nodeEnv"] {
  const validEnvs: EnvironmentConfig["nodeEnv"][] = [
    "development",
    "test",
    "production",
  ];
  if (value && validEnvs.includes(value as EnvironmentConfig["nodeEnv"])) {
    return value as EnvironmentConfig["nodeEnv"];
  }
  return "development";
}

function validatePort(value: string | undefined): number {
  const port = Number(value ?? 5000);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid PORT value: ${value}. Must be a number between 1 and 65535.`
    );
  }
  return port;
}

function validateLogLevel(
  value: string | undefined
): EnvironmentConfig["logLevel"] {
  const validLevels: EnvironmentConfig["logLevel"][] = [
    "error",
    "warn",
    "info",
    "debug",
  ];
  if (value && validLevels.includes(value as EnvironmentConfig["logLevel"])) {
    return value as EnvironmentConfig["logLevel"];
  }
  return "info";
}

export const environment: EnvironmentConfig = {
  nodeEnv: validateNodeEnv(process.env.NODE_ENV),
  port: validatePort(process.env.PORT),
  databaseUrl: requireEnv("DATABASE_URL"),
  logLevel: validateLogLevel(process.env.LOG_LEVEL),
};
