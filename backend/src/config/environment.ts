import "dotenv/config";

interface EnvironmentConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  databaseUrl: string;
  logLevel: "error" | "warn" | "info" | "debug";
  corsOrigins: string[];
  openFoodFacts: {
    username: string;
    password: string;
    userAgent: string;
    baseUrl: string;
  };
}

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function validateNodeEnv(
  value: string | undefined,
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
      `Invalid PORT value: ${value}. Must be a number between 1 and 65535.`,
    );
  }
  return port;
}

function validateLogLevel(
  value: string | undefined,
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

const nodeEnv = validateNodeEnv(process.env.NODE_ENV);

export const environment: EnvironmentConfig = {
  nodeEnv,
  port: validatePort(process.env.PORT),
  databaseUrl: requireEnv(
    "DATABASE_URL",
    nodeEnv === "development"
      ? "postgresql://postgres:postgres@localhost:5432/foodscan"
      : undefined,
  ),
  logLevel: validateLogLevel(process.env.LOG_LEVEL),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:8081,http://localhost:8082,http://localhost:8080,http://localhost:3000').split(','),
  openFoodFacts: {
    username: requireEnv("OPENFOODFACTS_USERNAME"),
    password: requireEnv("OPENFOODFACTS_PASSWORD"),
    userAgent: requireEnv("OPENFOODFACTS_USER_AGENT", "FoodScanApp/1.0 (unknown@example.com)"),
    baseUrl: nodeEnv === "development" 
      ? "https://world.openfoodfacts.org" 
      : "https://world.openfoodfacts.org",
  },
};
