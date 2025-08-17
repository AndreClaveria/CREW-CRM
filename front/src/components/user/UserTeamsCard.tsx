import React from "react";
import { userDetailsStyles as styles } from "@/styles/pages/dashboard/admin/userDetailsStyles";
import { FaUsers, FaCrown, FaExclamationTriangle } from "react-icons/fa";

interface UserTeamsCardProps {
  userTeams: any[];
  isTeamLeader: (team: any) => boolean;
  countTeamMembers: (team: any) => number;
  navigateToTeam: (teamId: string, companyId?: string) => void;
  companyId?: string; // Ajout de cette prop
}

const UserTeamsCard: React.FC<UserTeamsCardProps> = ({
  userTeams,
  isTeamLeader,
  countTeamMembers,
  navigateToTeam,
  companyId,
}) => {
  return (
    <>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaUsers style={styles.sectionIcon} />
          Équipes
        </h2>
      </div>
      <div style={styles.card}>
        {userTeams.length > 0 ? (
          <div style={styles.teamsList}>
            {userTeams.map((team) => (
              <div
                key={team._id}
                style={styles.teamItem}
                onClick={() => navigateToTeam(team._id, team.company)}
              >
                <FaUsers style={styles.teamIcon} />
                <div style={styles.teamInfo}>
                  <div style={styles.teamName}>{team.name}</div>
                  <div style={styles.teamMemberCount}>
                    {countTeamMembers(team)} membre(s)
                  </div>
                </div>
                {/* Vérifie si l'utilisateur est le leader de l'équipe */}
                {isTeamLeader(team) && (
                  <div style={styles.leaderBadge}>
                    <FaCrown style={{ marginRight: "5px" }} />
                    Leader
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noDataCard}>
            <FaExclamationTriangle style={styles.noDataIcon} />
            <div style={styles.noDataText}>
              Cet utilisateur n’appartient à aucune équipe.
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserTeamsCard;
