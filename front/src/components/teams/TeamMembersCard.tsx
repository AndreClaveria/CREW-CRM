// components/team/TeamMembersCard.tsx
import React from "react";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import {
  FaUserTie,
  FaPlus,
  FaExclamationTriangle,
  FaCrown,
  FaEnvelope,
} from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";
import { User } from "@/services/user.service";

interface TeamMembersCardProps {
  members: User[];
  teamLeaderId?: string;
  navigateToMember: (memberId: string) => void;
  navigateToMembersManagement: () => void;
  canManageTeam: boolean;
}

const TeamMembersCard: React.FC<TeamMembersCardProps> = ({
  members,
  teamLeaderId,
  navigateToMember,
  navigateToMembersManagement,
  canManageTeam,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaUserTie style={styles.sectionIcon} />
          Membres
        </h2>
        {canManageTeam && (
          <ActionButton
            onClick={navigateToMembersManagement}
            variant="primary"
            size="small"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Ajouter un membre
          </ActionButton>
        )}
      </div>

      {members.length > 0 ? (
        <div style={styles.membersContainer}>
          {members.map((member) => (
            <div
              key={member._id}
              style={styles.memberCard}
              onClick={() => navigateToMember(member._id)}
            >
              <div style={styles.memberAvatar}>
                {member.firstName?.charAt(0) || ""}
                {member.lastName?.charAt(0) || ""}
              </div>
              <div style={styles.memberInfo}>
                <div style={styles.memberName}>
                  {member.firstName} {member.lastName}
                  {teamLeaderId && member._id === teamLeaderId && (
                    <FaCrown
                      style={{
                        marginLeft: "0.5rem",
                        color: "#ffc107",
                        fontSize: "0.875rem",
                      }}
                      title="Responsable d'équipe"
                    />
                  )}
                </div>
                {member.email && (
                  <div style={styles.memberEmail}>
                    <FaEnvelope style={styles.memberEmailIcon} />
                    {member.email}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            Aucun membre n'a été ajouté à cette équipe.
          </div>
          {canManageTeam && (
            <ActionButton
              onClick={navigateToMembersManagement}
              variant="primary"
              size="medium"
            >
              <FaPlus style={{ marginRight: "8px" }} />
              Ajouter un membre
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMembersCard;
