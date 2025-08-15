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

// Mock des méthodes StripeService
const mockCreatePaymentSession = jest.fn();
const mockGetPaymentSession = jest.fn();
const mockCreateRefund = jest.fn();
const mockCreatePaymentIntent = jest.fn();

jest.mock("../services/stripeService", () => ({
  StripeService: jest.fn().mockImplementation(() => ({
    createPaymentSession: mockCreatePaymentSession,
    getPaymentSession: mockGetPaymentSession,
    createRefund: mockCreateRefund,
    createPaymentIntent: mockCreatePaymentIntent
  }))
}));

import { Request, Response } from "express";
import { PaymentController } from "./paymentController";

describe("PaymentController", () => {
  let paymentController: PaymentController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    paymentController = new PaymentController();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = { body: {}, params: {}, query: {}, headers: {} };
    mockRes = { status: mockStatus, json: mockJson };

    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("createPaymentSession", () => {
    it("should return 400 when amount is missing", async () => {
      mockReq.body = { currency: "eur" };

      await paymentController.createPaymentSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Le montant doit être supérieur à 0"
      });
    });

    it("should return 400 when amount is zero", async () => {
      mockReq.body = { amount: 0, currency: "eur" };

      await paymentController.createPaymentSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Le montant doit être supérieur à 0"
      });
    });

    it("should return 400 when amount is negative", async () => {
      mockReq.body = { amount: -100, currency: "eur" };

      await paymentController.createPaymentSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Le montant doit être supérieur à 0"
      });
    });

    it("should create payment session successfully with default currency", async () => {
      const mockSession = {
        id: "cs_session123",
        url: "https://checkout.stripe.com/pay/session123",
        amount_total: 2000
      };

      mockCreatePaymentSession.mockResolvedValue(mockSession);
      mockReq.body = { amount: 2000 };

      await paymentController.createPaymentSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockSession
      });
    });

    it("should create payment session successfully with custom currency", async () => {
      const mockSession = {
        id: "cs_session123",
        url: "https://checkout.stripe.com/pay/session123",
        amount_total: 5000
      };

      mockCreatePaymentSession.mockResolvedValue(mockSession);
      mockReq.body = { amount: 5000, currency: "usd" };

      await paymentController.createPaymentSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockSession
      });
    });

    it("should return 500 when stripe service throws error", async () => {
      mockCreatePaymentSession.mockRejectedValue(new Error("Stripe API error"));
      mockReq.body = { amount: 2000, currency: "eur" };

      await paymentController.createPaymentSession(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors de la création de la session de paiement"
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur dans le contrôleur de paiement:",
        expect.any(Error)
      );
    });
  });

  describe("checkPaymentStatus", () => {
    it("should return 400 when sessionId is missing", async () => {
      mockReq.params = {};

      await paymentController.checkPaymentStatus(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "ID de session requis"
      });
    });

    it("should return 400 when sessionId is empty string", async () => {
      mockReq.params = { sessionId: "" };

      await paymentController.checkPaymentStatus(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "ID de session requis"
      });
    });

    it("should return payment session status successfully", async () => {
      const mockSession = {
        id: "cs_session123",
        payment_status: "paid",
        amount_total: 2000,
        customer_email: "test@example.com"
      };

      mockGetPaymentSession.mockResolvedValue(mockSession);
      mockReq.params = { sessionId: "cs_session123" };

      await paymentController.checkPaymentStatus(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockSession
      });
    });

    it("should return 500 when stripe service throws error", async () => {
      mockGetPaymentSession.mockRejectedValue(new Error("Session not found"));
      mockReq.params = { sessionId: "cs_invalid123" };

      await paymentController.checkPaymentStatus(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors de la vérification du statut du paiement"
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors de la vérification du paiement:",
        expect.any(Error)
      );
    });
  });

  describe("createRefund", () => {
    it("should return 400 when paymentIntentId is missing", async () => {
      mockReq.body = { amount: 1000 };

      await paymentController.createRefund(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "ID de paiement requis"
      });
    });

    it("should return 400 when paymentIntentId is empty string", async () => {
      mockReq.body = { paymentIntentId: "", amount: 1000 };

      await paymentController.createRefund(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "ID de paiement requis"
      });
    });

    it("should create refund successfully with amount", async () => {
      const mockRefund = {
        id: "re_refund123",
        amount: 1500,
        status: "succeeded",
        payment_intent: "pi_payment123"
      };

      mockCreateRefund.mockResolvedValue(mockRefund);
      mockReq.body = { paymentIntentId: "pi_payment123", amount: 1500 };

      await paymentController.createRefund(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockRefund
      });
    });

    it("should create refund successfully without amount (full refund)", async () => {
      const mockRefund = {
        id: "re_refund123",
        amount: 2000,
        status: "succeeded",
        payment_intent: "pi_payment123"
      };

      mockCreateRefund.mockResolvedValue(mockRefund);
      mockReq.body = { paymentIntentId: "pi_payment123" };

      await paymentController.createRefund(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockRefund
      });
    });

    it("should return 500 when stripe service throws Error with message", async () => {
      const testError = new Error("Payment already refunded");
      mockCreateRefund.mockRejectedValue(testError);
      mockReq.body = { paymentIntentId: "pi_payment123", amount: 1000 };

      await paymentController.createRefund(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors du remboursement",
        error: "Payment already refunded"
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors du remboursement:",
        testError
      );
    });

    it("should return 500 when stripe service throws non-Error", async () => {
      mockCreateRefund.mockRejectedValue("String error");
      mockReq.body = { paymentIntentId: "pi_payment123", amount: 1000 };

      await paymentController.createRefund(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors du remboursement",
        error: "String error"
      });
    });
  });

  describe("createPaymentIntent", () => {
    it("should return 400 when amount is missing", async () => {
      mockReq.body = { currency: "eur" };

      await paymentController.createPaymentIntent(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Le montant doit être supérieur à 0"
      });
    });

    it("should return 400 when amount is zero", async () => {
      mockReq.body = { amount: 0 };

      await paymentController.createPaymentIntent(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Le montant doit être supérieur à 0"
      });
    });

    it("should return 400 when amount is negative", async () => {
      mockReq.body = { amount: -500 };

      await paymentController.createPaymentIntent(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Le montant doit être supérieur à 0"
      });
    });

    it("should create payment intent successfully with default currency", async () => {
      const mockPaymentIntent = {
        id: "pi_intent123",
        client_secret: "pi_intent123_secret_xyz",
        amount: 3000,
        currency: "eur",
        status: "requires_payment_method"
      };

      mockCreatePaymentIntent.mockResolvedValue(mockPaymentIntent);
      mockReq.body = { amount: 3000 };

      await paymentController.createPaymentIntent(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockPaymentIntent
      });
    });

    it("should create payment intent successfully with custom currency and planId", async () => {
      const mockPaymentIntent = {
        id: "pi_intent123",
        client_secret: "pi_intent123_secret_xyz",
        amount: 5000,
        currency: "usd",
        status: "requires_payment_method"
      };

      mockCreatePaymentIntent.mockResolvedValue(mockPaymentIntent);
      mockReq.body = { amount: 5000, currency: "usd", planId: "plan_premium" };

      await paymentController.createPaymentIntent(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockPaymentIntent
      });
    });

    it("should return 500 when stripe service throws error with message", async () => {
      const testError = new Error("Invalid API key");
      testError.stack = "Error stack trace";
      mockCreatePaymentIntent.mockRejectedValue(testError);
      mockReq.body = { amount: 2000, currency: "eur" };

      await paymentController.createPaymentIntent(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors de la création du PaymentIntent",
        error: "Invalid API key"
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors de la création du PaymentIntent:",
        testError,
        "Invalid API key",
        "Error stack trace"
      );
    });

    it("should return 500 when stripe service throws non-Error", async () => {
      mockCreatePaymentIntent.mockRejectedValue("Service unavailable");
      mockReq.body = { amount: 2000 };

      await paymentController.createPaymentIntent(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors de la création du PaymentIntent",
        error: "Service unavailable"
      });
    });
  });

  describe("handleWebhook", () => {
    it("should return 200 with received true", async () => {
      await paymentController.handleWebhook(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ received: true });
    });
  });

  describe("getCustomerPayments", () => {
    it("should return 200 with empty array", async () => {
      await paymentController.getCustomerPayments(
        mockReq as Request,
        mockRes as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ success: true, data: [] });
    });
  });
});
