import React from "react";
import { useRouter } from "next/navigation";
import { Opportunity } from "@/services/opportunity.service";
import { formatCurrency } from "@/utils/formatters";
import ActionButton from "@/components/common/ActionButton";
import {
  opportunityBoardStyles,
  statusColumns,
} from "@/styles/components/opportunity/opportunityBoardStyles";
import { FaTrashAlt } from "react-icons/fa";

interface OpportunityBoardProps {
  opportunities: Opportunity[];
  clientId?: string;
  companyId?: string;
  isLoading: boolean;
  onStatusChange: (opportunityId: string, newStatus: string) => void;
  viewMode: "kanban" | "list";
  onDeleteClick?: (opportunity: Opportunity) => void;
}

const OpportunityBoard: React.FC<OpportunityBoardProps> = ({
  opportunities,
  clientId,
  isLoading,
  onStatusChange,
  viewMode,
  onDeleteClick,
}) => {
  const router = useRouter();
  const styles = opportunityBoardStyles;

  const getOpportunityEditUrl = (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o._id === opportunityId);
    if (!opportunity) {
      console.error(`Opportunité avec l'ID ${opportunityId} non trouvée.`);
      return "#";
    }

    const targetClientId = clientId || opportunity.client;

    if (!targetClientId) {
      console.error(
        `Impossible de déterminer le client pour l'opportunité ${opportunityId}.`
      );
      return "#";
    }

    return `/dashboard/pipeline/clients/opportunity/${targetClientId}/edit/${opportunityId}`;
  };

  const getAddOpportunityUrl = () => {
    if (!clientId) {
      return `/dashboard/clients`;
    }

    return `/dashboard/pipeline/clients/opportunity/${clientId}/add`;
  };

  const handleOpportunityClick = (opportunityId: string) => {
    router.push(getOpportunityEditUrl(opportunityId));
  };

  const handleDeleteClick = (opportunity: Opportunity) => {
    if (onDeleteClick) {
      onDeleteClick(opportunity);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    opportunityId: string
  ) => {
    e.dataTransfer.setData("opportunityId", opportunityId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData("opportunityId");
    if (opportunityId) {
      onStatusChange(opportunityId, status);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>Chargement des opportunités...</div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p>Aucune opportunité trouvée pour ce client.</p>
        <ActionButton
          onClick={() => router.push(getAddOpportunityUrl())}
          variant="primary"
          size="medium"
        >
          Ajouter une opportunité
        </ActionButton>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.tableHeader}>Titre</th>
              <th style={styles.tableHeader}>Statut</th>
              <th style={styles.tableHeaderRight}>Valeur</th>
              <th style={styles.tableHeaderCenter}>Probabilité</th>
              <th style={styles.tableHeader}>Date de clôture</th>
              <th style={styles.tableHeaderCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity) => {
              const statusInfo = statusColumns.find(
                (status) => status.id === opportunity.status
              ) || { color: "#999", label: "Non défini" };

              return (
                <tr key={opportunity._id} style={styles.tableRow}>
                  <td
                    style={styles.tableCellLink}
                    onClick={() => handleOpportunityClick(opportunity._id)}
                  >
                    {opportunity.title}
                  </td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td style={styles.tableCellRight}>
                    {formatCurrency(opportunity.value)}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {opportunity.probability || 0}%
                  </td>
                  <td style={styles.tableCell}>
                    {opportunity.expectedClosingDate
                      ? new Date(
                          opportunity.expectedClosingDate
                        ).toLocaleDateString("fr-FR")
                      : "Non définie"}
                  </td>
                  <td style={styles.tableCellCenter}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <ActionButton
                        onClick={() => handleOpportunityClick(opportunity._id)}
                        variant="secondary"
                        size="small"
                      >
                        Éditer
                      </ActionButton>
                      {onDeleteClick && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(opportunity);
                          }}
                        >
                          <ActionButton
                            onClick={() => handleDeleteClick(opportunity)}
                            variant="danger"
                            size="small"
                          >
                            <FaTrashAlt />
                          </ActionButton>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={styles.kanbanContainer}>
      {statusColumns.map((status) => {
        const filteredOpportunities = opportunities.filter(
          (opportunity) => opportunity.status === status.id
        );

        return (
          <div
            key={status.id}
            style={styles.statusColumn}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div
              style={{
                ...styles.statusHeader,
                borderLeft: `4px solid ${status.color}`,
              }}
            >
              <h3 style={styles.statusTitle}>{status.label}</h3>
              <span
                style={{
                  ...styles.statusCount,
                  backgroundColor: status.color,
                }}
              >
                {filteredOpportunities.length}
              </span>
            </div>

            <div style={styles.statusBody}>
              {filteredOpportunities.map((opportunity) => (
                <div
                  key={opportunity._id}
                  style={styles.opportunityCard}
                  onClick={() => handleOpportunityClick(opportunity._id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opportunity._id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.1)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <h4 style={styles.opportunityTitle}>{opportunity.title}</h4>
                    {onDeleteClick && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(opportunity);
                        }}
                      >
                        <ActionButton
                          onClick={() => handleDeleteClick(opportunity)}
                          variant="danger"
                          size="small"
                        >
                          <FaTrashAlt />
                        </ActionButton>
                      </div>
                    )}
                  </div>
                  <div style={styles.opportunityValue}>
                    {formatCurrency(opportunity.value)}
                  </div>
                  <div style={styles.opportunityMeta}>
                    <span>Prob: {opportunity.probability || 0}%</span>
                    <span>
                      {opportunity.expectedClosingDate
                        ? new Date(
                            opportunity.expectedClosingDate
                          ).toLocaleDateString("fr-FR")
                        : "Date non définie"}
                    </span>
                  </div>
                </div>
              ))}
              {filteredOpportunities.length === 0 && (
                <div style={styles.emptyColumnPlaceholder}>
                  Aucune opportunité
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OpportunityBoard;
