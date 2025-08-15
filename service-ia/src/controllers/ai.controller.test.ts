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
    },
    openai: {
      apiKey: "zjeaeaeaze"
    }
  }
}));

jest.mock("../services/ai.services");
jest.mock("../utils/logger");

// Mock process.env
const originalEnv = process.env;

import { Request, Response } from "express";
import { AIController } from "../controllers/ai.controller";
import { aiService } from "../services/ai.services";
import { logger } from "../utils/logger";

describe("AIController", () => {
  let aiController: AIController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    aiController = new AIController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = { body: {}, params: {}, query: {}, headers: {} };
    mockRes = { status: mockStatus, json: mockJson };

    jest.clearAllMocks();

    // Reset process.env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("analyzeClient", () => {
    it("should return 400 when clientId is missing", async () => {
      mockReq.params = {};

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Client ID requis"
      });
      expect(aiService.analyzeClient).not.toHaveBeenCalled();
    });

    it("should return 400 when clientId is empty string", async () => {
      mockReq.params = { clientId: "" };

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Client ID requis"
      });
      expect(aiService.analyzeClient).not.toHaveBeenCalled();
    });

    it("should analyze client successfully", async () => {
      const mockAnalysis = {
        score: 85,
        insights: ["Client très actif", "Potentiel de croissance élevé"],
        recommendations: [
          "Proposer une offre premium",
          "Planifier un suivi mensuel"
        ],
        riskLevel: "low",
        confidence: 0.92
      };

      (aiService.analyzeClient as jest.Mock).mockResolvedValue(mockAnalysis);
      mockReq.params = { clientId: "client123" };

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(aiService.analyzeClient).toHaveBeenCalledWith("client123");
      expect(logger.info).toHaveBeenCalledWith(
        "🎯 Demande analyse IA pour client: client123"
      );
      expect(logger.info).toHaveBeenCalledWith(
        "✅ Analyse terminée pour client123 - Score: 85"
      );
      expect(mockStatus).not.toHaveBeenCalled(); // Pas d'appel explicite à status() pour 200
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        clientId: "client123",
        analysis: mockAnalysis,
        timestamp: expect.any(Date)
      });
    });

    it("should handle analysis with different score", async () => {
      const mockAnalysis = {
        score: 42,
        insights: ["Client peu actif"],
        recommendations: ["Relancer le contact"],
        riskLevel: "medium",
        confidence: 0.78
      };

      (aiService.analyzeClient as jest.Mock).mockResolvedValue(mockAnalysis);
      mockReq.params = { clientId: "client456" };

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(aiService.analyzeClient).toHaveBeenCalledWith("client456");
      expect(logger.info).toHaveBeenCalledWith(
        "🎯 Demande analyse IA pour client: client456"
      );
      expect(logger.info).toHaveBeenCalledWith(
        "✅ Analyse terminée pour client456 - Score: 42"
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        clientId: "client456",
        analysis: mockAnalysis,
        timestamp: expect.any(Date)
      });
    });

    it("should return 500 when AI service throws Error", async () => {
      const testError = new Error("OpenAI API rate limit exceeded");
      (aiService.analyzeClient as jest.Mock).mockRejectedValue(testError);
      mockReq.params = { clientId: "client789" };

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(aiService.analyzeClient).toHaveBeenCalledWith("client789");
      expect(logger.info).toHaveBeenCalledWith(
        "🎯 Demande analyse IA pour client: client789"
      );
      expect(logger.error).toHaveBeenCalledWith(
        "❌ Erreur analyse client client789:",
        testError
      );
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors de l'analyse",
        message: "OpenAI API rate limit exceeded"
      });
    });

    it("should return 500 when AI service throws non-Error", async () => {
      (aiService.analyzeClient as jest.Mock).mockRejectedValue(
        "Connection timeout"
      );
      mockReq.params = { clientId: "client999" };

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith(
        "❌ Erreur analyse client client999:",
        "Connection timeout"
      );
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors de l'analyse",
        message: "Erreur inconnue"
      });
    });

    it("should return 500 when AI service throws object error", async () => {
      const objectError = { code: 500, details: "Internal server error" };
      (aiService.analyzeClient as jest.Mock).mockRejectedValue(objectError);
      mockReq.params = { clientId: "client111" };

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith(
        "❌ Erreur analyse client client111:",
        objectError
      );
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors de l'analyse",
        message: "Erreur inconnue"
      });
    });

    it("should handle analysis with complex data structure", async () => {
      const complexAnalysis = {
        score: 73,
        insights: [
          "Comportement d'achat régulier",
          "Préférence pour les produits premium",
          "Sensibilité aux promotions"
        ],
        recommendations: [
          "Segmenter en client premium",
          "Proposer des offres exclusives",
          "Programmer des rappels automatiques"
        ],
        riskLevel: "low",
        confidence: 0.88,
        metadata: {
          analysisVersion: "2.1",
          processingTime: 1247,
          dataPoints: 156
        },
        trends: {
          engagement: "increasing",
          spending: "stable",
          satisfaction: "high"
        }
      };

      (aiService.analyzeClient as jest.Mock).mockResolvedValue(complexAnalysis);
      mockReq.params = { clientId: "premium-client-001" };

      await aiController.analyzeClient(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        clientId: "premium-client-001",
        analysis: complexAnalysis,
        timestamp: expect.any(Date)
      });
    });
  });

  describe("healthCheck", () => {
    it("should return health status when all connections are OK", async () => {
      (aiService.testConnection as jest.Mock).mockResolvedValue(true);
      process.env.OPENAI_API_KEY = "sk-test-key-123";

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(aiService.testConnection).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith("🔍 Health check service IA");
      expect(mockStatus).not.toHaveBeenCalled(); // Pas d'appel explicite à status() pour 200
      expect(mockJson).toHaveBeenCalledWith({
        status: "OK",
        service: "AI Service",
        timestamp: expect.any(Date),
        connections: {
          bddService: true,
          openaiConfigured: true
        }
      });
    });

    it("should return health status when BDD connection fails", async () => {
      (aiService.testConnection as jest.Mock).mockResolvedValue(false);
      process.env.OPENAI_API_KEY = "sk-test-key-123";

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        status: "OK",
        service: "AI Service",
        timestamp: expect.any(Date),
        connections: {
          bddService: false,
          openaiConfigured: true
        }
      });
    });

    it("should return health status when OpenAI not configured", async () => {
      (aiService.testConnection as jest.Mock).mockResolvedValue(true);
      delete process.env.OPENAI_API_KEY;

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        status: "OK",
        service: "AI Service",
        timestamp: expect.any(Date),
        connections: {
          bddService: true,
          openaiConfigured: false
        }
      });
    });

    it("should return health status when OpenAI key is empty", async () => {
      (aiService.testConnection as jest.Mock).mockResolvedValue(true);
      process.env.OPENAI_API_KEY = "";

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        status: "OK",
        service: "AI Service",
        timestamp: expect.any(Date),
        connections: {
          bddService: true,
          openaiConfigured: false
        }
      });
    });

    it("should return health status when both connections have issues", async () => {
      (aiService.testConnection as jest.Mock).mockResolvedValue(false);
      delete process.env.OPENAI_API_KEY;

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        status: "OK",
        service: "AI Service",
        timestamp: expect.any(Date),
        connections: {
          bddService: false,
          openaiConfigured: false
        }
      });
    });

    it("should return 500 when health check throws Error", async () => {
      const testError = new Error("Database connection failed");
      (aiService.testConnection as jest.Mock).mockRejectedValue(testError);
      process.env.OPENAI_API_KEY = "sk-test-key-123";

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(logger.info).toHaveBeenCalledWith("🔍 Health check service IA");
      expect(logger.error).toHaveBeenCalledWith(
        "❌ Erreur health check IA:",
        testError
      );
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        status: "ERROR",
        message: "Database connection failed"
      });
    });

    it("should return 500 when health check throws non-Error", async () => {
      (aiService.testConnection as jest.Mock).mockRejectedValue(
        "Network timeout"
      );

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith(
        "❌ Erreur health check IA:",
        "Network timeout"
      );
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        status: "ERROR",
        message: "Erreur inconnue"
      });
    });

    it("should return 500 when health check throws object error", async () => {
      const objectError = {
        code: "CONNECTION_ERROR",
        details: "Cannot reach service"
      };
      (aiService.testConnection as jest.Mock).mockRejectedValue(objectError);

      await aiController.healthCheck(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        status: "ERROR",
        message: "Erreur inconnue"
      });
    });
  });
});
