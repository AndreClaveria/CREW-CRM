import React from "react";
import { useRouter } from "next/navigation";
import { Deal } from "@/services/deal.service";
import { formatCurrency } from "@/utils/formatters";
import ActionButton from "@/components/common/ActionButton";
import {
  dealBoardStyles as styles,
  dealStatusColumns,
} from "@/styles/components/deal/dealBoardStyles";
import { FaTrashAlt } from "react-icons/fa";

interface DealBoardProps {
  deals: Deal[];
  companyId?: string;
  isLoading: boolean;
  onStatusChange: (dealId: string, newStatus: Deal["status"]) => void;
  viewMode: "kanban" | "list";
  onDeleteClick?: (deal: Deal) => void;
}

const DealBoard: React.FC<DealBoardProps> = ({
  deals,
  companyId,
  isLoading,
  onStatusChange,
  viewMode,
  onDeleteClick,
}) => {
  const router = useRouter();

  const handleDeleteClick = (deal: Deal) =>
    onDeleteClick && onDeleteClick(deal);
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    dealId: string
  ) => {
    e.dataTransfer.setData("dealId", dealId);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    status: Deal["status"]
  ) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("dealId");
    if (dealId) onStatusChange(dealId, status);
  };

  if (isLoading)
    return <div style={styles.loadingContainer}>Chargement des deals...</div>;
  if (deals.length === 0)
    return <div style={styles.emptyContainer}>Aucun deal trouvé.</div>;

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
            {deals.map((deal) => {
              const statusInfo = dealStatusColumns.find(
                (s) => s.id === deal.status
              ) || { color: "#999", label: "Non défini" };
              return (
                <tr key={deal._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{deal.title}</td>
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
                    {formatCurrency(deal.value)}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {deal.probability || 0}%
                  </td>
                  <td style={styles.tableCell}>
                    {deal.expectedClosingDate
                      ? new Date(deal.expectedClosingDate).toLocaleDateString(
                          "fr-FR"
                        )
                      : "Non définie"}
                  </td>
                  <td style={styles.tableCellCenter}>
                    {onDeleteClick && (
                      <ActionButton
                        onClick={() => handleDeleteClick(deal)}
                        variant="danger"
                        size="small"
                      >
                        <FaTrashAlt />
                      </ActionButton>
                    )}
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
      {dealStatusColumns.map((status) => {
        const filtered = deals.filter((d) => d.status === status.id);
        return (
          <div
            key={status.id}
            style={styles.statusColumn}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id as Deal["status"])}
          >
            <div
              style={{
                ...styles.statusHeader,
                borderLeft: `4px solid ${status.color}`,
              }}
            >
              <h3 style={styles.statusTitle}>{status.label}</h3>
              <span
                style={{ ...styles.statusCount, backgroundColor: status.color }}
              >
                {filtered.length}
              </span>
            </div>
            <div style={styles.statusBody}>
              {filtered.map((deal) => (
                <div
                  key={deal._id}
                  style={styles.card}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal._id)}
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
                    <h4 style={styles.cardTitle}>{deal.title}</h4>
                    {onDeleteClick && (
                      <ActionButton
                        onClick={() => handleDeleteClick(deal)}
                        variant="danger"
                        size="small"
                      >
                        <FaTrashAlt />
                      </ActionButton>
                    )}
                  </div>
                  <div style={styles.cardValue}>
                    {formatCurrency(deal.value)}
                  </div>
                  <div style={styles.cardMeta}>
                    <span>Prob: {deal.probability || 0}%</span>
                    <span>
                      {deal.expectedClosingDate
                        ? new Date(deal.expectedClosingDate).toLocaleDateString(
                            "fr-FR"
                          )
                        : "Date non définie"}
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--color-grey-600)",
                  }}
                >
                  Aucun deal
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealBoard;
