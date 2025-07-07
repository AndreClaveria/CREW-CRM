import React from "react";
import ActionButton from "@/components/common/ActionButton";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";

interface DeleteClientModalProps {
  clientName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
  clientName,
  onCancel,
  onConfirm,
}) => {
  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Confirmer la suppression</h3>
          <p style={styles.modalText}>
            Êtes-vous sûr de vouloir supprimer le client{" "}
            <strong>{clientName}</strong> ?
          </p>
          <p
            style={{
              color: "var(--color-error-dark)",
              marginTop: "var(--spacing-small)",
            }}
          >
            Cette action est irréversible et supprimera également tous les
            contacts associés.
          </p>
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
    </div>
  );
};

export default DeleteClientModal;
