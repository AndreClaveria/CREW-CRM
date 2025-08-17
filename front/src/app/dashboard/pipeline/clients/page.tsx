"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useClient } from "@/hooks/useClient";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import ClientTable from "@/components/pipeline/clients/ClientTable";
import ActionButton from "@/components/common/ActionButton";

const ClientList: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();

  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["user"],
    redirectPath: "/dashboard",
  });

  const {
    dashboardData,
    loading: isLoadingDashboard,
    error: dashboardError,
  } = useUserDashboard();

  const {
    clients,
    isLoading: isLoadingClients,
    error: clientsError,
    updateClientData,
  } = useClient({ companyId: dashboardData?.company?._id });

  const handleStatusChange = (clientId: string, newStatus: boolean) => {
    updateClientData(clientId, { isActive: newStatus });
  };

  if (isLoadingAuth || isLoadingDashboard || !hasAccess) {
    return null;
  }

  const error = dashboardError || clientsError;
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

  if (!dashboardData?.company) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Information</h2>
        <p>
          Vous n&apos;avez pas encore d&apos;entreprise associée à votre compte.
        </p>
        <ActionButton
          onClick={() => router.push("/dashboard")}
          variant="secondary"
          size="medium"
        >
          Retour au tableau de bord
        </ActionButton>
      </div>
    );
  }

  const company = dashboardData.company;

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
            Clients
          </h1>
          <p style={{ color: "#666" }}>
            Entreprise: <strong>{company.name}</strong>
          </p>
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
            onClick={() =>
              router.push(`/dashboard/pipeline/clients/add/${company._id}`)
            }
            variant="primary"
            size="large"
            customColor="#A3B18A"
          >
            Ajouter un client
          </ActionButton>
        </div>
      </div>

      <ClientTable
        clients={clients}
        companyId={company._id}
        isLoading={isLoadingClients}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ClientList;
