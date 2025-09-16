"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useTeam } from "@/hooks/useTeam";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import TeamTable from "@/components/teams/TeamTable";
import ActionButton from "@/components/common/ActionButton";

const TeamList: React.FC = () => {
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
    teams,
    isLoading: isLoadingTeams,
    error: teamsError,
    updateTeamData,
  } = useTeam({ companyId: dashboardData?.company?._id });

  const handleStatusChange = (teamId: string, newStatus: boolean) => {
    updateTeamData(teamId, { isActive: newStatus });
  };

  if (isLoadingAuth || isLoadingDashboard || !hasAccess) {
    return null;
  }

  const error = dashboardError || teamsError;
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
            Équipes
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
              router.push(`/dashboard/pipeline/team/add/${company._id}`)
            }
            variant="primary"
            size="large"
            customColor="#A3B18A"
          >
            Ajouter une équipe
          </ActionButton>
        </div>
      </div>

      <TeamTable
        teams={teams}
        companyId={company._id}
        isLoading={isLoadingTeams}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default TeamList;
