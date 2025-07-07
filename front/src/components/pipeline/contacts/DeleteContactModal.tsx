import React from "react";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";
import ActionButton from "@/components/common/ActionButton";

interface DeleteContactModalProps {
  contactName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({
  contactName,
  onCancel,
  onConfirm,
}) => {
  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Confirmer la suppression</h3>
          <p style={styles.modalText}>
            Êtes-vous sûr de vouloir supprimer le contact{" "}
            <strong>{contactName}</strong> ? Cette action ne peut pas être
            annulée.
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

export default DeleteContactModal;
