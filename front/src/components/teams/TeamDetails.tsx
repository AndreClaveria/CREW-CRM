"use client";

import React, { useState, use } from "react";
import { useTeamDetails } from "@/hooks/useTeamDetails";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import TeamHeader from "./TeamHeader";
import TeamInfoCard from "./TeamInfoCard";
import TeamConnectionsCard from "./TeamConnectionsCard";
import TeamMembersCard from "./TeamMembersCard";
import TeamClientsCard from "./TeamClientsCard";
import DeleteTeamModal from "./DeleteTeamModal";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import { FaSyncAlt, FaArrowLeft } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";
import { useNavigation } from "@/utils/navigateBack";
interface TeamDetailsProps {
  params: Promise<{
    teamId: string;
  }>;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const { teamId } = unwrappedParams;

  const { user, isLoading: isAuthLoading } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    team,
    company,
    members,
    clients,
    isLoading,
    error,
    updateTeamDetails,
    deleteTeamAndNavigate,
    navigateToCompany,
    navigateToMember,
    navigateToClient,
    navigateToMembersManagement,
    navigateToClientsManagement,
  } = useTeamDetails(teamId);

  const { navigateBack } = useNavigation();
  // Vérification de l'accès
  const hasAccess = useRoleCheck({
    isLoading: isAuthLoading,
    user,
    requiredRole: [], // Plus besoin de vérifier les rôles
    redirectPath: "/dashboard",
  });

  // Fonction pour rafraîchir la page
  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  // Vérifier si l'utilisateur actuel est le leader de l'équipe
  const isTeamLeader = () => {
    if (!team || !user) return false;

    // Si l'utilisateur est le leader de l'équipe
    if (typeof team.leader === "string") {
      return team.leader === user._id;
    } else if (team.leader && "_id" in team.leader) {
      return team.leader._id === user._id;
    }

    return false;
  };

  // Vérifier si l'utilisateur a les droits pour gérer l'équipe (leader)
  const canManageTeam = () => {
    if (!user) return false;
    return isTeamLeader();
  };

  // Vérifier si l'utilisateur peut modifier ou supprimer l'équipe
  const canModifyTeam = () => {
    if (!user) return false;
    return isTeamLeader();
  };

  if (isAuthLoading || !user || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <FaSyncAlt style={{ animation: "spin 1s linear infinite" }} />
        </div>
        <p>Chargement des informations de l'équipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton onClick={handleRefresh} variant="secondary" size="medium">
          <FaSyncAlt style={{ marginRight: "8px" }} />
          Réessayer
        </ActionButton>
      </div>
    );
  }

  if (!team) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Équipe non trouvée</h2>
        <ActionButton onClick={navigateBack} variant="secondary" size="medium">
          <FaArrowLeft style={{ marginRight: "8px" }} />
          Retour à la liste des équipes
        </ActionButton>
      </div>
    );
  }

  // Identifier le leader de l'équipe
  const getTeamLeader = () => {
    if (!team.leader) return null;

    if (typeof team.leader === "string") {
      // Si le leader est juste un ID, chercher dans les membres
      const leaderMember = members.find((member) => member._id === team.leader);
      return leaderMember || null;
    } else {
      // Si le leader est déjà un objet User
      return team.leader;
    }
  };

  const teamLeader = getTeamLeader();
  const teamMembers = members || [];
  const teamClients = clients || [];

  // Gérer la suppression de l'équipe
  const handleDeleteTeam = async () => {
    const success = await deleteTeamAndNavigate();
    if (!success) {
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* En-tête de la page */}
      <TeamHeader
        teamName={team.name}
        companyId={company?._id}
        teamId={teamId}
        navigateBack={navigateBack}
        handleRefresh={handleRefresh}
        onDeleteClick={() => setShowDeleteModal(true)}
        canModifyTeam={canModifyTeam()}
      />

      <div style={styles.contentGrid}>
        {/* Panneau gauche - Informations de l'équipe et connexions */}
        <div style={styles.leftPanel}>
          {/* Carte d'information de l'équipe */}
          <TeamInfoCard
            team={team}
            company={company}
            teamLeader={teamLeader}
            teamMembers={teamMembers}
            teamClients={teamClients}
            navigateToCompany={navigateToCompany}
            navigateToMember={navigateToMember}
          />

          {/* Carte des liens/connexions */}
          <TeamConnectionsCard
            company={company}
            teamLeader={teamLeader}
            navigateToCompany={navigateToCompany}
            navigateToMember={navigateToMember}
            navigateToMembersManagement={navigateToMembersManagement}
            navigateToClientsManagement={navigateToClientsManagement}
            canManageTeam={canManageTeam()}
          />
        </div>

        {/* Panneau droit - Membres et clients */}
        <div style={styles.rightPanel}>
          {/* Carte des membres */}
          <TeamMembersCard
            members={teamMembers}
            teamLeaderId={teamLeader?._id}
            navigateToMember={navigateToMember}
            navigateToMembersManagement={navigateToMembersManagement}
            canManageTeam={canManageTeam()}
          />

          {/* Carte des clients */}
          <TeamClientsCard
            clients={teamClients}
            navigateToClient={navigateToClient}
            navigateToClientsManagement={navigateToClientsManagement}
            canManageTeam={canManageTeam()}
          />
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteTeamModal
        isOpen={showDeleteModal}
        teamName={team.name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTeam}
      />

      {/* Overlay de chargement pour les actions */}
      <LoadingOverlay
        isVisible={refreshing}
        message="Actualisation des données..."
      />
    </div>
  );
};

export default TeamDetails;
