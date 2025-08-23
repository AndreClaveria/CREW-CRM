import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";

interface DashboardErrorProps {
  error: string;
  onRetry?: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => {
  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.welcomeCard}>
        <div style={{ textAlign: "center", padding: "var(--spacing-big)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={dashboardStyles.sectionTitle}>Erreur de chargement</h2>
          <p style={dashboardStyles.welcomeText}>
            {error || "Impossible de charger les données du dashboard"}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                ...dashboardStyles.roleButton,
                backgroundColor: "var(--color-main)",
                color: "var(--color-white)",
                marginTop: "var(--spacing-normal)",
              }}
            >
              🔄 Réessayer
            </button>
          )}

          <div
            style={{
              marginTop: "var(--spacing-big)",
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-50)",
              borderRadius: "var(--border-small-radius)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-grey-600)",
            }}
          >
            <strong>Conseils de dépannage :</strong>
            <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
              <li>Vérifiez votre connexion internet</li>
              <li>Réessayez dans quelques instants</li>
              <li>Contactez l&apos;administrateur si le problème persiste</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardError;
