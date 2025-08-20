import React, { useState, useEffect } from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";
import {
  UserDashboard,
  ManagerDashboard,
  QuickStats,
  SimpleChart,
} from "./index";
import { getDefaultData } from "./dashboardConfig";

const DashboardExample: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<"user" | "manager">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [customData, setCustomData] = useState(getDefaultData("user"));

  // Simulation d'un chargement de données
  useEffect(() => {
    setIsLoading(true);
    // Simuler un délai de chargement
    const timer = setTimeout(() => {
      setCustomData(getDefaultData(currentRole));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentRole]);

  const handleRoleChange = (role: "user" | "manager") => {
    setCurrentRole(role);
  };

  if (isLoading) {
    return (
      <div style={dashboardStyles.loadingContainer}>
        <div>Chargement du dashboard...</div>
      </div>
    );
  }

  return (
    <div style={dashboardStyles.container}>
      {/* En-tête avec sélecteur de rôle */}
      <div style={dashboardStyles.welcomeCard}>
        <h1 style={dashboardStyles.welcomeTitle}>
          Exemple d'Utilisation Avancée
        </h1>
        <p style={dashboardStyles.welcomeText}>
          Ce composant démontre comment utiliser les composants dashboard de
          manière dynamique
        </p>

        <div style={dashboardStyles.roleSelector}>
          <button
            style={{
              ...dashboardStyles.roleButton,
              backgroundColor:
                currentRole === "user"
                  ? "var(--color-main)"
                  : "var(--color-grey-300)",
              color:
                currentRole === "user"
                  ? "var(--color-white)"
                  : "var(--color-text)",
            }}
            onClick={() => handleRoleChange("user")}
          >
            👤 Utilisateur
          </button>
          <button
            style={{
              ...dashboardStyles.roleButton,
              backgroundColor:
                currentRole === "manager"
                  ? "var(--color-main)"
                  : "var(--color-grey-300)",
              color:
                currentRole === "manager"
                  ? "var(--color-white)"
                  : "var(--color-text)",
            }}
            onClick={() => handleRoleChange("manager")}
          >
            👑 Manager
          </button>
        </div>
      </div>

      {/* Affichage conditionnel du dashboard */}
      {currentRole === "user" ? <UserDashboard /> : <ManagerDashboard />}

      {/* Section de démonstration des composants individuels */}
      <div style={dashboardStyles.welcomeCard}>
        <h2 style={dashboardStyles.sectionTitle}>Composants Individuels</h2>
        <p style={dashboardStyles.welcomeText}>
          Vous pouvez également utiliser les composants individuellement :
        </p>

        {/* Exemple de QuickStats personnalisé */}
        <div style={{ marginBottom: "var(--spacing-big)" }}>
          <h3>QuickStats Personnalisé</h3>
          <QuickStats
            stats={[
              { label: "Ventes", value: "25k€", icon: "💰", color: "#10b981" },
              { label: "Clients", value: 42, icon: "👥", color: "#3b82f6" },
              { label: "Projets", value: 18, icon: "🚀", color: "#f59e0b" },
            ]}
          />
        </div>

        {/* Exemple de SimpleChart personnalisé */}
        <div>
          <SimpleChart
            title="Objectifs Trimestriels"
            data={[
              { label: "Q1", value: 85, maxValue: 100, color: "#3b82f6" },
              { label: "Q2", value: 92, maxValue: 100, color: "#10b981" },
              { label: "Q3", value: 78, maxValue: 100, color: "#f59e0b" },
              { label: "Q4", value: 95, maxValue: 100, color: "#ef4444" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardExample;
