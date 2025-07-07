// src/server.ts
import { app } from "./app";
import { logger } from "./utils/logger";
import connectDB from "./config/db.config";
import config from "./config";

const PORT = config.server.port;

connectDB();

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const gracefulShutdown = async () => {
  logger.info("Received shutdown signal, closing server...");


  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });

 
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

// Écouter les signaux d'arrêt
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default server;
