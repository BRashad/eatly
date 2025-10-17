import { drizzle } from "drizzle-orm/postgres-js";
import pg from "postgres";
import { environment } from "@config/environment";
import { logInfo, logError } from "@utils/logger";

/**
 * PostgreSQL database connection using Drizzle ORM
 * Follows connection pooling best practices for production
 */

// Initialize postgres client with connection string
const client = pg(environment.databaseUrl, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20s
  connect_timeout: 10, // Fail fast if DB is down
});

// Initialize Drizzle ORM with postgres client
export const db = drizzle(client);

// Log connection info for debugging
logInfo('Database client initialized', {
  action: 'db_init',
});

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    
    logInfo('Database connection test successful', {
      action: 'db_test',
    });
    
    return true;
  } catch (error) {
    logError('Database connection test failed', error instanceof Error ? error : new Error(String(error)), {
      action: 'db_test',
    });
    return false;
  }
}

/**
 * Close database connections gracefully
 */
export async function closeDatabase(): Promise<void> {
  try {
    await client.end();
    logInfo('Database connections closed', {
      action: 'db_close',
    });
  } catch (error) {
    logError('Error closing database connections', error instanceof Error ? error : new Error(String(error)), {
      action: 'db_close',
    });
  }
}
