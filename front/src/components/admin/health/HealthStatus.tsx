// src/components/admin/health/HealthStatus.tsx
import React, { useState, CSSProperties } from "react";
import { healthStyles } from "@/styles/components/admin/health/healthStyles";
import { useServicesHealth } from "@/services/health.service";
import { useSpinAnimation } from "@/hooks/useCssAnimation";

const HealthStatus: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Utilisation du hook pour injecter l'animation spin
  useSpinAnimation();

  // Utilisation du hook personnalisé pour la logique de services
  const { services, loading, error, lastUpdated, refreshServices, stats } =
    useServicesHealth(30000); // Rafraîchissement toutes les 30 secondes

  // Fonctions utilitaires
  const getStatusLabel = (status: "up" | "down"): string => {
    return status === "up" ? "Opérationnel" : "Indisponible";
  };

  const getStatusStyle = (status: "up" | "down"): CSSProperties => {
    return status === "up" ? healthStyles.statusUp : healthStyles.statusDown;
  };

  const formatResponseTime = (time?: number): string => {
    if (!time) return "N/A";
    return `${time} ms`;
  };

  // Fonction utilitaire pour extraire de façon sécurisée le message d'erreur
  const getErrorMessage = (details: any): string => {
    if (!details) return "Non spécifiée";

    // Si code est disponible au niveau supérieur
    if (details.code) return details.code;

    // Si error est un objet
    if (details.error && typeof details.error === "object") {
      if (details.error.code === "ECONNREFUSED")
        return "Service non disponible (connexion refusée)";
      return (
        details.error.code || details.error.message || "Erreur de connexion"
      );
    }

    // Si error est une chaîne de caractères
    if (details.error && typeof details.error === "string") {
      return details.error;
    }

    return "Non spécifiée";
  };

  return (
    <div style={healthStyles.container as CSSProperties}>
      <div style={healthStyles.header as CSSProperties}>
        <h1 style={healthStyles.title as CSSProperties}>
          État des Services CRM
        </h1>
      </div>

      {error && (
        <div style={healthStyles.errorPanel as CSSProperties}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={healthStyles.statusOverview as CSSProperties}>
        <div style={healthStyles.overviewCard as CSSProperties}>
          <h2>Vue d'ensemble</h2>
          <p>
            {stats.isAllOperational
              ? "✅ Tous les services sont opérationnels"
              : `⚠️ ${stats.downServicesCount} service(s) indisponible(s)`}
          </p>
          <div style={healthStyles.reply as CSSProperties}>
            <p style={healthStyles.lastUpdated as CSSProperties}>
              Dernière vérification: {lastUpdated}
            </p>
            <p style={healthStyles.lastUpdated as CSSProperties}>
              Temps de réponse moyen: {formatResponseTime(stats.responseTime)}
            </p>
          </div>
        </div>
      </div>

      <div style={healthStyles.servicesGrid as CSSProperties}>
        {services.map((service) => (
          <div
            key={service.name}
            style={{
              ...(healthStyles.serviceCard as CSSProperties),
              ...getStatusStyle(service.status),
            }}
          >
            <div style={healthStyles.serviceHeader as CSSProperties}>
              <h3>{service.name}</h3>
              <span
                style={{
                  ...(healthStyles.statusBadge as CSSProperties),
                  ...getStatusStyle(service.status),
                }}
              >
                {getStatusLabel(service.status)}
              </span>
            </div>

            <div style={healthStyles.serviceDetails as CSSProperties}>
              {service.status === "down" && service.details && (
                <div style={healthStyles.errorDetails as CSSProperties}>
                  <p style={{ margin: 0 }}>
                    Erreur: {getErrorMessage(service.details)}
                  </p>
                </div>
              )}
              {service.status === "up" && service.details && (
                <div style={healthStyles.serviceInfo as CSSProperties}>
                  <p style={{ margin: 0 }}>
                    Service: {service.details.service || service.name}
                  </p>
                </div>
              )}
              <div style={healthStyles.reply}>
                <p style={healthStyles.timestamp as CSSProperties}>
                  Dernière vérification:{" "}
                  {new Date(service.lastChecked).toLocaleString()}
                </p>
                <span>{formatResponseTime(service.responseTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && services.length === 0 && (
        <div style={healthStyles.loadingContainer as CSSProperties}>
          <div style={healthStyles.loadingSpinner as CSSProperties}></div>
          <p>Chargement des statuts des services...</p>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
