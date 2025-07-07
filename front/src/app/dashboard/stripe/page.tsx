"use client";
import React from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "basic",
    name: "Plan Basique",
    price: 0,
    features: ["Gestion contacts", "Support email"],
    now: true,
  },
  {
    id: "pro",
    name: "Plan Pro",
    price: 35,
    features: ["Toutes les fonctionnalités", "Rapports avancés"],
    now: false,
  },
  {
    id: "enterprise",
    name: "Plan Entreprise",
    price: 75,
    features: ["Intégrations avancées", "Personnalisation"],
    now: false,
  },
];

export default function StripePlansPage() {
  const router = useRouter();
  const handlePlanSelect = (plan: (typeof plans)[0]) => {
    if (plan.price === 0) {
      router.push(
        `/dashboard/stripe/validation?planName=${encodeURIComponent(plan.name)}`
      );
    } else {
      router.push(
        `/dashboard/stripe/payment?planId=${plan.id}&planPrice=${
          plan.price
        }&planName=${encodeURIComponent(plan.name)}`
      );
    }
  };
  return (
    <div className="stripe-bg">
      <div className="plans-header">
        <h1>Choisissez votre plan CRM</h1>
        <p>Sélectionnez le plan qui correspond le mieux à vos besoins</p>
      </div>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card${plan.now ? " now" : ""}`}>
            {plan.now && <div className="now-badge">Actuel</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="amount">{plan.price}€</span>
              <span className="period">/mois</span>
            </div>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelect(plan)}
              className="select-button"
            >
              Choisir ce plan
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .stripe-bg {
          min-height: 90vh;
        }
        .plans-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .plans-header h1 {
          font-size: 42px;
          margin: 0;
          color: #1e293b;
          font-weight: 800;
        }
        .plans-header p {
          font-size: 20px;
          color: #64748b;
          margin: 10px 0 0 0;
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .plan-card {
          background: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 18px;
          padding: 38px 28px 32px 28px;
          text-align: center;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 2, 0.3, 1);
          box-shadow: 0 4px 24px rgba(30, 41, 59, 0.08);
        }
        .plan-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }
        .plan-card.now {
          border-color: #3b82f6;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.13);
        }
        .now-badge {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          padding: 7px 28px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }
        .plan-card h3 {
          font-size: 26px;
          margin: 0 0 18px 0;
          color: #1e293b;
          font-weight: 700;
        }
        .price {
          margin: 18px 0 28px 0;
          font-size: 32px;
          font-weight: bold;
          color: #3b82f6;
        }
        .period {
          font-size: 18px;
          color: #64748b;
          margin-left: 5px;
          font-weight: 400;
        }
        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 28px 0;
          text-align: left;
        }
        .features li {
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
          color: #475569;
          font-size: 16px;
        }
        .features li:before {
          content: "✓ ";
          color: #10b981;
          font-weight: bold;
          margin-right: 8px;
        }
        .select-button {
          width: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 10px;
          font-size: 17px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 10px;
        }
        .select-button:hover {
          background: #2563eb;
        }
        @media (max-width: 700px) {
          .plans-header h1 {
            font-size: 28px;
          }
          .plans-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .plan-card {
            padding: 24px 10px 20px 10px;
          }
        }
      `}</style>
    </div>
  );
}
