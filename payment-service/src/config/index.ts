import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
    frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
    protocol: process.env.PROTOCOL || "http"
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:3000"
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
    service_name: "payment-service"
  }
};

export default config;
