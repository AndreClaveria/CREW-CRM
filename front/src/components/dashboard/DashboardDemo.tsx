import React, { useState } from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";
import UserDashboard from "./UserDashboard";
import ManagerDashboard from "./ManagerDashboard";

const DashboardDemo: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<"user" | "manager">("user");

  return (
    <div style={dashboardStyles.container}>
      {/* Sélecteur de rôle pour la démonstration */}
      <div style={dashboardStyles.welcomeCard}>
        <h1 style={dashboardStyles.welcomeTitle}>
          Démonstration des Dashboards
        </h1>
        <p style={dashboardStyles.welcomeText}>
          Sélectionnez un rôle pour voir le tableau de bord correspondant
        </p>

        <div style={dashboardStyles.roleSelector}>
          <button
            style={{
              ...dashboardStyles.roleButton,
              backgroundColor:
                selectedRole === "user"
                  ? "var(--color-main)"
                  : "var(--color-grey-300)",
              color:
                selectedRole === "user"
                  ? "var(--color-white)"
                  : "var(--color-text)",
            }}
            onClick={() => setSelectedRole("user")}
          >
            👤 Dashboard Utilisateur
          </button>
          <button
            style={{
              ...dashboardStyles.roleButton,
              backgroundColor:
                selectedRole === "manager"
                  ? "var(--color-main)"
                  : "var(--color-grey-300)",
              color:
                selectedRole === "manager"
                  ? "var(--color-white)"
                  : "var(--color-text)",
            }}
            onClick={() => setSelectedRole("manager")}
          >
            👑 Dashboard Manager
          </button>
        </div>
      </div>

      {/* Affichage du dashboard sélectionné */}
      {selectedRole === "user" ? <UserDashboard /> : <ManagerDashboard />}
    </div>
  );
};

export default DashboardDemo;
