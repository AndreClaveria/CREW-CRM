import React from "react";
import ActionButton from "@/components/common/ActionButton";

interface DeleteDealModalProps {
  dealName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteDealModal: React.FC<DeleteDealModalProps> = ({
  dealName,
  onCancel,
  onConfirm,
}) => {
  const styles = {
    modalBackdrop: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "var(--z-index-top)",
    },
    modalContent: {
      backgroundColor: "var(--color-white)",
      borderRadius: "var(--border-radius)",
      padding: "var(--spacing-big)",
      maxWidth: "500px",
      width: "90%",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    modalHeader: {
      marginBottom: "var(--spacing-normal)",
    },
    modalTitle: {
      fontSize: "var(--font-size-big)",
      fontFamily: "var(--font-first)",
      marginBottom: "var(--spacing-small)",
      color: "var(--color-text)",
    },
    modalText: {
      fontSize: "var(--font-size-normal)",
      fontFamily: "var(--font-second-regular)",
      color: "var(--color-text)",
      lineHeight: 1.5,
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "var(--spacing-small)",
      marginTop: "var(--spacing-normal)",
    },
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Confirmer la suppression</h3>
          <p style={styles.modalText}>
            Êtes-vous sûr de vouloir supprimer le deal{" "}
            <strong>{dealName}</strong> ? Cette action ne peut pas être annulée.
          </p>
        </div>
        <div style={styles.modalActions}>
          <ActionButton onClick={onCancel} variant="secondary" size="medium">
            Annuler
          </ActionButton>
          <ActionButton onClick={onConfirm} variant="danger" size="medium">
            Supprimer
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteDealModal;
