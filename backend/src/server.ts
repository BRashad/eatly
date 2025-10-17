import cors from "cors";
import express from "express";

import { environment } from "@config/environment";
import { logInfo } from "@utils/logger";
import { productsRouter } from "@routes/products-routes";

async function startServer(port: number): Promise<void> {
  const app = express();

  app.use(cors({
    origin: ['http://localhost:8081', 'http://localhost:8080', 'http://localhost:3000'],
    credentials: true
  }));
  
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
              startServer(port + 1)
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
