import stripe from "../config/stripe";
import { Stripe } from "stripe";

export class StripeService {
  /**
   * Crée une session de paiement Stripe
   */
  async createPaymentSession(
    amount: number,
    currency: string = "eur"
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: "Paiement"
              },
              unit_amount: amount * 100 // Stripe utilise les centimes
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`
      });

      return session;
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de paiement:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère les détails d'une session de paiement
   */
  async getPaymentSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      throw error;
    }
  }

  /**
   * Crée un remboursement
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number
  ): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId
      };

      if (amount) {
        refundParams.amount = amount * 100;
      }

      return await stripe.refunds.create(refundParams);
    } catch (error) {
      console.error("Erreur lors du remboursement:", error);
      throw error;
    }
  }

  /**
   * Crée un PaymentIntent pour Stripe Elements
   */
  async createPaymentIntent(
    amount: number,
    currency: string = "eur",
    planId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: planId ? { planId } : undefined
      });
      return paymentIntent;
    } catch (error) {
      console.error("Erreur lors de la création du PaymentIntent:", error);
      throw error;
    }
  }
}
