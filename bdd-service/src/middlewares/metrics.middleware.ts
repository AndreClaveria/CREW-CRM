import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface MongoMetrics {
  operation: string;
  collection: string;
  duration: number;
  success: boolean;
  error?: string;
}

class MongoMetricsCollector {
  private static instance: MongoMetricsCollector;
  private metricsServiceUrl: string;

  private constructor() {
    this.metricsServiceUrl =
      process.env.METRICS_SERVICE_URL || "http://localhost:3004";
  }

  public static getInstance(): MongoMetricsCollector {
    if (!MongoMetricsCollector.instance) {
      MongoMetricsCollector.instance = new MongoMetricsCollector();
    }
    return MongoMetricsCollector.instance;
  }

  /**
   * Enregistre une métrique MongoDB
   */
  async recordMongoOperation(metrics: MongoMetrics): Promise<void> {
    try {
      const token = process.env.METRICS_SERVICE_TOKEN || "your-jwt-token";

      const response = await fetch(
        `${this.metricsServiceUrl}/api/metrics/record/mongo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(metrics)
        }
      );

      if (!response.ok) {
        logger.warn(`Échec de l'envoi de métrique MongoDB: ${response.status}`);
      }
    } catch (error) {
      logger.error("Erreur lors de l'envoi de métrique MongoDB:", error);
    }
  }

  /**
   * Wrapper pour les opérations MongoDB avec métriques
   */
  async withMetrics<T>(
    operation: string,
    collection: string,
    operationFn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await operationFn();

      // Enregistrer la métrique de succès
      await this.recordMongoOperation({
        operation,
        collection,
        duration: Date.now() - startTime,
        success: true
      });

      return result;
    } catch (error) {
      // Enregistrer la métrique d'échec
      await this.recordMongoOperation({
        operation,
        collection,
        duration: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });

      throw error;
    }
  }
}

/**
 * Middleware pour collecter les métriques de requêtes HTTP
 */
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const originalSend = res.send;
  const originalJson = res.json;

  // Intercepter la réponse pour mesurer la taille
  let responseSize = 0;

  res.send = function (body: any) {
    responseSize = Buffer.byteLength(body, "utf8");
    return originalSend.call(this, body);
  };

  res.json = function (body: any) {
    responseSize = Buffer.byteLength(JSON.stringify(body), "utf8");
    return originalJson.call(this, body);
  };

  // Capturer la fin de la requête
  res.on("finish", async () => {
    const duration = Date.now() - startTime;
    const userAgent = req.get("User-Agent");
    const ip =
      req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    try {
      const metricsServiceUrl =
        process.env.METRICS_SERVICE_URL || "http://localhost:3004";
      const token = process.env.METRICS_SERVICE_TOKEN || "your-jwt-token";

      await fetch(`${metricsServiceUrl}/api/metrics/record/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          responseSize,
          userAgent,
          ip
        })
      });
    } catch (error) {
      logger.error(
        "Erreur lors de l'enregistrement de la métrique de requête:",
        error
      );
    }
  });

  next();
};

/**
 * Middleware pour collecter les métriques de bande passante
 */
export const bandwidthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  let bytesIn = 0;
  let bytesOut = 0;

  // Mesurer les données entrantes
  if (req.headers["content-length"]) {
    bytesIn = parseInt(req.headers["content-length"] as string, 10);
  }

  // Intercepter la réponse pour mesurer les données sortantes
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function (body: any) {
    bytesOut = Buffer.byteLength(body, "utf8");
    return originalSend.call(this, body);
  };

  res.json = function (body: any) {
    bytesOut = Buffer.byteLength(JSON.stringify(body), "utf8");
    return originalJson.call(this, body);
  };

  // Capturer la fin de la requête
  res.on("finish", async () => {
    const duration = Date.now() - startTime;
    const requestsPerSecond = 1 / (duration / 1000); // Approximation

    try {
      const metricsServiceUrl =
        process.env.METRICS_SERVICE_URL || "http://localhost:3004";
      const token = process.env.METRICS_SERVICE_TOKEN || "your-jwt-token";

      await fetch(`${metricsServiceUrl}/api/metrics/record/bandwidth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bytesIn,
          bytesOut,
          requestsPerSecond
        })
      });
    } catch (error) {
      logger.error(
        "Erreur lors de l'enregistrement de la métrique de bande passante:",
        error
      );
    }
  });

  next();
};

/**
 * Décorateur pour les opérations MongoDB avec métriques
 */
export function withMongoMetrics(operation: string, collection: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const collector = MongoMetricsCollector.getInstance();
      return await collector.withMetrics(operation, collection, () =>
        method.apply(this, args)
      );
    };
  };
}

export { MongoMetricsCollector };
