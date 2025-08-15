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
      database: { url: "http://localhost:3001" }
    },
    email: {
      brevo: {
        apiKey: "vazeazeazeaz"
      },
      defaults: {
        from: {
          name: "test",
          address: "test@test.com"
        }
      },
      smtp: {
        host: "brevo",
        port: "587",
        auth: {
          user: "utilisateur",
          pass: "user1234"
        }
      }
    }
  }
}));

jest.mock("../services/email.service");
jest.mock("../utils/logger");
jest.mock("../models/email.model");

import { Request, Response } from "express";
import crmEmailController from "../controllers/email.controller";
import EmailService from "../services/email.service";
import { logger } from "../utils/logger";

// Mock du modèle Email
const mockEmailModel = {
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

jest.doMock("../models/email.model", () => ({
  __esModule: true,
  default: mockEmailModel
}));

describe("CRMEmailController", () => {
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
  });

  describe("sendCRMEmail", () => {
    it("should return 400 when fromUserId is missing", async () => {
      mockReq.body = {
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test",
        body: "Test body"
      };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message:
          "Champs requis manquants: fromUserId, fromCompanyId, toContactId, subject, body"
      });
    });

    it("should return 400 when fromCompanyId is missing", async () => {
      mockReq.body = {
        fromUserId: "user1",
        toContactId: "contact1",
        subject: "Test",
        body: "Test body"
      };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when toContactId is missing", async () => {
      mockReq.body = {
        fromUserId: "user1",
        fromCompanyId: "comp1",
        subject: "Test",
        body: "Test body"
      };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when subject is missing", async () => {
      mockReq.body = {
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        body: "Test body"
      };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when body is missing", async () => {
      mockReq.body = {
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test"
      };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should send email successfully with required fields", async () => {
      const mockResult = {
        emailHistory: { _id: "email1", sentAt: new Date() },
        messageId: "msg123",
        trackingId: "track123",
        sentTo: "test@example.com",
        sentFrom: "sender@example.com"
      };
      (EmailService.sendCRMEmail as jest.Mock).mockResolvedValue(mockResult);

      mockReq.body = {
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test Subject",
        body: "Test body"
      };
      mockReq.headers = { authorization: "Bearer token123" };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.sendCRMEmail).toHaveBeenCalledWith({
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test Subject",
        body: "Test body",
        htmlBody: undefined,
        template: undefined,
        templateType: undefined,
        authToken: "token123"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Email CRM envoyé avec succès",
        data: {
          emailId: "email1",
          messageId: "msg123",
          trackingId: "track123",
          sentTo: "test@example.com",
          sentFrom: "sender@example.com",
          sentAt: mockResult.emailHistory.sentAt
        }
      });
    });

    it("should send email with all optional fields", async () => {
      const mockResult = {
        emailHistory: { _id: "email1", sentAt: new Date() },
        messageId: "msg123",
        trackingId: "track123",
        sentTo: "test@example.com",
        sentFrom: "sender@example.com"
      };
      (EmailService.sendCRMEmail as jest.Mock).mockResolvedValue(mockResult);

      mockReq.body = {
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test Subject",
        body: "Test body",
        htmlBody: "<p>HTML body</p>",
        template: "welcome",
        templateType: "transactional"
      };
      mockReq.headers = { authorization: "Bearer token123" };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.sendCRMEmail).toHaveBeenCalledWith({
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test Subject",
        body: "Test body",
        htmlBody: "<p>HTML body</p>",
        template: "welcome",
        templateType: "transactional",
        authToken: "token123"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should handle missing authorization header", async () => {
      const mockResult = {
        emailHistory: { _id: "email1", sentAt: new Date() },
        messageId: "msg123",
        trackingId: "track123",
        sentTo: "test@example.com",
        sentFrom: "sender@example.com"
      };
      (EmailService.sendCRMEmail as jest.Mock).mockResolvedValue(mockResult);

      mockReq.body = {
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test Subject",
        body: "Test body"
      };
      mockReq.headers = {};

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.sendCRMEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          authToken: undefined
        })
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 when service throws error", async () => {
      (EmailService.sendCRMEmail as jest.Mock).mockRejectedValue(
        new Error("Email service error")
      );

      mockReq.body = {
        fromUserId: "user1",
        fromCompanyId: "comp1",
        toContactId: "contact1",
        subject: "Test Subject",
        body: "Test body"
      };

      await crmEmailController.sendCRMEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors de l'envoi de l'email CRM",
        error: "Email service error"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("processInboundReply", () => {
    it("should return 400 when From is missing", async () => {
      mockReq.body = { To: "test@example.com", Subject: "Reply" };

      await crmEmailController.processInboundReply(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Données de webhook invalides"
      });
    });

    it("should return 400 when To is missing", async () => {
      mockReq.body = { From: "sender@example.com", Subject: "Reply" };

      await crmEmailController.processInboundReply(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should return 400 when Subject is missing", async () => {
      mockReq.body = { From: "sender@example.com", To: "test@example.com" };

      await crmEmailController.processInboundReply(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it("should process webhook successfully when original email found", async () => {
      const mockResult = {
        _id: "reply1",
        originalEmailId: "email1",
        fromEmail: "sender@example.com",
        toEmail: "test@example.com",
        subject: "Re: Test",
        metadata: { receivedAt: new Date() }
      };
      (EmailService.processInboundReply as jest.Mock).mockResolvedValue(
        mockResult
      );

      mockReq.body = {
        From: "sender@example.com",
        To: "test@example.com",
        Subject: "Re: Test"
      };

      await crmEmailController.processInboundReply(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.processInboundReply).toHaveBeenCalledWith(
        mockReq.body
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Réponse entrante traitée avec succès",
        data: {
          replyId: "reply1",
          originalEmailId: "email1",
          fromEmail: "sender@example.com",
          toEmail: "test@example.com",
          subject: "Re: Test",
          receivedAt: mockResult.metadata.receivedAt
        }
      });
    });

    it("should handle case when no original email found", async () => {
      (EmailService.processInboundReply as jest.Mock).mockResolvedValue(null);

      mockReq.body = {
        From: "sender@example.com",
        To: "test@example.com",
        Subject: "Re: Test"
      };

      await crmEmailController.processInboundReply(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Email traité mais aucun email original trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (EmailService.processInboundReply as jest.Mock).mockRejectedValue(
        new Error("Processing error")
      );

      mockReq.body = {
        From: "sender@example.com",
        To: "test@example.com",
        Subject: "Re: Test"
      };

      await crmEmailController.processInboundReply(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getEmailHistory", () => {
    it("should return email history with default pagination", async () => {
      const mockResult = {
        emails: [{ id: "email1", subject: "Test" }],
        pagination: { page: 1, limit: 10, total: 1 }
      };
      (EmailService.getEmailHistory as jest.Mock).mockResolvedValue(mockResult);

      await crmEmailController.getEmailHistory(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.getEmailHistory).toHaveBeenCalledWith({
        page: 1,
        limit: 10
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Historique récupéré avec succès",
        data: mockResult.emails,
        pagination: mockResult.pagination
      });
    });

    it("should apply filters from query parameters", async () => {
      const mockResult = {
        emails: [{ id: "email1", subject: "Test" }],
        pagination: { page: 2, limit: 5, total: 1 }
      };
      (EmailService.getEmailHistory as jest.Mock).mockResolvedValue(mockResult);

      mockReq.query = {
        userId: "user1",
        companyId: "comp1",
        contactId: "contact1",
        status: "sent",
        dateFrom: "2023-01-01",
        dateTo: "2023-12-31",
        page: "2",
        limit: "5"
      };

      await crmEmailController.getEmailHistory(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.getEmailHistory).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        userId: "user1",
        companyId: "comp1",
        contactId: "contact1",
        status: "sent",
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-12-31")
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 when service throws error", async () => {
      (EmailService.getEmailHistory as jest.Mock).mockRejectedValue(
        new Error("History error")
      );

      await crmEmailController.getEmailHistory(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getEmailHistoryByUserId", () => {
    it("should return 400 when userId is missing", async () => {
      mockReq.params = {};

      await crmEmailController.getEmailHistoryByUserId(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "L'ID utilisateur est requis"
      });
    });

    it("should return 401 when auth token is missing", async () => {
      mockReq.params = { userId: "user1" };
      mockReq.headers = {};

      await crmEmailController.getEmailHistoryByUserId(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Token d'authentification requis"
      });
    });

    it("should return user email history successfully", async () => {
      const mockResult = {
        user: { id: "user1", name: "Test User" },
        emails: [{ id: "email1", subject: "Test" }],
        pagination: { page: 1, limit: 10, total: 1 }
      };
      (EmailService.getEmailHistoryByUserId as jest.Mock).mockResolvedValue(
        mockResult
      );

      mockReq.params = { userId: "user1" };
      mockReq.headers = { authorization: "Bearer token123" };
      mockReq.query = { companyId: "comp1", page: "1", limit: "10" };

      await crmEmailController.getEmailHistoryByUserId(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.getEmailHistoryByUserId).toHaveBeenCalledWith(
        "user1",
        "token123",
        { page: 1, limit: 10, companyId: "comp1" }
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Historique utilisateur récupéré avec succès",
        data: {
          user: mockResult.user,
          emails: mockResult.emails
        },
        pagination: mockResult.pagination
      });
    });

    it("should return 404 when user not found", async () => {
      (EmailService.getEmailHistoryByUserId as jest.Mock).mockRejectedValue(
        new Error("Utilisateur non trouvé")
      );

      mockReq.params = { userId: "user999" };
      mockReq.headers = { authorization: "Bearer token123" };

      await crmEmailController.getEmailHistoryByUserId(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Utilisateur non trouvé",
        error: "Utilisateur non trouvé"
      });
    });

    it("should return 401 when authentication error", async () => {
      (EmailService.getEmailHistoryByUserId as jest.Mock).mockRejectedValue(
        new Error("Token d'authentification invalide")
      );

      mockReq.params = { userId: "user1" };
      mockReq.headers = { authorization: "Bearer invalid-token" };

      await crmEmailController.getEmailHistoryByUserId(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur d'authentification",
        error: "Token d'authentification invalide"
      });
    });
  });

  describe("getEmailStats", () => {
    it("should return email statistics with calculated percentages", async () => {
      const mockStats = {
        totalEmails: 100,
        sentEmails: 85,
        failedEmails: 15,
        pendingEmails: 0
      };
      (EmailService.getEmailStats as jest.Mock).mockResolvedValue(mockStats);

      await crmEmailController.getEmailStats(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.getEmailStats).toHaveBeenCalledWith({});
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Statistiques récupérées avec succès",
        data: {
          ...mockStats,
          successRate: "85.00%",
          failureRate: "15.00%"
        }
      });
    });

    it("should handle zero total emails", async () => {
      const mockStats = {
        totalEmails: 0,
        sentEmails: 0,
        failedEmails: 0,
        pendingEmails: 0
      };
      (EmailService.getEmailStats as jest.Mock).mockResolvedValue(mockStats);

      await crmEmailController.getEmailStats(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Statistiques récupérées avec succès",
        data: {
          ...mockStats,
          successRate: "0%",
          failureRate: "0%"
        }
      });
    });

    it("should apply filters from query parameters", async () => {
      const mockStats = {
        totalEmails: 50,
        sentEmails: 40,
        failedEmails: 10,
        pendingEmails: 0
      };
      (EmailService.getEmailStats as jest.Mock).mockResolvedValue(mockStats);

      mockReq.query = {
        userId: "user1",
        companyId: "comp1",
        dateFrom: "2023-01-01",
        dateTo: "2023-12-31"
      };

      await crmEmailController.getEmailStats(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.getEmailStats).toHaveBeenCalledWith({
        userId: "user1",
        companyId: "comp1",
        dateFrom: new Date("2023-01-01"),
        dateTo: new Date("2023-12-31")
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 when service throws error", async () => {
      (EmailService.getEmailStats as jest.Mock).mockRejectedValue(
        new Error("Stats error")
      );

      await crmEmailController.getEmailStats(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("testConnection", () => {
    it("should return connection status when connected", async () => {
      (EmailService.verifyConnection as jest.Mock).mockResolvedValue(true);

      await crmEmailController.testConnection(
        mockReq as Request,
        mockRes as Response
      );

      expect(EmailService.verifyConnection).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Connexion SMTP OK",
        data: { isConnected: true }
      });
    });

    it("should return connection status when not connected", async () => {
      (EmailService.verifyConnection as jest.Mock).mockResolvedValue(false);

      await crmEmailController.testConnection(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Problème de connexion SMTP",
        data: { isConnected: false }
      });
    });

    it("should return 500 when service throws error", async () => {
      (EmailService.verifyConnection as jest.Mock).mockRejectedValue(
        new Error("Connection error")
      );

      await crmEmailController.testConnection(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
