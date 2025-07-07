// components/team/TeamHeader.tsx
import React from "react";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import { FaArrowLeft, FaEdit, FaTrashAlt, FaSyncAlt } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";

interface TeamHeaderProps {
  teamName: string;
  companyId?: string;
  teamId: string;
  navigateBack: () => void;
  handleRefresh: () => void;
  onDeleteClick: () => void;
  canModifyTeam: boolean; // Nouveau prop pour contrôler l'accès
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  teamName,
  companyId,
  teamId,
  navigateBack,
  handleRefresh,
  onDeleteClick,
  canModifyTeam,
}) => {
  const { user } = useAuth();

  // Fonction pour générer l'URL d'édition
  const getEditUrl = () => {
    return `/dashboard/teams/edit/${teamId}`;
  };

  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.pageTitle}>
          <FaArrowLeft
            style={{ cursor: "pointer", marginRight: "0.75rem" }}
            onClick={navigateBack}
          />
          {teamName}
        </h1>
        <div style={styles.pageSubtitle}>
          Gestion et informations de l'équipe
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <ActionButton onClick={handleRefresh} variant="secondary" size="medium">
          <FaSyncAlt style={{ marginRight: "8px" }} />
          Actualiser
        </ActionButton>

        {/* Boutons de modification et suppression visibles seulement pour admin/manager */}
        {canModifyTeam && (
          <>
            <ActionButton
              onClick={() => (window.location.href = getEditUrl())}
              variant="secondary"
              size="medium"
            >
              <FaEdit style={{ marginRight: "8px" }} />
              Modifier
            </ActionButton>
            <ActionButton
              onClick={onDeleteClick}
              variant="danger"
              size="medium"
            >
              <FaTrashAlt style={{ marginRight: "8px" }} />
              Supprimer
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamHeader;
