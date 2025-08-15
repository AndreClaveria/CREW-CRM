// MOCKS EN PREMIER
jest.mock("../services/chatbot.services", () => ({
  __esModule: true,
  default: {
    analyzeUserQuery: jest.fn(),
    getContextualHelp: jest.fn(),
    searchFeatures: jest.fn()
  }
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid-1234")
}));

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

// Mock process.env
const originalEnv = process.env;

import { Request, Response } from "express";
import ChatbotController from "../controllers/chatbot.controller";
import chatbotService from "../services/chatbot.services";

describe("ChatbotController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = { body: {}, params: {}, query: {}, headers: {} };
    mockRes = { status: mockStatus, json: mockJson };

    jest.clearAllMocks();

    // Reset process.env
    process.env = { ...originalEnv };
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("chat", () => {
    it("should return 400 when message is missing", async () => {
      mockReq.body = {};

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Message requis",
        code: "INVALID_MESSAGE"
      });
      expect(chatbotService.analyzeUserQuery).not.toHaveBeenCalled();
    });

    it("should return 400 when message is empty string", async () => {
      mockReq.body = { message: "" };

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Message requis",
        code: "INVALID_MESSAGE"
      });
    });

    it("should return 400 when message is only whitespace", async () => {
      mockReq.body = { message: "   " };

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Message requis",
        code: "INVALID_MESSAGE"
      });
    });

    it("should return 400 when message is not a string", async () => {
      mockReq.body = { message: 123 };

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Message requis",
        code: "INVALID_MESSAGE"
      });
    });

    it("should process chat message successfully with new session", async () => {
      const mockResponse = {
        message: "Je peux vous aider avec les clients",
        suggestedActions: [
          { route: "/dashboard/clients", label: "Aller aux clients" }
        ]
      };

      (chatbotService.analyzeUserQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );
      mockReq.body = {
        message: "Comment gérer mes clients ?",
        context: { currentRoute: "/dashboard" }
      };

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(chatbotService.analyzeUserQuery).toHaveBeenCalledWith(
        "Comment gérer mes clients ?",
        { currentRoute: "/dashboard" }
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        sessionId: "mock-uuid-1234",
        response: mockResponse,
        conversation: {
          lastMessage: expect.objectContaining({
            id: "mock-uuid-1234",
            content: "Je peux vous aider avec les clients",
            role: "assistant",
            timestamp: expect.any(Date),
            metadata: {
              navigationType: "route",
              suggestedRoute: "/dashboard/clients",
              relatedPages: ["/dashboard/clients"]
            }
          }),
          messageCount: 2,
          context: { currentRoute: "/dashboard" }
        },
        metadata: {
          timestamp: expect.any(Date),
          processingTime: expect.any(Number)
        }
      });
    });

    it("should process chat message with existing session", async () => {
      const mockResponse = {
        message: "Voici les informations sur les opportunités",
        suggestedActions: []
      };

      (chatbotService.analyzeUserQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      // Première requête pour créer la session
      mockReq.body = {
        message: "Parle-moi des opportunités",
        sessionId: "existing-session-123"
      };
      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      // Reset des mocks pour la deuxième requête
      jest.clearAllMocks();
      (chatbotService.analyzeUserQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      // Deuxième requête avec la même session
      mockReq.body = {
        message: "Comment créer une opportunité ?",
        sessionId: "existing-session-123"
      };

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        sessionId: "existing-session-123",
        response: mockResponse,
        conversation: expect.objectContaining({
          messageCount: 4, // 2 user + 2 assistant messages
          lastMessage: expect.objectContaining({
            role: "assistant",
            content: "Voici les informations sur les opportunités",
            metadata: {
              navigationType: "feature",
              suggestedRoute: undefined,
              relatedPages: []
            }
          })
        }),
        metadata: expect.objectContaining({
          timestamp: expect.any(Date),
          processingTime: expect.any(Number)
        })
      });
    });

    it("should handle service error gracefully", async () => {
      const testError = new Error("OpenAI service unavailable");
      (chatbotService.analyzeUserQuery as jest.Mock).mockRejectedValue(
        testError
      );
      mockReq.body = { message: "Test message" };

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors du traitement de votre demande",
        code: "CHAT_ERROR",
        details: undefined // En mode test, on ne retourne pas les détails
      });
    });

    it("should return error details in development mode", async () => {
      process.env.NODE_ENV = "development";
      const testError = new Error("Service error");
      (chatbotService.analyzeUserQuery as jest.Mock).mockRejectedValue(
        testError
      );
      mockReq.body = { message: "Test message" };

      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors du traitement de votre demande",
        code: "CHAT_ERROR",
        details: testError
      });
    });
  });

  describe("getContextualHelp", () => {
    it("should return 400 when currentRoute is missing", async () => {
      mockReq.body = {};

      await ChatbotController.getContextualHelp(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Route actuelle requise",
        code: "INVALID_ROUTE"
      });
      expect(chatbotService.getContextualHelp).not.toHaveBeenCalled();
    });

    it("should return 400 when currentRoute is not a string", async () => {
      mockReq.body = { currentRoute: 123 };

      await ChatbotController.getContextualHelp(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Route actuelle requise",
        code: "INVALID_ROUTE"
      });
    });

    it("should return contextual help successfully", async () => {
      const mockHelp = {
        title: "Aide - Tableau de bord",
        description: "Votre vue d'ensemble",
        tips: ["Consultez vos KPI", "Vérifiez les alertes"],
        shortcuts: [{ key: "Ctrl+D", action: "Aller au dashboard" }]
      };

      (chatbotService.getContextualHelp as jest.Mock).mockResolvedValue(
        mockHelp
      );
      mockReq.body = {
        currentRoute: "/dashboard",
        userRole: "admin",
        sessionId: "session-123"
      };

      await ChatbotController.getContextualHelp(
        mockReq as Request,
        mockRes as Response
      );

      expect(chatbotService.getContextualHelp).toHaveBeenCalledWith(
        "/dashboard"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        route: "/dashboard",
        help: mockHelp,
        timestamp: expect.any(Date)
      });
    });

    it("should handle service error in contextual help", async () => {
      const testError = new Error("Service error");
      (chatbotService.getContextualHelp as jest.Mock).mockRejectedValue(
        testError
      );
      mockReq.body = { currentRoute: "/dashboard" };

      await ChatbotController.getContextualHelp(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors de la récupération de l'aide contextuelle",
        code: "CONTEXTUAL_HELP_ERROR"
      });
    });
  });

  describe("searchFeatures", () => {
    it("should return 400 when searchTerm is missing", async () => {
      mockReq.body = {};

      await ChatbotController.searchFeatures(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Terme de recherche requis",
        code: "INVALID_SEARCH_TERM"
      });
      expect(chatbotService.searchFeatures).not.toHaveBeenCalled();
    });

    it("should return 400 when searchTerm is empty", async () => {
      mockReq.body = { searchTerm: "" };

      await ChatbotController.searchFeatures(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Terme de recherche requis",
        code: "INVALID_SEARCH_TERM"
      });
    });

    it("should return 400 when searchTerm is only whitespace", async () => {
      mockReq.body = { searchTerm: "   " };

      await ChatbotController.searchFeatures(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Terme de recherche requis",
        code: "INVALID_SEARCH_TERM"
      });
    });

    it("should search features successfully", async () => {
      const mockResults = [
        {
          title: "Gestion des clients",
          route: "/dashboard/clients",
          description: "Créer et gérer vos clients",
          relevance: 0.95
        },
        {
          title: "Liste des clients",
          route: "/dashboard/clients/list",
          description: "Voir tous vos clients",
          relevance: 0.87
        }
      ];

      (chatbotService.searchFeatures as jest.Mock).mockResolvedValue(
        mockResults
      );
      mockReq.body = {
        searchTerm: "client",
        sessionId: "session-456"
      };

      await ChatbotController.searchFeatures(
        mockReq as Request,
        mockRes as Response
      );

      expect(chatbotService.searchFeatures).toHaveBeenCalledWith("client");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        searchTerm: "client",
        results: mockResults,
        timestamp: expect.any(Date)
      });
    });

    it("should handle service error in search", async () => {
      const testError = new Error("Search service error");
      (chatbotService.searchFeatures as jest.Mock).mockRejectedValue(testError);
      mockReq.body = { searchTerm: "test" };

      await ChatbotController.searchFeatures(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Erreur lors de la recherche",
        code: "SEARCH_ERROR"
      });
    });
  });

  describe("getConversationHistory", () => {
    it("should return 400 when sessionId is missing", async () => {
      mockReq.params = {};

      await ChatbotController.getConversationHistory(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "ID de session requis",
        code: "INVALID_SESSION_ID"
      });
    });

    it("should return 404 when session not found", async () => {
      mockReq.params = { sessionId: "non-existent-session" };

      await ChatbotController.getConversationHistory(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Session non trouvée",
        code: "SESSION_NOT_FOUND"
      });
    });

    it("should return conversation history successfully", async () => {
      // D'abord créer une session avec un chat
      const mockResponse = { message: "Test response", suggestedActions: [] };
      (chatbotService.analyzeUserQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      mockReq.body = { message: "Test message", sessionId: "test-session" };
      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      // Maintenant récupérer l'historique
      jest.clearAllMocks();
      mockReq.params = { sessionId: "test-session" };

      await ChatbotController.getConversationHistory(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        sessionId: "test-session",
        messages: expect.any(Array),
        context: expect.any(Object),
        lastActivity: expect.any(Date),
        messageCount: expect.any(Number)
      });
    });
  });

  describe("resetSession", () => {
    it("should return 400 when sessionId is missing", async () => {
      mockReq.params = {};

      await ChatbotController.resetSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "ID de session requis",
        code: "INVALID_SESSION_ID"
      });
    });

    it("should return 404 when session not found", async () => {
      mockReq.params = { sessionId: "non-existent" };

      await ChatbotController.resetSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Session non trouvée",
        code: "SESSION_NOT_FOUND"
      });
    });

    it("should reset session successfully", async () => {
      // Créer une session d'abord
      const mockResponse = { message: "Test", suggestedActions: [] };
      (chatbotService.analyzeUserQuery as jest.Mock).mockResolvedValue(
        mockResponse
      );

      mockReq.body = { message: "Test", sessionId: "reset-session" };
      await ChatbotController.chat(mockReq as Request, mockRes as Response);

      // Maintenant reset
      jest.clearAllMocks();
      mockReq.params = { sessionId: "reset-session" };

      await ChatbotController.resetSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Session réinitialisée avec succès",
        sessionId: "reset-session",
        timestamp: expect.any(Date)
      });
    });
  });

  describe("getStats", () => {
    it("should return chatbot statistics", async () => {
      await ChatbotController.getStats(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        totalSessions: expect.any(Number),
        activeSessions: expect.any(Number),
        totalMessages: expect.any(Number),
        averageMessagesPerSession: expect.any(Number),
        timestamp: expect.any(Date)
      });
    });
  });

  describe("getCRMStructure", () => {
    it("should return CRM structure", async () => {
      await ChatbotController.getCRMStructure(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        structure: {
          modules: expect.objectContaining({
            dashboard: expect.any(Object),
            clients: expect.any(Object),
            opportunities: expect.any(Object),
            contacts: expect.any(Object),
            pipeline: expect.any(Object),
            mail: expect.any(Object)
          }),
          navigation: expect.any(Object)
        },
        timestamp: expect.any(Date),
        version: "1.0.0"
      });
    });
  });

  describe("healthCheck", () => {
    it("should return healthy status", async () => {
      await ChatbotController.healthCheck(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        status: "healthy",
        service: "chatbot",
        timestamp: expect.any(Date),
        uptime: expect.any(Number),
        memory: expect.any(Object),
        activeSessions: expect.any(Number),
        totalSessions: expect.any(Number),
        openaiConnection: "ok",
        version: "1.0.0"
      });
    });

    it("should return 503 when health check fails", async () => {
      // Simuler une erreur en mockant une méthode qui sera appelée dans healthCheck
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock pour simuler une erreur dans le processus - utilisation d'une approche plus sûre
      const originalMemoryUsage = process.memoryUsage;
      Object.defineProperty(process, "memoryUsage", {
        value: jest.fn(() => {
          throw new Error("Process error");
        }),
        configurable: true
      });

      await ChatbotController.healthCheck(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(503);
      expect(mockJson).toHaveBeenCalledWith({
        status: "unhealthy",
        service: "chatbot",
        error: "Service indisponible",
        timestamp: expect.any(Date)
      });

      // Nettoyer les mocks
      consoleSpy.mockRestore();
      Object.defineProperty(process, "memoryUsage", {
        value: originalMemoryUsage,
        configurable: true
      });
    });
  });
});
