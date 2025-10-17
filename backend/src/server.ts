import cors from "cors";
import express from "express";

import { environment } from "@config/environment";
import { logInfo } from "@utils/logger";
import { testDatabaseConnection, closeDatabase } from "@config/database";
import { productsRouter } from "@routes/products-routes";

async function startServer(
  port: number,
  maxRetries: number = 10,
): Promise<void> {
  if (maxRetries <= 0) {
    throw new Error(`Failed to find available port after multiple attempts`);
  }

  // Test database connection before starting server
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    throw new Error("Database connection failed - cannot start server");
  }

  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Allow any localhost origin for development
        try {
          const url = new URL(origin);
          if (
            url.hostname === "localhost" ||
            url.hostname === "127.0.0.1" ||
            url.hostname === "0.0.0.0"
          ) {
            return callback(null, true);
          }
        } catch {
          // Invalid URL, fall through to deny
        }

        // Check against configured origins
        if (environment.corsOrigins.includes(origin)) {
          return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );

  app.use(express.json());

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/products", productsRouter);

  await new Promise<void>((resolve, reject) => {
    const server = app
      .listen(port, () => {
        logInfo("API server listening", {
          port,
          env: environment.nodeEnv,
        });
        resolve();
      })
      .on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          logInfo("Port in use, retrying", { port });
          server.close(() => {
            setTimeout(() => {
              startServer(port + 1, maxRetries - 1)
                .then(resolve)
                .catch(reject);
            }, 1000);
          });
        } else {
          reject(error);
        }
      });
  });
}

startServer(environment.port).catch((error) => {
  throw error;
});

// Graceful shutdown handling
process.on("SIGTERM", async () => {
  logInfo("Received SIGTERM, shutting down gracefully", { action: "shutdown" });
  await closeDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logInfo("Received SIGINT, shutting down gracefully", { action: "shutdown" });
  await closeDatabase();
  process.exit(0);
});
