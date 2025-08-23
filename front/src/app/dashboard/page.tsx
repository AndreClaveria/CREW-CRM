"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";
import UserDashboard from "@/components/dashboard/UserDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import { determineUserRole } from "@/components/dashboard/dashboardConfig";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const userRole = determineUserRole(user);
  const isManagerOrAdmin = userRole === "manager";

  console.log("🔍 Dashboard - User:", user);
  console.log("🔍 Dashboard - UserRole déterminé:", userRole);
  console.log("🔍 Dashboard - isManagerOrAdmin:", isManagerOrAdmin);

  return (
    <div style={dashboardStyles.container}>
      {/* En-tête de bienvenue */}
      <div style={dashboardStyles.welcomeCard}>
        <h1 style={dashboardStyles.welcomeTitle}>
          Bienvenue,{" "}
          {user?.firstName ||
            (user?.email ? user.email.split("@")[0] : "utilisateur")}
          !
        </h1>
        <p style={dashboardStyles.welcomeText}>
          {isManagerOrAdmin
            ? "Tableau de bord de gestion - Suivez les performances de votre équipe et de votre pipeline commercial."
            : "Tableau de bord personnel"}
        </p>
        <div style={dashboardStyles.roleIndicator}>
          <span style={dashboardStyles.roleBadge}>
            {isManagerOrAdmin ? "👑 Manager/Admin" : "👤 Utilisateur"}
          </span>
        </div>
      </div>

      {/* Affichage du dashboard approprié */}
      {isManagerOrAdmin ? <ManagerDashboard /> : <UserDashboard />}
    </div>
  );
};

export default Dashboard;
