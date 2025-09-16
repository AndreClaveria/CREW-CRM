"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useCompany } from "@/hooks/useCompany";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import CompanyTable from "@/components/company/CompanyTable";
import ActionButton from "@/components/common/ActionButton";

const CompanyList: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();

  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["admin"], // Assumant que seuls les admins peuvent voir toutes les entreprises
    redirectPath: "/dashboard",
  });

  const {
    dashboardData,
    loading: isLoadingDashboard,
    error: dashboardError,
  } = useUserDashboard();

  const {
    companies,
    isLoading: isLoadingCompanies,
    error: companiesError,
    updateCompanyData,
  } = useCompany();

  const handleStatusChange = (companyId: string, newStatus: boolean) => {
    updateCompanyData(companyId, { isActive: newStatus });
  };

  if (isLoadingAuth || isLoadingDashboard || !hasAccess) {
    return null;
  }

  const error = dashboardError || companiesError;
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "50px",
              marginBottom: "8px",
            }}
          >
            Entreprises
          </h1>
          <p style={{ color: "#666" }}>Gestion des entreprises du système</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <ActionButton
            onClick={() => router.push("/dashboard")}
            variant="secondary"
            size="medium"
            customTextColor="#A3B18A"
            customBorderColor="#A3B18A"
          >
            Importer
          </ActionButton>
          <ActionButton
            onClick={() => router.push("/dashboard/pipeline/company/add")}
            variant="primary"
            size="large"
            customColor="#A3B18A"
          >
            Ajouter une entreprise
          </ActionButton>
        </div>
      </div>

      <CompanyTable
        companies={companies}
        isLoading={isLoadingCompanies}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default CompanyList;
