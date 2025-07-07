import React from "react";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";
import { FaBuilding, FaUsers, FaUser, FaChartLine } from "react-icons/fa";

interface ClientConnectionsCardProps {
  company: any;
  team: any;
  assignedUser: any;
  opportunities: any[];
  navigateToCompany: () => void;
  navigateToTeam: () => void;
  navigateToAssignedUser: () => void;
  formatMoney: (amount: number) => string;
}

const ClientConnectionsCard: React.FC<ClientConnectionsCardProps> = ({
  company,
  team,
  assignedUser,
  opportunities,
  navigateToCompany,
  navigateToTeam,
  navigateToAssignedUser,
  formatMoney,
}) => {
  // Calculer la valeur totale des opportunités actives
  const calculateTotalOpportunityValue = () => {
    if (!opportunities.length) return 0;

    return opportunities
      .filter((opp) => opp.status !== "lost")
      .reduce((sum, opp) => sum + (opp.value || 0), 0);
  };

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

      {/* Lien vers l'équipe */}
      {team && (
        <div style={styles.linkItem} onClick={navigateToTeam}>
          <FaUsers style={styles.linkIcon} />
          <div style={styles.linkInfo}>
            <div style={styles.linkTitle}>Équipe assignée</div>
            <div style={styles.linkSubtitle}>{team.name}</div>
          </div>
        </div>
      )}

      {/* Lien vers l'utilisateur assigné */}
      {assignedUser && (
        <div style={styles.linkItem} onClick={navigateToAssignedUser}>
          <FaUser style={styles.linkIcon} />
          <div style={styles.linkInfo}>
            <div style={styles.linkTitle}>Responsable</div>
            <div style={styles.linkSubtitle}>
              {assignedUser.firstName} {assignedUser.lastName}
            </div>
          </div>
        </div>
      )}

      {/* Aperçu de la valeur totale des opportunités */}
      {opportunities.length > 0 && (
        <div style={{ ...styles.linkItem, cursor: "default" }}>
          <FaChartLine style={{ ...styles.linkIcon, color: "#4caf50" }} />
          <div style={styles.linkInfo}>
            <div style={styles.linkTitle}>Valeur des opportunités</div>
            <div
              style={{
                ...styles.linkSubtitle,
                fontWeight: "600",
                color: "#4caf50",
              }}
            >
              {formatMoney(calculateTotalOpportunityValue())}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientConnectionsCard;
