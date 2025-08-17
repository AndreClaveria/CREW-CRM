"use client";
import React, { use, useEffect } from "react";
import ActionButton from "@/components/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamAccess } from "@/hooks/useTeamAccess";

interface TeamMembersManagementProps {
  params: Promise<{
    companyId: string;
    teamsId: string;
  }>;
}

const TeamMembersManagement: React.FC<TeamMembersManagementProps> = ({
  params,
}) => {
  // Utilisation de React.use() pour déballer les paramètres
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;
  const teamsId = unwrappedParams.teamsId;

  // Logging pour debugger
  console.log("TeamMembersManagement - Params déballés:", {
    companyId,
    teamsId,
  });

  const { setLoadingWithMessage } = useAuth();

  // Hook pour vérifier les permissions et les routes
  const {
    user,
    isLoading,
    hasValidAccess,
    hasValidParams,
    navigateToTeamsList,
    navigateToDashboard,
  } = useTeamAccess({ companyId, teamId: teamsId });

  // Hook pour la gestion des membres de l'équipe
  const {
    company,
    team,
    availableUsers,
    teamMembers,
    selectedUserId,
    setSelectedUserId,
    error,
    success,
    isLoadingData,
    loadTeamData,
    handleAddMember,
    handleRemoveMember,
  } = useTeamMembers({
    companyId,
    teamId: teamsId,
    setLoadingWithMessage,
  });

  // Charger les données quand le composant est initialisé et que l'utilisateur a les permissions
  useEffect(() => {
    if (hasValidAccess) {
      loadTeamData();
    }
  }, [companyId, teamsId, user]);

  // Gestion des cas de chargement ou d'erreur
  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (!hasValidParams) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>
          Paramètres manquants. Impossible de charger les détails de l’équipe.
        </p>
        <ActionButton
          onClick={navigateToDashboard}
          variant="secondary"
          size="medium"
        >
          Retour au tableau de bord
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
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
            Gestion des membres de l’équipe
          </h1>
          {company && team && (
            <p style={{ color: "#666" }}>
              Entreprise: <strong>{company.name}</strong> | Équipe:{" "}
              <strong>{team.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={navigateToTeamsList}
          style={{
            padding: "10px 16px",
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retour à la liste
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#e6f7e6",
            color: "#2e7d32",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {success}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Ajout de membres */}
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
            Ajouter un membre
          </h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Sélectionner un utilisateur
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  flexGrow: 1,
                }}
              >
                <option value="">Choisir un utilisateur</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {`${user.firstName} ${user.lastName} (${user.email})`}
                  </option>
                ))}
              </select>
              <ActionButton
                onClick={handleAddMember}
                variant="primary"
                size="medium"
                disabled={!selectedUserId}
              >
                Ajouter
              </ActionButton>
            </div>
            {availableUsers.length === 0 && (
              <p style={{ marginTop: "8px", color: "#666" }}>
                Tous les utilisateurs sont déjà membres de cette équipe.
              </p>
            )}
          </div>
        </div>

        {/* Liste des membres actuels */}
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>
            Membres actuels
          </h2>

          {isLoadingData ? (
            <p>Chargement des membres...</p>
          ) : teamMembers.length === 0 ? (
            <p>Aucun membre dans cette équipe.</p>
          ) : (
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {teamMembers.map((member) => (
                <li
                  key={member._id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>
                      {member.firstName} {member.lastName}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {member.email}
                    </div>
                    {team &&
                      (team.leader === member._id ||
                        (typeof team.leader === "object" &&
                          team.leader?._id === member._id)) && (
                        <span
                          style={{
                            display: "inline-block",
                            background: "#e3f2fd",
                            color: "#0277bd",
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            marginTop: "4px",
                          }}
                        >
                          Chef d’équipe
                        </span>
                      )}
                  </div>
                  <ActionButton
                    onClick={() => handleRemoveMember(member._id)}
                    variant="warning"
                    size="small"
                  >
                    Retirer
                  </ActionButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersManagement;
