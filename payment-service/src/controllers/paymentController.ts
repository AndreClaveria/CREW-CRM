import { Request, Response } from "express";
import { StripeService } from "../services/stripeService";

const stripeService = new StripeService();

export class PaymentController {
  /**
   * Crée une session de paiement
   */
  async createPaymentSession(req: Request, res: Response) {
    try {
      const { amount, currency = "eur" } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Le montant doit être supérieur à 0"
        });
      }

      const session = await stripeService.createPaymentSession(
        amount,
        currency
      );

      return res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error("Erreur dans le contrôleur de paiement:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la session de paiement"
      });
    }
  }

  /**
   * Vérifie le statut d'une session de paiement
   */
  async checkPaymentStatus(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: "ID de session requis"
        });
      }

      const session = await stripeService.getPaymentSession(sessionId);

      return res.status(200).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification du statut du paiement"
      });
    }
  }

  /**
   * Crée un remboursement
   */
  async createRefund(req: Request, res: Response) {
    try {
      const { paymentIntentId, amount } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: "ID de paiement requis"
        });
      }

      const refund = await stripeService.createRefund(paymentIntentId, amount);

      return res.status(200).json({
        success: true,
        data: refund
      });
    } catch (error: any) {
      console.error("Erreur lors du remboursement:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors du remboursement",
        error: error.message || error
      });
    }
  }

  /**
   * Crée un PaymentIntent pour Stripe Elements
   */
  async createPaymentIntent(req: Request, res: Response) {
    try {
      const { amount, currency = "eur", planId } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Le montant doit être supérieur à 0"
        });
      }
      const paymentIntent = await stripeService.createPaymentIntent(
        amount,
        currency,
        planId
      );
      return res.status(200).json({
        success: true,
        data: paymentIntent
      });
    } catch (error: any) {
      console.error(
        "Erreur lors de la création du PaymentIntent:",
        error,
        error?.message,
        error?.stack
      );
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création du PaymentIntent",
        error: error?.message || error
      });
    }
  }

  /**
   * Gère les webhooks Stripe (à compléter selon tes besoins)
   */
  async handleWebhook(req: Request, res: Response) {
    // À personnaliser selon la logique Stripe
    res.status(200).json({ received: true });
  }

  /**
   * Récupère les paiements d'un client (à compléter selon ta logique)
   */
  async getCustomerPayments(req: Request, res: Response) {
    // À personnaliser selon ta logique de stockage/Stripe
    res.status(200).json({ success: true, data: [] });
  }
}
