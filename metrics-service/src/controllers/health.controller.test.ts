// MOCKS EN PREMIER
jest.mock("../config", () => ({
  __esModule: true,
  default: {
    jwt: { secret: "test-secret", expiresIn: "6h" },
    logging: { level: "info" },
    database: { mongoUri: "mongodb://test" },
    server: { notification_url: "http://test-url" },
    services: {
      frontend: {
        url: "http://localhost:3000"
      },
      auth: {
        url: "http://localhost:3002"
      },
      database: {
        url: "http://localhost:3001"
      },
      email: {
        url: "http://localhost:3003"
      }
    },
    notifications: {
      monitoring: {
        intervalMinutes: 5
      }
    }
  }
}));

jest.mock("../services/health.service");
jest.mock("../utils/logger");

import { Request, Response } from "express";
import healthController from "../controllers/health.controller";
import healthService from "../services/health.service";
import { logger } from "../utils/logger";

describe("HealthController", () => {
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

  describe("checkServiceHealth", () => {
    it("should return 404 when service not found", async () => {
      const mockServices = [
        { name: "authentication", url: "http://auth:3001" },
        { name: "user", url: "http://user:3002" }
      ];
      (healthService as any).services = mockServices;
      mockReq.params = { serviceName: "nonexistent" };

      const result = await healthController.checkServiceHealth(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Service nonexistent non trouvé"
      });
    });

    it("should return 200 with service status when service found", async () => {
      const mockServices = [
        { name: "authentication", url: "http://auth:3001" },
        { name: "user", url: "http://user:3002" }
      ];
      const mockServiceStatus = {
        name: "authentication",
        status: "healthy",
        responseTime: 150,
        timestamp: "2023-01-01T00:00:00.000Z"
      };

      (healthService as any).services = mockServices;
      (healthService.checkServiceHealth as jest.Mock).mockResolvedValue(
        mockServiceStatus
      );
      mockReq.params = { serviceName: "authentication" };

      await healthController.checkServiceHealth(
        mockReq as Request,
        mockRes as Response
      );

      expect(healthService.checkServiceHealth).toHaveBeenCalledWith(
        mockServices[0]
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockServiceStatus
      });
    });

    it("should return 500 when service throws error", async () => {
      const mockServices = [
        { name: "authentication", url: "http://auth:3001" }
      ];
      (healthService as any).services = mockServices;
      (healthService.checkServiceHealth as jest.Mock).mockRejectedValue(
        new Error("Service unreachable")
      );
      mockReq.params = { serviceName: "authentication" };

      await healthController.checkServiceHealth(
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

  describe("checkAllServices", () => {
    it("should return 200 with all services status", async () => {
      const mockAllStatuses = [
        { name: "authentication", status: "healthy", responseTime: 150 },
        { name: "user", status: "unhealthy", responseTime: null }
      ];
      (healthService.checkAllServices as jest.Mock).mockResolvedValue(
        mockAllStatuses
      );

      await healthController.checkAllServices(
        mockReq as Request,
        mockRes as Response
      );

      expect(healthService.checkAllServices).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          services: mockAllStatuses,
          timestamp: expect.any(String)
        }
      });
    });

    it("should return 500 when service throws error", async () => {
      (healthService.checkAllServices as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      await healthController.checkAllServices(
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

  describe("sendTestNotification", () => {
    it("should send info notification by default", async () => {
      (healthService.sendDiscordNotification as jest.Mock).mockResolvedValue(
        true
      );
      mockReq.query = {};

      await healthController.sendTestNotification(
        mockReq as Request,
        mockRes as Response
      );

      expect(healthService.sendDiscordNotification).toHaveBeenCalledWith(
        "🧪 Ceci est un test d'information provenant du service de notification CRM",
        false
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Notification Discord de type information envoyée avec succès"
      });
    });

    it("should send alert notification when type is alert", async () => {
      (healthService.sendDiscordNotification as jest.Mock).mockResolvedValue(
        true
      );
      mockReq.query = { type: "alert" };

      await healthController.sendTestNotification(
        mockReq as Request,
        mockRes as Response
      );

      expect(healthService.sendDiscordNotification).toHaveBeenCalledWith(
        "🧪 Ceci est un test d'alerte provenant du service de notification CRM",
        true
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Notification Discord de type alerte envoyée avec succès"
      });
    });

    it("should return 500 when notification fails", async () => {
      (healthService.sendDiscordNotification as jest.Mock).mockResolvedValue(
        false
      );
      mockReq.query = { type: "info" };

      await healthController.sendTestNotification(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Échec de l'envoi de la notification Discord"
      });
    });

    it("should return 500 when service throws error", async () => {
      (healthService.sendDiscordNotification as jest.Mock).mockRejectedValue(
        new Error("Discord API error")
      );
      mockReq.query = { type: "info" };

      await healthController.sendTestNotification(
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

  describe("toggleMonitoring", () => {
    it("should start monitoring with default interval", async () => {
      (healthService.startMonitoring as jest.Mock).mockImplementation(() => {});
      mockReq.body = { action: "start" };

      await healthController.toggleMonitoring(
        mockReq as Request,
        mockRes as Response
      );

      expect(healthService.startMonitoring).toHaveBeenCalledWith(5); // Default from config
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Surveillance des services démarrée (intervalle: 5 minutes)"
      });
    });

    it("should start monitoring with custom interval", async () => {
      (healthService.startMonitoring as jest.Mock).mockImplementation(() => {});
      mockReq.body = { action: "start", intervalMinutes: 10 };

      await healthController.toggleMonitoring(
        mockReq as Request,
        mockRes as Response
      );

      expect(healthService.startMonitoring).toHaveBeenCalledWith(10);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Surveillance des services démarrée (intervalle: 10 minutes)"
      });
    });

    it("should stop monitoring", async () => {
      (healthService.stopMonitoring as jest.Mock).mockImplementation(() => {});
      mockReq.body = { action: "stop" };

      await healthController.toggleMonitoring(
        mockReq as Request,
        mockRes as Response
      );

      expect(healthService.stopMonitoring).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Surveillance des services arrêtée"
      });
    });

    it("should return 400 for invalid action", async () => {
      mockReq.body = { action: "invalid" };

      await healthController.toggleMonitoring(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Action invalide. Utilisez "start" ou "stop"'
      });
      expect(healthService.startMonitoring).not.toHaveBeenCalled();
      expect(healthService.stopMonitoring).not.toHaveBeenCalled();
    });

    it("should return 500 when service throws error", async () => {
      (healthService.startMonitoring as jest.Mock).mockImplementation(() => {
        throw new Error("Monitoring error");
      });
      mockReq.body = { action: "start" };

      await healthController.toggleMonitoring(
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
});
