// Mock the config FIRST before any imports that might use it
jest.mock("../config", () => ({
  config: {
    server: {
      host: "localhost",
      port: 3002,
      env: "test",
      frontend_url: "http://localhost:3000",
      notification_url: "http://test-notification-url",
      protocol: "http"
    },
    database: {
      mongoUri: "mongodb://test"
    },
    jwt: {
      secret: "test-secret",
      expiresIn: "6h"
    },
    logging: {
      level: "info"
    },
    google: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      callback: "http://localhost:3002/auth/google/callback"
    },
    discord: {
      service_name: "authentication"
    }
  }
}));

// Ensure the default export is also mocked
jest.mock("../config", () => {
  const mockConfig = {
    server: {
      host: "localhost",
      port: 3002,
      env: "test",
      frontend_url: "http://localhost:3000",
      notification_url: "http://test-notification-url",
      protocol: "http"
    },
    database: {
      mongoUri: "mongodb://test"
    },
    jwt: {
      secret: "test-secret",
      expiresIn: "6h"
    },
    logging: {
      level: "info"
    },
    google: {
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      callback: "http://localhost:3002/auth/google/callback"
    },
    discord: {
      service_name: "authentication"
    }
  };

  return {
    __esModule: true,
    default: mockConfig,
    config: mockConfig
  };
});

// Other mocks - AFTER config mock
jest.mock("../services/auth.service");
jest.mock("../utils/logger");
jest.mock("../models/user.model");
jest.mock("jsonwebtoken");

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  loginOrRegister,
  resendConfirmationEmail,
  verifyEmail,
  verifyPassword
} from "../controllers/auth.controller";
import * as authService from "../services/auth.service";
import { logger } from "../utils/logger";
import User from "../models/user.model";

// Mock fetch globalement
global.fetch = jest.fn();

