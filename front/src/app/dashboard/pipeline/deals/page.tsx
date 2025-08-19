"use client";

import { useUserDashboard } from "@/hooks/useUserDashboard";
import { useDeals } from "@/hooks/useDeals";
import { useState } from "react";
import DealBoard from "@/components/pipeline/deal/DealBoard";
import ActionButton from "@/components/common/ActionButton";
import { FaBriefcase } from "react-icons/fa";
import DeleteDealModal from "@/components/pipeline/deal/DeleteDealModal";
import { useRouter } from "next/navigation";

export default function DealsPage() {
  const router = useRouter();
  const { dashboardData, loading, error } = useUserDashboard();
  const {
    deals,
    isLoading,
    error: dealsError,
    handleStatusChange,
    deleteDeal,
  } = useDeals({
    companyId: dashboardData?.company?._id,
  });

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<any>(null);

  const handleDeleteClick = (deal: any) => {
    setDealToDelete(deal);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dealToDelete) return;

    try {
      await deleteDeal(dealToDelete._id);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression du deal:", error);
      alert("Une erreur est survenue lors de la suppression du deal");
    } finally {
      setShowDeleteModal(false);
      setDealToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDealToDelete(null);
  };

  if (loading || isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Chargement des informations...
      </div>
    );
  }

  if (error || dealsError) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error || dealsError}</p>
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
          <h1
            style={{
              fontSize: "50px",
              marginBottom: "8px",
              fontFamily: "var(--font-first)",
            }}
          >
            Deals
          </h1>
          {company && (
            <p
              style={{
                color: "var(--color-grey-600)",
                fontFamily: "var(--font-second-regular)",
              }}
            >
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "var(--spacing-small)" }}>
          <ActionButton
            onClick={() => router.push("/dashboard/pipeline/deals/add")}
            variant="primary"
            size="medium"
          >
            Créer un deal
          </ActionButton>
          <div
            style={{
              display: "flex",
              border: `var(--border-width) solid var(--color-grey-400)`,
              borderRadius: "var(--border-small-radius)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                padding: "8px 12px",
                background:
                  viewMode === "kanban"
                    ? "var(--color-blue)"
                    : "var(--color-neutral)",
                color:
                  viewMode === "kanban"
                    ? "var(--color-white)"
                    : "var(--color-blue)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-second-regular)",
                fontSize: "var(--font-size-small)",
              }}
            >
              Vue Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 12px",
                background:
                  viewMode === "list"
                    ? "var(--color-blue)"
                    : "var(--color-neutral)",
                color:
                  viewMode === "list"
                    ? "var(--color-white)"
                    : "var(--color-blue)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-second-regular)",
                fontSize: "var(--font-size-small)",
              }}
            >
              Vue Liste
            </button>
          </div>
        </div>
      </div>

      {deals.length > 0 ? (
        <DealBoard
          deals={deals}
          companyId={company?._id}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          viewMode={viewMode}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div style={styles.noDealsMessage}>
          <FaBriefcase style={styles.noDealsIcon} />
          <p style={styles.noDealsText}>Aucun deal disponible pour le moment</p>
          <ActionButton
            onClick={() => router.push("/dashboard/pipeline/deals/add")}
            variant="primary"
            size="medium"
          >
            Créer un deal
          </ActionButton>
        </div>
      )}

      {showDeleteModal && dealToDelete && (
        <DeleteDealModal
          dealName={dealToDelete.title}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

const styles = {
  noDealsMessage: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "var(--spacing-big)",
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-radius)",
    color: "var(--color-grey-600)",
    gap: "var(--spacing-small)",
  },
  noDealsIcon: {
    fontSize: "2rem",
    color: "var(--color-grey-500)",
    marginBottom: "15px",
  },
  noDealsText: {
    fontFamily: "var(--font-second-regular)",
    fontSize: "var(--font-size-normal)",
    color: "var(--color-grey-600)",
    margin: 0,
  },
};
