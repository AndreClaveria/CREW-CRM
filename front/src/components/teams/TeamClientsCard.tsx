// components/team/TeamClientsCard.tsx
import React from "react";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import {
  FaBriefcase,
  FaPlus,
  FaExclamationTriangle,
  FaBuilding,
} from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface TeamClientsCardProps {
  clients: any[];
  navigateToClient: (clientId: string) => void;
  navigateToClientsManagement: () => void;
  canManageTeam: boolean; // Nouveau prop pour contrôler l'accès
}

const TeamClientsCard: React.FC<TeamClientsCardProps> = ({
  clients,
  navigateToClient,
  navigateToClientsManagement,
  canManageTeam,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaBriefcase style={styles.sectionIcon} />
          Clients
        </h2>
        {/* Bouton visible seulement si l'utilisateur peut gérer l'équipe */}
        {canManageTeam && (
          <ActionButton
            onClick={navigateToClientsManagement}
            variant="primary"
            size="small"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Ajouter un client
          </ActionButton>
        )}
      </div>

      {clients.length > 0 ? (
        <div style={styles.clientsContainer}>
          {clients.map((client) => (
            <div
              key={client._id}
              style={styles.clientCard}
              onClick={() => navigateToClient(client._id)}
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  style={styles.clientLogo}
                />
              ) : (
                <div style={styles.clientLogoPlaceholder}>
                  <FaBuilding />
                </div>
              )}
              <div style={styles.clientInfo}>
                <div style={styles.clientName}>{client.name}</div>
                {client.sector && (
                  <div style={styles.clientSector}>{client.sector}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            Aucun client n'a été assigné à cette équipe.
          </div>
          {/* Bouton visible seulement si l'utilisateur peut gérer l'équipe */}
          {canManageTeam && (
            <ActionButton
              onClick={navigateToClientsManagement}
              variant="primary"
              size="medium"
            >
              <FaPlus style={{ marginRight: "8px" }} />
              Ajouter un client
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamClientsCard;
