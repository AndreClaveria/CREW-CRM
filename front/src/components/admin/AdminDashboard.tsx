"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import ActionButton from "@/components/common/ActionButton";
import { adminDashboardStyles as styles } from "@/styles/pages/dashboard/admin/adminDashboardStyles";
import AdminHeader from "./AdminHeader";
import StatisticsCards from "./StatisticsCards";
import UsersSection from "./UsersSection";
import CompaniesSection from "./CompaniesSection";

const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const {
    users,
    companies,
    isLoadingData,
    error,
    navigateToUserDetails,
    navigateToCompanyDetails,
    navigateToUserManagement,
    navigateToCompanyManagement,
    navigateToSystemHealth,
  } = useAdminDashboard();

  // Vérification de l'accès
  const hasAccess = useRoleCheck({
    isLoading,
    user,
    requiredRole: [], // Plus besoin de vérifier les rôles
    redirectPath: "/dashboard",
  });

  if (isLoading || !user || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  // Calcul des statistiques
  const activeUsers = users.filter((user) => user.active).length;
  const activeCompanies = companies.filter(
    (company) => company.isActive
  ).length;

  return (
    <div style={styles.container}>
      <AdminHeader navigateToSystemHealth={navigateToSystemHealth} />

      <StatisticsCards
        totalUsers={users.length}
        activeUsers={activeUsers}
        totalCompanies={companies.length}
        activeCompanies={activeCompanies}
      />

      <div style={styles.contentGrid}>
        <UsersSection
          users={users}
          navigateToUserDetails={navigateToUserDetails}
          navigateToUserManagement={navigateToUserManagement}
        />

        <CompaniesSection
          companies={companies}
          navigateToCompanyDetails={navigateToCompanyDetails}
          navigateToCompanyManagement={navigateToCompanyManagement}
        />
      </div>

      <div style={styles.healthCheckContainer}>
        <ActionButton
          onClick={navigateToSystemHealth}
          variant="primary"
          size="large"
        >
          <span
            role="img"
            aria-label="heartbeat"
            style={{ marginRight: "10px" }}
          >
            💓
          </span>
          Consulter l'état du système
        </ActionButton>
      </div>
    </div>
  );
};

export default AdminDashboard;
