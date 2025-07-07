"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <div style={dashboardStyles.welcomeCard}>
      <h1 style={dashboardStyles.welcomeTitle}>
        Bienvenue,{" "}
        {user?.firstName ||
          (user?.email ? user.email.split("@")[0] : "utilisateur")}
        !
      </h1>
      <p style={dashboardStyles.welcomeText}>
        Vous êtes maintenant connecté au CRM Crew.
      </p>
    </div>
  );
};

export default Dashboard;
