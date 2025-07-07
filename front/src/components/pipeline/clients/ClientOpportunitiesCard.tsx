import React from "react";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";
import { FaHandsHelping, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface ClientOpportunitiesCardProps {
  opportunities: any[];
  navigateToOpportunity: (opportunityId: string) => void;
  navigateToOpportunitiesManagement: () => void;
  formatMoney: (amount: number) => string;
}

const ClientOpportunitiesCard: React.FC<ClientOpportunitiesCardProps> = ({
  opportunities,
  navigateToOpportunity,
  navigateToOpportunitiesManagement,
  formatMoney,
}) => {
  // Obtenir la couleur en fonction du statut de l'opportunité
  const getStatusColor = (status: string) => {
    switch (status) {
      case "lead":
        return "#607d8b"; // Bleu-gris
      case "qualified":
        return "#2196f3"; // Bleu
      case "proposition":
        return "#ff9800"; // Orange
      case "negotiation":
        return "#9c27b0"; // Violet
      case "won":
        return "#4caf50"; // Vert
      case "lost":
        return "#f44336"; // Rouge
      default:
        return "#607d8b"; // Bleu-gris par défaut
    }
  };

  // Traduire le statut en français
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      lead: "Prospect",
      qualified: "Qualifié",
      proposition: "Proposition",
      negotiation: "Négociation",
      won: "Gagné",
      lost: "Perdu",
    };
    return statusMap[status] || status;
  };

  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaHandsHelping style={styles.sectionIcon} />
          Opportunités
        </h2>
        <ActionButton
          onClick={navigateToOpportunitiesManagement}
          variant="primary"
          size="small"
        >
          <FaPlus style={{ marginRight: "8px" }} />
          Ajouter une opportunité
        </ActionButton>
      </div>

      {opportunities.length > 0 ? (
        <div style={styles.opportunitiesContainer}>
          {opportunities.map((opportunity) => (
            <div
              key={opportunity._id}
              style={styles.opportunityCard}
              onClick={() => navigateToOpportunity(opportunity._id)}
            >
              <div style={styles.opportunityHeader}>
                <div style={styles.opportunityTitle}>{opportunity.title}</div>
                <div style={styles.opportunityValue}>
                  {formatMoney(opportunity.value)}
                </div>
              </div>
              <div style={styles.opportunityDetails}>
                <div
                  style={{
                    ...styles.opportunityStatus,
                    backgroundColor: getStatusColor(opportunity.status),
                  }}
                >
                  {translateStatus(opportunity.status)}
                </div>
                <div style={styles.opportunityProbability}>
                  Probabilité: {opportunity.probability}%
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            Aucune opportunité n'a été ajoutée pour ce client.
          </div>
          <ActionButton
            onClick={navigateToOpportunitiesManagement}
            variant="primary"
            size="medium"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Ajouter une opportunité
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default ClientOpportunitiesCard;
