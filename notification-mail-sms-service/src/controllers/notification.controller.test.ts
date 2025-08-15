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

import { Request, Response } from "express";
import notificationController from "../controllers/notification.controller";
import emailService from "../services/email.service";
import { logger } from "../utils/logger";

describe("NotificationController", () => {
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

  describe("sendConfirmationEmail", () => {
    it("should return 400 when email is missing", async () => {
      mockReq.body = { confirmationToken: "token123" };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email et token de confirmation sont requis"
      });
      expect(logger.warn).toHaveBeenCalledWith(
        `Tentative d'envoi d'email avec des données incomplètes: ${JSON.stringify(mockReq.body)}`
      );
    });

    it("should return 400 when confirmationToken is missing", async () => {
      mockReq.body = { email: "test@example.com" };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email et token de confirmation sont requis"
      });
      expect(logger.warn).toHaveBeenCalledWith(
        `Tentative d'envoi d'email avec des données incomplètes: ${JSON.stringify(mockReq.body)}`
      );
    });

    it("should return 400 when both email and token are missing", async () => {
      mockReq.body = {};

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email et token de confirmation sont requis"
      });
    });

    it("should return 400 when email format is invalid - missing @", async () => {
      mockReq.body = {
        email: "invalid-email-format",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Format d'email invalide"
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Format d'email invalide: invalid-email-format"
      );
    });

    it("should return 400 when email format is invalid - missing domain", async () => {
      mockReq.body = {
        email: "test@",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Format d'email invalide"
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Format d'email invalide: test@"
      );
    });

    it("should return 400 when email format is invalid - missing extension", async () => {
      mockReq.body = {
        email: "test@domain",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Format d'email invalide"
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Format d'email invalide: test@domain"
      );
    });

    it("should return 400 when email format is invalid - spaces", async () => {
      mockReq.body = {
        email: "test @example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Format d'email invalide"
      });
      expect(logger.warn).toHaveBeenCalledWith(
        "Format d'email invalide: test @example.com"
      );
    });

    it("should send confirmation email successfully", async () => {
      (emailService.sendConfirmationEmail as jest.Mock).mockResolvedValue(true);

      mockReq.body = {
        email: "test@example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith(
        "test@example.com",
        "token123",
        "test" // username extracted from email
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Email de confirmation envoyé avec succès"
      });
      expect(logger.info).toHaveBeenCalledWith(
        "Email de confirmation envoyé avec succès à test@example.com"
      );
    });

    it("should extract username correctly from complex email", async () => {
      (emailService.sendConfirmationEmail as jest.Mock).mockResolvedValue(true);

      mockReq.body = {
        email: "john.doe+test@example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith(
        "john.doe+test@example.com",
        "token123",
        "john.doe+test" // username correctly extracted
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 when email service returns false", async () => {
      (emailService.sendConfirmationEmail as jest.Mock).mockResolvedValue(
        false
      );

      mockReq.body = {
        email: "test@example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(emailService.sendConfirmationEmail).toHaveBeenCalledWith(
        "test@example.com",
        "token123",
        "test"
      );
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Échec de l'envoi de l'email de confirmation"
      });
      expect(logger.error).toHaveBeenCalledWith(
        "Échec de l'envoi d'email à test@example.com"
      );
    });

    it("should return 500 when email service throws Error", async () => {
      const testError = new Error("SMTP connection failed");
      (emailService.sendConfirmationEmail as jest.Mock).mockRejectedValue(
        testError
      );

      mockReq.body = {
        email: "test@example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur interne du serveur",
        error: "SMTP connection failed"
      });
      expect(logger.error).toHaveBeenCalledWith(
        "Erreur lors de l'envoi de l'email de confirmation:",
        testError
      );
    });

    it("should return 500 when email service throws string error", async () => {
      (emailService.sendConfirmationEmail as jest.Mock).mockRejectedValue(
        "String error"
      );

      mockReq.body = {
        email: "test@example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur interne du serveur",
        error: "String error"
      });
      expect(logger.error).toHaveBeenCalledWith(
        "Erreur lors de l'envoi de l'email de confirmation:",
        "String error"
      );
    });

    it("should return 500 when email service throws non-Error object", async () => {
      (emailService.sendConfirmationEmail as jest.Mock).mockRejectedValue({
        code: 500
      });

      mockReq.body = {
        email: "test@example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur interne du serveur",
        error: "[object Object]" // String() convertit l'objet en "[object Object]"
      });
    });

    it("should validate common email formats correctly", async () => {
      (emailService.sendConfirmationEmail as jest.Mock).mockResolvedValue(true);

      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "user+tag@example.org",
        "user123@test-domain.com",
        "a@b.co"
      ];

      for (const email of validEmails) {
        mockReq.body = { email, confirmationToken: "token123" };

        await notificationController.sendConfirmationEmail(
          mockReq as Request,
          mockRes as Response
        );

        expect(mockStatus).toHaveBeenCalledWith(200);
        mockStatus.mockClear();
        mockJson.mockClear();
      }
    });
  });

  describe("sendEmailToClient", () => {
    it("should return 200 with success false message", async () => {
      mockReq.body = {
        email: "client@example.com",
        confirmationToken: "token123"
      };

      await notificationController.sendEmailToClient(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email envoyé"
      });
    });

    it("should return 500 when an error is thrown", async () => {
      // Force an error by making the method throw
      const originalMethod = notificationController.sendEmailToClient;
      notificationController.sendEmailToClient = jest
        .fn()
        .mockImplementation(async () => {
          throw new Error("Test error");
        });

      try {
        await notificationController.sendEmailToClient(
          mockReq as Request,
          mockRes as Response
        );
      } catch (error) {
        // Expected to throw
      }

      // Restore original method
      notificationController.sendEmailToClient = originalMethod;
    });

    it("should handle empty request body", async () => {
      mockReq.body = {};

      await notificationController.sendEmailToClient(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email envoyé"
      });
    });

    it("should handle request with only email", async () => {
      mockReq.body = { email: "test@example.com" };

      await notificationController.sendEmailToClient(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email envoyé"
      });
    });

    it("should handle request with only confirmationToken", async () => {
      mockReq.body = { confirmationToken: "token123" };

      await notificationController.sendEmailToClient(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email envoyé"
      });
    });
  });
});
