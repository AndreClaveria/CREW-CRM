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
import { paymentStyles } from "@/styles/pages/dashboard/stripe/paymentStyles";

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
  const [isHover, setIsHover] = useState(false);

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
    <form onSubmit={handleSubmit} style={paymentStyles.paymentForm}>
      {/* Champs de facturation et CardElement, similaire à l'ancien code */}
      <input
        type="text"
        placeholder="Nom complet *"
        value={billingInfo.name}
        onChange={(e) =>
          setBillingInfo({ ...billingInfo, name: e.target.value })
        }
        required
        style={paymentStyles.formInput}
      />
      <input
        type="email"
        placeholder="Email *"
        value={billingInfo.email}
        onChange={(e) =>
          setBillingInfo({ ...billingInfo, email: e.target.value })
        }
        required
        style={paymentStyles.formInput}
      />
      <input
        type="text"
        placeholder="Adresse"
        value={billingInfo.address}
        onChange={(e) =>
          setBillingInfo({ ...billingInfo, address: e.target.value })
        }
        style={paymentStyles.formInput}
      />
      <input
        type="text"
        placeholder="Ville"
        value={billingInfo.city}
        onChange={(e) =>
          setBillingInfo({ ...billingInfo, city: e.target.value })
        }
        style={paymentStyles.formInput}
      />
      <input
        type="text"
        placeholder="Code postal"
        value={billingInfo.zipCode}
        onChange={(e) =>
          setBillingInfo({ ...billingInfo, zipCode: e.target.value })
        }
        style={paymentStyles.formInput}
      />
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#1e293b",
              fontFamily: "inherit",
              "::placeholder": { color: "#94a3b8" },
            },
            invalid: { color: "#ef4444" },
          },
        }}
      />
      {error && <div style={paymentStyles.errorMessage}>{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          ...paymentStyles.payButton,
          ...(isHover ? paymentStyles.payButtonHover : {}),
          opacity: !stripe || loading ? "var(--opacity-less)" : 1,
          cursor: !stripe || loading ? "not-allowed" : "pointer",
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {loading ? "Traitement..." : `Payer ${planPrice}€`}
      </button>
    </form>
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
  if (!planId || !planPrice || !planName)
    return <div>Paramètres de plan manquants.</div>;
  if (!authToken) return <div>Authentification requise.</div>;
  return (
    <div style={paymentStyles.stripeBg}>
      <div style={paymentStyles.paymentWrapper}>
        <Elements stripe={stripePromise}>
          <PaymentForm
            planId={planId}
            planPrice={planPrice}
            planName={planName}
            authToken={authToken}
          />
        </Elements>
      </div>
    </div>
  );
}
