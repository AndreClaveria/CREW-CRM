"use client";

import { useUserDashboard } from "@/hooks/useUserDashboard";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useState } from "react";
import OpportunityBoard from "@/components/pipeline/opportunity/OpportunityBoard";
import ActionButton from "@/components/common/ActionButton";
import { FaBriefcase } from "react-icons/fa";
import DeleteOpportunityModal from "@/components/pipeline/opportunity/DeleteOpportunityModal";

export default function OpportunitiesPage() {
  const { dashboardData, loading, error } = useUserDashboard();
  const {
    opportunities,
    isLoading: isLoadingOpportunities,
    error: opportunitiesError,
    handleStatusChange,
    deleteOpportunity,
  } = useOpportunities({
    companyId: dashboardData?.company?._id,
  });

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<any>(null);

  const handleDeleteClick = (opportunity: any) => {
    setOpportunityToDelete(opportunity);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!opportunityToDelete) return;

    try {
      await deleteOpportunity(opportunityToDelete._id);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'opportunité:", error);
      alert("Une erreur est survenue lors de la suppression de l'opportunité");
    } finally {
      setShowDeleteModal(false);
      setOpportunityToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOpportunityToDelete(null);
  };

  if (loading || isLoadingOpportunities) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Chargement des informations...
      </div>
    );
  }

  if (error || opportunitiesError) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error || opportunitiesError}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  const { company } = dashboardData;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "50px", marginBottom: "8px" }}>
            Opportunités
          </h1>
          {company && (
            <p style={{ color: "#666" }}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              border: "1px solid #ddd",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                padding: "8px 12px",
                background:
                  viewMode === "kanban" ? "#3498DB" : "var(--color-neutral)",
                color: viewMode === "kanban" ? "white" : "#3498DB",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 12px",
                background:
                  viewMode === "list" ? "#3498DB" : "var(--color-neutral)",
                color: viewMode === "list" ? "white" : "#3498DB",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Liste
            </button>
          </div>
        </div>
      </div>

      {opportunities.length > 0 ? (
        <OpportunityBoard
          opportunities={opportunities}
          companyId={company?._id}
          isLoading={isLoadingOpportunities}
          onStatusChange={handleStatusChange}
          viewMode={viewMode}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div style={styles.noOpportunitiesMessage}>
          <FaBriefcase style={styles.noOpportunitiesIcon} />
          <p>Aucune opportunité disponible pour le moment</p>
        </div>
      )}

      {showDeleteModal && opportunityToDelete && (
        <DeleteOpportunityModal
          opportunityName={opportunityToDelete.title}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

const styles = {
  noOpportunitiesMessage: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "40px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    color: "#666",
  },
  noOpportunitiesIcon: {
    fontSize: "2rem",
    color: "#999",
    marginBottom: "15px",
  },
};
