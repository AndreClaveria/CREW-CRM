import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./index";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Service de Paiement",
    version: "1.0.0",
    description: "Documentation de l'API du service de paiement"
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}`,
      description: "Serveur de développement"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  // Route pour la documentation Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
