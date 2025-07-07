import React from "react";
import { companyDetailsStyles as styles } from "@/styles/pages/dashboard/admin/companyDetailStyles";
import {
  FaUsers,
  FaCog,
  FaEllipsisH,
  FaExclamationTriangle,
  FaPlus,
} from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface CompanyTeamsCardProps {
  teams: any[];
  navigateToTeam: (teamId: string) => void;
  navigateToTeamsManagement: () => void;
}

const CompanyTeamsCard: React.FC<CompanyTeamsCardProps> = ({
  teams,
  navigateToTeam,
  navigateToTeamsManagement,
}) => {
  // Compter les membres d'une équipe
  const countTeamMembers = (team: any) => {
    if (!team.members || !Array.isArray(team.members)) {
      return 0;
    }
    return team.members.length;
  };

  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaUsers style={styles.sectionIcon} />
          Équipes
        </h2>
        <ActionButton
          onClick={navigateToTeamsManagement}
          variant="primary"
          size="small"
        >
          <FaCog style={{ marginRight: "8px" }} />
          Gérer les équipes
        </ActionButton>
      </div>

      {teams.length > 0 ? (
        <div style={styles.teamsContainer}>
          {teams.slice(0, 3).map((team) => (
            <div
              key={team._id}
              style={styles.teamItem}
              onClick={() => navigateToTeam(team._id)}
            >
              <FaUsers style={styles.teamIcon} />
              <div style={styles.teamInfo}>
                <h4 style={styles.teamName}>{team.name}</h4>
                <div style={styles.teamMemberCount}>
                  {countTeamMembers(team)} membre(s)
                </div>
              </div>
            </div>
          ))}

          {teams.length > 3 && (
            <ActionButton
              onClick={navigateToTeamsManagement}
              variant="secondary"
              size="medium"
            >
              <FaEllipsisH style={{ marginRight: "8px" }} />
              Voir toutes les équipes ({teams.length})
            </ActionButton>
          )}
        </div>
      ) : (
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            Aucune équipe n'a été créée pour cette entreprise.
          </div>
          <ActionButton
            onClick={navigateToTeamsManagement}
            variant="primary"
            size="medium"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Créer une équipe
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default CompanyTeamsCard;