describe("AuthController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockReq = {
      body: {}
    };

    mockRes = {
      status: mockStatus,
      json: mockJson
    };

    // Reset tous les mocks
    jest.clearAllMocks();
  });

  describe("loginOrRegister", () => {
    it("should return 400 when email is missing", async () => {
      mockReq.body = { password: "password123" };

      await loginOrRegister(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Email et mot de passe requis"
      });
    });

    it("should return 400 when password is missing", async () => {
      mockReq.body = { email: "test@email.com" };

      await loginOrRegister(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Email et mot de passe requis"
      });
    });

    it("should return 200 with auth response when login successful", async () => {
      const mockAuthResponse = {
        token: "jwt-token",
        user: { id: 1, email: "test@email.com" }
      };
      (authService.loginOrRegister as jest.Mock).mockResolvedValue(
        mockAuthResponse
      );

      mockReq.body = { email: "test@email.com", password: "password123" };

      await loginOrRegister(mockReq as Request, mockRes as Response);

      expect(authService.loginOrRegister).toHaveBeenCalledWith(
        "test@email.com",
        "password123"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockAuthResponse);
    });

    it("should return 401 when account is deactivated", async () => {
      (authService.loginOrRegister as jest.Mock).mockRejectedValue(
        new Error("Compte désactivé. Contactez l'administrateur")
      );

      mockReq.body = { email: "test@email.com", password: "password123" };

      await loginOrRegister(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Compte désactivé. Contactez l'administrateur"
      });
    });

    it("should return 401 when password is incorrect", async () => {
      (authService.loginOrRegister as jest.Mock).mockRejectedValue(
        new Error("Mot de passe incorrect")
      );

      mockReq.body = { email: "test@email.com", password: "wrongpassword" };

      await loginOrRegister(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Email ou mot de passe incorrect"
      });
    });

    it("should return 500 for unexpected errors", async () => {
      (authService.loginOrRegister as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      mockReq.body = { email: "test@email.com", password: "password123" };

      await loginOrRegister(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de l'authentification"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("resendConfirmationEmail", () => {
    it("should return 400 when email is missing", async () => {
      mockReq.body = {};

      const result = await resendConfirmationEmail(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Email requis"
      });
    });

    it("should return 404 when user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      mockReq.body = { email: "nonexistent@email.com" };

      await resendConfirmationEmail(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Utilisateur non trouvé"
      });
    });

    it("should return 400 when user account is already active", async () => {
      const mockUser = { email: "test@email.com", active: true };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      mockReq.body = { email: "test@email.com" };

      await resendConfirmationEmail(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Votre compte est déjà activé"
      });
    });

    it("should successfully resend confirmation email", async () => {
      const mockUser = {
        email: "test@email.com",
        active: false,
        confirmationToken: "",
        save: jest.fn().mockResolvedValue(true)
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: true })
      });

      mockReq.body = { email: "test@email.com" };

      await resendConfirmationEmail(mockReq as Request, mockRes as Response);

      expect(jwt.sign).toHaveBeenCalledWith(
        { email: "test@email.com" },
        "test-secret",
        { expiresIn: "24h" }
      );
      expect(mockUser.save).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        "http://test-notification-url/send-confirmation",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 when notification service fails", async () => {
      const mockUser = {
        email: "test@email.com",
        active: false,
        confirmationToken: "",
        save: jest.fn().mockResolvedValue(true)
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: false })
      });

      mockReq.body = { email: "test@email.com" };

      await resendConfirmationEmail(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Échec de l'envoi de l'email de confirmation"
      });
    });
  });

  describe("verifyEmail", () => {
    it("should return 400 when token is missing", async () => {
      mockReq.body = {};

      await verifyEmail(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Token requis"
      });
    });

    it("should return 400 when token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      mockReq.body = { token: "invalid-token" };

      await verifyEmail(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Token invalide ou expiré"
      });
    });

    it("should return 400 when user not found with token", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ email: "test@email.com" });
      (User.findOne as jest.Mock).mockResolvedValue(null);

      mockReq.body = { token: "valid-token" };

      await verifyEmail(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Token invalide ou expiré"
      });
    });

    it("should successfully verify email", async () => {
      const mockUser = {
        email: "test@email.com",
        active: false,
        confirmationToken: "valid-token",
        save: jest.fn().mockResolvedValue(true)
      };

      (jwt.verify as jest.Mock).mockReturnValue({ email: "test@email.com" });
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      mockReq.body = { token: "valid-token" };

      await verifyEmail(mockReq as Request, mockRes as Response);

      expect(mockUser.active).toBe(true);
      expect(mockUser.confirmationToken).toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: "Email vérifié avec succès. Votre compte est maintenant actif."
      });
    });
  });

  describe("verifyPassword", () => {
    it("should return 400 when email is missing", async () => {
      mockReq.body = { password: "password123" };

      await verifyPassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Email et mot de passe requis",
        valid: false
      });
    });

    it("should return 400 when password is missing", async () => {
      mockReq.body = { email: "test@email.com" };

      await verifyPassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Email et mot de passe requis",
        valid: false
      });
    });

    it("should return 200 with valid true when password is correct", async () => {
      (authService.verifyPassword as jest.Mock).mockResolvedValue(true);
      mockReq.body = { email: "test@email.com", password: "correct-password" };

      await verifyPassword(mockReq as Request, mockRes as Response);

      expect(authService.verifyPassword).toHaveBeenCalledWith(
        "test@email.com",
        "correct-password"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ valid: true });
    });

    it("should return 200 with valid false when password is incorrect", async () => {
      (authService.verifyPassword as jest.Mock).mockResolvedValue(false);
      mockReq.body = { email: "test@email.com", password: "wrong-password" };

      await verifyPassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ valid: false });
    });

    it("should return 500 when service throws error", async () => {
      (authService.verifyPassword as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );
      mockReq.body = { email: "test@email.com", password: "password123" };

      await verifyPassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la vérification",
        valid: false
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
