// MOCKS EN PREMIER
jest.mock("../config", () => ({
  __esModule: true,
  default: {
    jwt: { secret: "test-secret", expiresIn: "6h" },
    logging: { level: "info" },
    database: { mongoUri: "mongodb://test" },
    server: { notification_url: "http://test-url" },
    services: {
      frontend: { url: "http://localhost:3000" },
      auth: { url: "http://localhost:3002" },
      database: { url: "http://localhost:3001" },
      email: { url: "http://localhost:3003" }
    }
  }
}));

jest.mock("../services/metrics.service");
jest.mock("../utils/logger");

import { Request, Response } from "express";
import metricsController from "../controllers/metrics.controller";
import metricsService from "../services/metrics.service";
import { logger } from "../utils/logger";

describe("MetricsController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = { status: mockStatus, json: mockJson };
    jest.clearAllMocks();
  });

  describe("getRealTimeMetrics", () => {
    it("should return 200 with real-time metrics", async () => {
      const mockMetrics = {
        totalRequests: 150,
        averageResponseTime: 85,
        errorRate: 2.5
      };
      (metricsService.getRealTimeMetrics as jest.Mock).mockReturnValue(
        mockMetrics
      );

      await metricsController.getRealTimeMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.getRealTimeMetrics).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          ...mockMetrics,
          timestamp: expect.any(String),
          period: "realtime"
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.getRealTimeMetrics as jest.Mock).mockImplementation(
        () => {
          throw new Error("Metrics error");
        }
      );

      await metricsController.getRealTimeMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur interne du serveur",
        error: expect.any(Error)
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getLastHourMetrics", () => {
    it("should return 200 with last hour metrics", async () => {
      const mockMetrics = {
        totalRequests: 3600,
        averageResponseTime: 120,
        errorRate: 1.8
      };
      (metricsService.getLastHourMetrics as jest.Mock).mockReturnValue(
        mockMetrics
      );

      await metricsController.getLastHourMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.getLastHourMetrics).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          ...mockMetrics,
          timestamp: expect.any(String),
          period: "lastHour"
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.getLastHourMetrics as jest.Mock).mockImplementation(
        () => {
          throw new Error("Metrics error");
        }
      );

      await metricsController.getLastHourMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getLast24HoursMetrics", () => {
    it("should return 200 with last 24 hours metrics", async () => {
      const mockMetrics = {
        totalRequests: 86400,
        averageResponseTime: 95,
        errorRate: 3.2
      };
      (metricsService.getLast24HoursMetrics as jest.Mock).mockReturnValue(
        mockMetrics
      );

      await metricsController.getLast24HoursMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.getLast24HoursMetrics).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          ...mockMetrics,
          timestamp: expect.any(String),
          period: "last24Hours"
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.getLast24HoursMetrics as jest.Mock).mockImplementation(
        () => {
          throw new Error("Metrics error");
        }
      );

      await metricsController.getLast24HoursMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getCustomPeriodMetrics", () => {
    it("should return 400 when start parameter is missing", async () => {
      mockReq.query = { end: "2023-12-31T23:59:59Z" };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Les paramètres 'start' et 'end' sont requis (format ISO 8601)"
      });
    });

    it("should return 400 when end parameter is missing", async () => {
      mockReq.query = { start: "2023-01-01T00:00:00Z" };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Les paramètres 'start' et 'end' sont requis (format ISO 8601)"
      });
    });

    it("should return 400 when start date format is invalid", async () => {
      mockReq.query = { start: "invalid-date", end: "2023-12-31T23:59:59Z" };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Format de date invalide. Utilisez le format ISO 8601"
      });
    });

    it("should return 400 when end date format is invalid", async () => {
      mockReq.query = { start: "2023-01-01T00:00:00Z", end: "invalid-date" };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Format de date invalide. Utilisez le format ISO 8601"
      });
    });

    it("should return 400 when start date is after end date", async () => {
      mockReq.query = {
        start: "2023-12-31T23:59:59Z",
        end: "2023-01-01T00:00:00Z"
      };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "La date de début doit être antérieure à la date de fin"
      });
    });

    it("should return 400 when start date equals end date", async () => {
      mockReq.query = {
        start: "2023-06-15T12:00:00Z",
        end: "2023-06-15T12:00:00Z"
      };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "La date de début doit être antérieure à la date de fin"
      });
    });

    it("should return 200 with custom period metrics when valid dates", async () => {
      const mockMetrics = {
        totalRequests: 5000,
        averageResponseTime: 110,
        errorRate: 2.1
      };
      (metricsService.getMetrics as jest.Mock).mockReturnValue(mockMetrics);

      mockReq.query = {
        start: "2023-01-01T00:00:00Z",
        end: "2023-01-31T23:59:59Z"
      };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.getMetrics).toHaveBeenCalledWith({
        start: new Date("2023-01-01T00:00:00Z"),
        end: new Date("2023-01-31T23:59:59Z")
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          ...mockMetrics,
          timestamp: expect.any(String),
          period: "custom",
          timeRange: {
            start: "2023-01-01T00:00:00.000Z",
            end: "2023-01-31T23:59:59.000Z"
          }
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.getMetrics as jest.Mock).mockImplementation(() => {
        throw new Error("Metrics error");
      });

      mockReq.query = {
        start: "2023-01-01T00:00:00Z",
        end: "2023-01-31T23:59:59Z"
      };

      await metricsController.getCustomPeriodMetrics(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getRequestDistribution", () => {
    it("should return distribution for default period (last24Hours)", async () => {
      const mockDistribution = [
        { endpoint: "/api/users", count: 1500 },
        { endpoint: "/api/auth", count: 800 }
      ];
      (metricsService.getRequestDistribution as jest.Mock).mockReturnValue(
        mockDistribution
      );

      await metricsController.getRequestDistribution(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.getRequestDistribution).toHaveBeenCalledWith({
        start: expect.any(Date),
        end: expect.any(Date)
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          distribution: mockDistribution,
          timestamp: expect.any(String),
          period: "last24Hours",
          timeRange: {
            start: expect.any(String),
            end: expect.any(String)
          }
        }
      });
    });

    it("should return distribution for realtime period", async () => {
      const mockDistribution = [{ endpoint: "/api/health", count: 10 }];
      (metricsService.getRequestDistribution as jest.Mock).mockReturnValue(
        mockDistribution
      );
      mockReq.query = { period: "realtime" };

      await metricsController.getRequestDistribution(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          distribution: mockDistribution,
          timestamp: expect.any(String),
          period: "realtime",
          timeRange: {
            start: expect.any(String),
            end: expect.any(String)
          }
        }
      });
    });

    it("should return distribution for lastHour period", async () => {
      const mockDistribution = [{ endpoint: "/api/metrics", count: 120 }];
      (metricsService.getRequestDistribution as jest.Mock).mockReturnValue(
        mockDistribution
      );
      mockReq.query = { period: "lastHour" };

      await metricsController.getRequestDistribution(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          distribution: mockDistribution,
          timestamp: expect.any(String),
          period: "lastHour",
          timeRange: {
            start: expect.any(String),
            end: expect.any(String)
          }
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.getRequestDistribution as jest.Mock).mockImplementation(
        () => {
          throw new Error("Distribution error");
        }
      );

      await metricsController.getRequestDistribution(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getStatusDistribution", () => {
    it("should return status distribution for default period", async () => {
      const mockDistribution = [
        { status: 200, count: 8500 },
        { status: 404, count: 120 },
        { status: 500, count: 15 }
      ];
      (metricsService.getStatusDistribution as jest.Mock).mockReturnValue(
        mockDistribution
      );

      await metricsController.getStatusDistribution(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.getStatusDistribution).toHaveBeenCalledWith({
        start: expect.any(Date),
        end: expect.any(Date)
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          distribution: mockDistribution,
          timestamp: expect.any(String),
          period: "last24Hours",
          timeRange: {
            start: expect.any(String),
            end: expect.any(String)
          }
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.getStatusDistribution as jest.Mock).mockImplementation(
        () => {
          throw new Error("Status distribution error");
        }
      );

      await metricsController.getStatusDistribution(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getEndpointPerformance", () => {
    it("should return endpoint performance for default period", async () => {
      const mockPerformance = [
        { endpoint: "/api/users", avgResponseTime: 85, requestCount: 1500 },
        { endpoint: "/api/auth", avgResponseTime: 45, requestCount: 800 }
      ];
      (metricsService.getEndpointPerformance as jest.Mock).mockReturnValue(
        mockPerformance
      );

      await metricsController.getEndpointPerformance(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.getEndpointPerformance).toHaveBeenCalledWith({
        start: expect.any(Date),
        end: expect.any(Date)
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          performance: mockPerformance,
          timestamp: expect.any(String),
          period: "last24Hours",
          timeRange: {
            start: expect.any(String),
            end: expect.any(String)
          }
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.getEndpointPerformance as jest.Mock).mockImplementation(
        () => {
          throw new Error("Performance error");
        }
      );

      await metricsController.getEndpointPerformance(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("recordRequestMetric", () => {
    it("should return 400 when method is missing", async () => {
      mockReq.body = { path: "/api/test", statusCode: 200, duration: 100 };

      await metricsController.recordRequestMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Les champs method, path, statusCode et duration sont requis"
      });
    });

    it("should return 400 when path is missing", async () => {
      mockReq.body = { method: "GET", statusCode: 200, duration: 100 };

      await metricsController.recordRequestMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when statusCode is missing", async () => {
      mockReq.body = { method: "GET", path: "/api/test", duration: 100 };

      await metricsController.recordRequestMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when duration is missing", async () => {
      mockReq.body = { method: "GET", path: "/api/test", statusCode: 200 };

      await metricsController.recordRequestMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should record request metric successfully with required fields", async () => {
      (metricsService.recordRequest as jest.Mock).mockImplementation(() => {});
      mockReq.body = {
        method: "GET",
        path: "/api/test",
        statusCode: 200,
        duration: 150
      };

      await metricsController.recordRequestMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.recordRequest).toHaveBeenCalledWith({
        method: "GET",
        path: "/api/test",
        statusCode: 200,
        duration: 150,
        responseSize: 0,
        userAgent: undefined,
        ip: undefined
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Métrique de requête enregistrée avec succès"
      });
    });

    it("should record request metric with all fields", async () => {
      (metricsService.recordRequest as jest.Mock).mockImplementation(() => {});
      mockReq.body = {
        method: "POST",
        path: "/api/users",
        statusCode: 201,
        duration: 200,
        responseSize: 1024,
        userAgent: "Mozilla/5.0",
        ip: "192.168.1.1"
      };

      await metricsController.recordRequestMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.recordRequest).toHaveBeenCalledWith({
        method: "POST",
        path: "/api/users",
        statusCode: 201,
        duration: 200,
        responseSize: 1024,
        userAgent: "Mozilla/5.0",
        ip: "192.168.1.1"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.recordRequest as jest.Mock).mockImplementation(() => {
        throw new Error("Record error");
      });
      mockReq.body = {
        method: "GET",
        path: "/api/test",
        statusCode: 200,
        duration: 100
      };

      await metricsController.recordRequestMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("recordMongoMetric", () => {
    it("should return 400 when operation is missing", async () => {
      mockReq.body = { collection: "users", duration: 50, success: true };

      await metricsController.recordMongoMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message:
          "Les champs operation, collection, duration et success sont requis"
      });
    });

    it("should return 400 when collection is missing", async () => {
      mockReq.body = { operation: "find", duration: 50, success: true };

      await metricsController.recordMongoMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when duration is missing", async () => {
      mockReq.body = { operation: "find", collection: "users", success: true };

      await metricsController.recordMongoMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when success is missing", async () => {
      mockReq.body = { operation: "find", collection: "users", duration: 50 };

      await metricsController.recordMongoMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should record mongo metric successfully", async () => {
      (metricsService.recordMongoOperation as jest.Mock).mockImplementation(
        () => {}
      );
      mockReq.body = {
        operation: "find",
        collection: "users",
        duration: 75,
        success: true,
        error: null
      };

      await metricsController.recordMongoMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.recordMongoOperation).toHaveBeenCalledWith({
        operation: "find",
        collection: "users",
        duration: 75,
        success: true,
        error: null
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Métrique MongoDB enregistrée avec succès"
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.recordMongoOperation as jest.Mock).mockImplementation(
        () => {
          throw new Error("Mongo record error");
        }
      );
      mockReq.body = {
        operation: "find",
        collection: "users",
        duration: 75,
        success: true
      };

      await metricsController.recordMongoMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("recordBandwidthMetric", () => {
    it("should return 400 when bytesIn is missing", async () => {
      mockReq.body = { bytesOut: 2048, requestsPerSecond: 10 };

      await metricsController.recordBandwidthMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Les champs bytesIn, bytesOut et requestsPerSecond sont requis"
      });
    });

    it("should return 400 when bytesOut is missing", async () => {
      mockReq.body = { bytesIn: 1024, requestsPerSecond: 10 };

      await metricsController.recordBandwidthMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when requestsPerSecond is missing", async () => {
      mockReq.body = { bytesIn: 1024, bytesOut: 2048 };

      await metricsController.recordBandwidthMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should record bandwidth metric successfully", async () => {
      (metricsService.recordBandwidth as jest.Mock).mockImplementation(
        () => {}
      );
      mockReq.body = {
        bytesIn: 1024,
        bytesOut: 2048,
        requestsPerSecond: 15
      };

      await metricsController.recordBandwidthMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(metricsService.recordBandwidth).toHaveBeenCalledWith({
        bytesIn: 1024,
        bytesOut: 2048,
        requestsPerSecond: 15
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Métrique de bande passante enregistrée avec succès"
      });
    });

    it("should return 500 when service throws error", async () => {
      (metricsService.recordBandwidth as jest.Mock).mockImplementation(() => {
        throw new Error("Bandwidth record error");
      });
      mockReq.body = {
        bytesIn: 1024,
        bytesOut: 2048,
        requestsPerSecond: 15
      };

      await metricsController.recordBandwidthMetric(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
