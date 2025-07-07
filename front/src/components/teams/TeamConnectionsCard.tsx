// components/team/TeamConnectionsCard.tsx
import React from "react";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import { FaBuilding, FaCrown, FaUsersCog, FaBriefcase } from "react-icons/fa";
import { Company } from "@/services/company.service";
import { User } from "@/services/user.service";

interface TeamConnectionsCardProps {
  company: Company | null;
  teamLeader: User | null;
  navigateToCompany: () => void;
  navigateToMember: (memberId: string) => void;
  navigateToMembersManagement: () => void;
  navigateToClientsManagement: () => void;
  canManageTeam: boolean; // Nouveau prop pour contrôler l'accès
}

const TeamConnectionsCard: React.FC<TeamConnectionsCardProps> = ({
  company,
  teamLeader,
  navigateToCompany,
  navigateToMember,
  navigateToMembersManagement,
  navigateToClientsManagement,
  canManageTeam,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaBuilding style={styles.sectionIcon} />
          Connexions
        </h2>
      </div>

      {/* Lien vers l'entreprise */}
      {company && (
        <div style={styles.linkItem} onClick={navigateToCompany}>
          <FaBuilding style={styles.linkIcon} />
          <div style={styles.linkInfo}>
            <div style={styles.linkTitle}>Entreprise</div>
            <div style={styles.linkSubtitle}>{company.name}</div>
          </div>
        </div>
      )}

      {/* Lien vers le responsable d'équipe */}
      {teamLeader && (
        <div
          style={styles.linkItem}
          onClick={() => navigateToMember(teamLeader._id)}
        >
          <FaCrown style={{ ...styles.linkIcon, color: "#ffc107" }} />
          <div style={styles.linkInfo}>
            <div style={styles.linkTitle}>Responsable d'équipe</div>
            <div style={styles.linkSubtitle}>
              {teamLeader.firstName} {teamLeader.lastName}
            </div>
          </div>
        </div>
      )}

      {/* Lien vers la gestion des membres - visible seulement si l'utilisateur peut gérer l'équipe */}
      {canManageTeam && (
        <div style={styles.linkItem} onClick={navigateToMembersManagement}>
          <FaUsersCog style={styles.linkIcon} />
          <div style={styles.linkInfo}>
            <div style={styles.linkTitle}>Gérer les membres</div>
            <div style={styles.linkSubtitle}>
              Ajouter ou supprimer des membres
            </div>
          </div>
        </div>
      )}

      {/* Lien vers la gestion des clients - visible seulement si l'utilisateur peut gérer l'équipe */}
      {canManageTeam && (
        <div style={styles.linkItem} onClick={navigateToClientsManagement}>
          <FaBriefcase style={styles.linkIcon} />
          <div style={styles.linkInfo}>
            <div style={styles.linkTitle}>Gérer les clients</div>
            <div style={styles.linkSubtitle}>
              Assigner ou retirer des clients
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamConnectionsCard;
