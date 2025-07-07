"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function ValidationPage() {
  const searchParams = useSearchParams();
  const planName = searchParams.get("planName") || "";
  const router = useRouter();
  return (
    <div className="container">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Paiement réussi !</h1>
        <p>
          Merci pour votre abonnement au plan <b>{planName}</b>
        </p>
        <p>Vous allez recevoir un email de confirmation sous peu.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="dashboard-button"
        >
          Accéder au tableau de bord
        </button>
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .success-container {
          text-align: center;
          padding: 40px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(30, 41, 59, 0.08);
        }
        .success-icon {
          font-size: 72px;
          color: #10b981;
          margin-bottom: 20px;
        }
        .dashboard-button {
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
          font-weight: bold;
        }
        .dashboard-button:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}
