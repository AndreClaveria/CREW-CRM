const config = {
  server: {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || "development",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
    auth_service_url: process.env.AUTH_URL || "http://localhost:3002/api",
    notification_url: process.env.NOTIFICATION_URL,
    protocol: process.env.PROTOCOL || "http"
  },
  database: {
    mongoUri: process.env.MONGO_URI || ""
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "6h"
  },
  logging: {
    level: process.env.LOG_LEVEL || "info"
  },
  discord: {
    service_name: process.env.SERVICE_NAME || "bdd"
  }
};

export default config;
