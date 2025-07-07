"use client";
import React, { use, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOpportunityManagement } from "@/hooks/useOpportunityManagement";
import ActionButton from "@/components/common/ActionButton";
import OpportunityBoard from "@/components/pipeline/opportunity/OpportunityBoard";
import DeleteOpportunityModal from "@/components/pipeline/opportunity/DeleteOpportunityModal";

interface OpportunityManagementProps {
  params: Promise<{
    clientId: string;
    companyId: string;
  }>;
}

const OpportunityManagement: React.FC<OpportunityManagementProps> = ({
  params,
}) => {
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.clientId;
  const companyId = unwrappedParams.companyId;

  const { user, isLoading } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<any>(null);

  const {
    opportunities,
    client,
    error,
    isLoadingOpportunities,
    viewMode,
    setViewMode,
    handleStatusChange,
    navigateToClientsList,
    navigateToAddOpportunity,
    deleteOpportunity,
  } = useOpportunityManagement({ clientId, companyId });

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

  if (isLoading || !user) {
    return null;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
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
          {client && (
            <p style={{ color: "#666" }}>
              Client: <strong>{client.name}</strong>
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
                color: viewMode === "kanban" ? "#3498DB" : "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Vue Liste
            </button>
          </div>
          <ActionButton
            onClick={navigateToClientsList}
            variant="secondary"
            size="large"
            customTextColor="#3498DB"
            customBorderColor="#3498DB"
          >
            Retour aux clients
          </ActionButton>
          <ActionButton
            onClick={navigateToAddOpportunity}
            variant="primary"
            size="large"
            customColor="#3498DB"
          >
            Ajouter une opportunité
          </ActionButton>
        </div>
      </div>

      <OpportunityBoard
        opportunities={opportunities}
        clientId={clientId}
        isLoading={isLoadingOpportunities}
        onStatusChange={handleStatusChange}
        viewMode={viewMode}
        onDeleteClick={handleDeleteClick}
      />

      {showDeleteModal && opportunityToDelete && (
        <DeleteOpportunityModal
          opportunityName={opportunityToDelete.title}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default OpportunityManagement;
