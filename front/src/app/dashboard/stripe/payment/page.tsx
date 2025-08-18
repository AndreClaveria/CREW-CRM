"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm({
  planId,
  planPrice,
  planName,
  authToken,
}: {
  planId: string;
  planPrice: number;
  planName: string;
  authToken: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "FR",
  });

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL_PAYMENT}payments/create-payment-intent`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            amount: planPrice * 100,
            currency: "eur",
            planId,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.success)
          throw new Error(
            data.message || "Erreur lors de la création du paiement"
          );
        setClientSecret(data.data.client_secret);
      } catch (err: any) {
        setError(err.message || "Impossible de créer la session de paiement.");
      }
    };
    if (planPrice > 0 && authToken) createPaymentIntent();
  }, [planId, planPrice, authToken]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    setError(null);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    const { error: paymentError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingInfo.name,
            email: billingInfo.email,
            address: {
              line1: billingInfo.address,
              city: billingInfo.city,
              postal_code: billingInfo.zipCode,
              country: billingInfo.country,
            },
          },
        },
      });
    if (paymentError) setError(paymentError.message || "Erreur de paiement");
    else if (paymentIntent?.status === "succeeded")
      router.push(
        `/dashboard/stripe/validation?planName=${encodeURIComponent(planName)}`
      );
    setLoading(false);
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Finaliser votre commande</h1>
        <p>Complétez vos informations pour souscrire au {planName}</p>
      </div>

      <div className="payment-content">
        {/* Résumé de la commande */}
        <div className="order-summary">
          <h3>Résumé de commande</h3>
          <div className="plan-summary">
            <div className="plan-info">
              <span className="plan-title">{planName}</span>
              <div className="plan-price">
                <span className="amount">{planPrice}€</span>
                <span className="period">/mois</span>
              </div>
            </div>
            <div className="total-section">
              <div className="total-line">
                <span>Sous-total</span>
                <span>{planPrice}€</span>
              </div>
              <div className="total-line">
                <span>TVA (20%)</span>
                <span>{(planPrice * 0.2).toFixed(2)}€</span>
              </div>
              <div className="total-line total-final">
                <span>Total</span>
                <span>{(planPrice * 1.2).toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div className="payment-form-container">
          <form onSubmit={handleSubmit} className="payment-form">
            <h3>Informations de facturation</h3>

            <div className="form-row">
              <input
                type="text"
                placeholder="Nom complet *"
                value={billingInfo.name}
                onChange={(e) =>
                  setBillingInfo({ ...billingInfo, name: e.target.value })
                }
                required
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email *"
                value={billingInfo.email}
                onChange={(e) =>
                  setBillingInfo({ ...billingInfo, email: e.target.value })
                }
                required
                className="form-input"
              />
            </div>

            <input
              type="text"
              placeholder="Adresse"
              value={billingInfo.address}
              onChange={(e) =>
                setBillingInfo({ ...billingInfo, address: e.target.value })
              }
              className="form-input full-width"
            />

            <div className="form-row">
              <input
                type="text"
                placeholder="Ville"
                value={billingInfo.city}
                onChange={(e) =>
                  setBillingInfo({ ...billingInfo, city: e.target.value })
                }
                className="form-input"
              />
              <input
                type="text"
                placeholder="Code postal"
                value={billingInfo.zipCode}
                onChange={(e) =>
                  setBillingInfo({ ...billingInfo, zipCode: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="card-section">
              <h3>Informations de paiement</h3>
              <div className="card-element-container">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#1e293b",
                        fontFamily: "inherit",
                        padding: "16px",
                        "::placeholder": { color: "#94a3b8" },
                      },
                      invalid: { color: "#ef4444" },
                    },
                  }}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={!stripe || loading}
              className={`pay-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Traitement...
                </>
              ) : (
                `Payer ${(planPrice * 1.2).toFixed(2)}€`
              )}
            </button>

            <div className="security-info">
              <div className="security-icons">🔒</div>
              <span>Paiement sécurisé avec chiffrement SSL</span>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .payment-container {
          min-height: 90vh;
          background: #f8fafc;
          padding: 40px 20px;
        }

        .payment-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .payment-header h1 {
          font-size: 42px;
          margin: 0;
          color: #1e293b;
          font-weight: 800;
        }

        .payment-header p {
          font-size: 20px;
          color: #64748b;
          margin: 10px 0 0 0;
        }

        .payment-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
        }

        .order-summary {
          background: #fff;
          border-radius: 18px;
          padding: 32px;
          border: 2px solid #e2e8f0;
          height: fit-content;
          box-shadow: 0 4px 24px rgba(30, 41, 59, 0.08);
        }

        .order-summary h3 {
          font-size: 24px;
          color: #1e293b;
          font-weight: 700;
          margin: 0 0 24px 0;
        }

        .plan-summary {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .plan-info {
          padding: 24px;
          background: #f8fafc;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .plan-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .plan-price {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
        }

        .period {
          font-size: 16px;
          color: #64748b;
          margin-left: 5px;
          font-weight: 400;
        }

        .total-section {
          padding: 24px;
          background: white;
        }

        .total-line {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          color: #475569;
          font-size: 16px;
        }

        .total-final {
          border-top: 2px solid #e2e8f0;
          margin-top: 16px;
          padding-top: 16px;
          font-weight: bold;
          font-size: 18px;
          color: #1e293b;
        }

        .payment-form-container {
          background: #fff;
          border-radius: 18px;
          padding: 32px;
          border: 2px solid #e2e8f0;
          box-shadow: 0 4px 24px rgba(30, 41, 59, 0.08);
        }

        .payment-form h3 {
          font-size: 24px;
          color: #1e293b;
          font-weight: 700;
          margin: 0 0 24px 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 16px;
          color: #1e293b;
          font-family: inherit;
          transition: border-color 0.3s, box-shadow 0.3s;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .full-width {
          grid-column: 1 / -1;
          margin-bottom: 16px;
        }

        .card-section {
          margin: 32px 0;
        }

        .card-section h3 {
          font-size: 20px;
          color: #1e293b;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .card-element-container {
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .card-element-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #fecaca;
          margin: 16px 0;
          font-size: 14px;
        }

        .pay-button {
          width: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.3, 1);
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .pay-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
        }

        .pay-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .security-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          color: #64748b;
          font-size: 14px;
        }

        .security-icons {
          font-size: 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          .payment-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .payment-header h1 {
            font-size: 32px;
          }

          .order-summary,
          .payment-form-container {
            padding: 24px;
          }
        }

        @media (max-width: 768px) {
          .payment-container {
            padding: 20px 16px;
          }

          .payment-header h1 {
            font-size: 28px;
          }

          .payment-header p {
            font-size: 18px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .order-summary,
          .payment-form-container {
            padding: 20px;
          }

          .plan-info {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId") || "";
  const planPrice = Number(searchParams.get("planPrice")) || 0;
  const planName = searchParams.get("planName") || "";
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(localStorage.getItem("token"));
  }, []);

  if (!planId || !planPrice || !planName) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Paramètres manquants</h2>
          <p>Les informations du plan sélectionné sont manquantes.</p>
        </div>
        <style jsx>{`
          .error-container {
            min-height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }
          .error-content {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 18px;
            border: 2px solid #e2e8f0;
            box-shadow: 0 4px 24px rgba(30, 41, 59, 0.08);
          }
          .error-content h2 {
            color: #dc2626;
            font-size: 24px;
            margin: 0 0 16px 0;
          }
          .error-content p {
            color: #64748b;
            font-size: 16px;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  if (!authToken) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Authentification requise</h2>
          <p>Vous devez être connecté pour effectuer un paiement.</p>
        </div>
        <style jsx>{`
          .error-container {
            min-height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }
          .error-content {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 18px;
            border: 2px solid #e2e8f0;
            box-shadow: 0 4px 24px rgba(30, 41, 59, 0.08);
          }
          .error-content h2 {
            color: #dc2626;
            font-size: 24px;
            margin: 0 0 16px 0;
          }
          .error-content p {
            color: #64748b;
            font-size: 16px;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        planId={planId}
        planPrice={planPrice}
        planName={planName}
        authToken={authToken}
      />
    </Elements>
  );
}
