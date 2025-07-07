// components/team/DeleteTeamModal.tsx
import React from "react";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import { FaTrashAlt } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface DeleteTeamModalProps {
  isOpen: boolean;
  teamName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({
  isOpen,
  teamName,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Confirmer la suppression</h3>
          <p style={styles.modalText}>
            Êtes-vous sûr de vouloir supprimer l'équipe{" "}
            <strong>{teamName}</strong> ? Cette action ne peut pas être annulée.
          </p>
        </div>
        <div style={styles.modalActions}>
          <ActionButton onClick={onClose} variant="secondary" size="medium">
            Annuler
          </ActionButton>
          <ActionButton onClick={onConfirm} variant="danger" size="medium">
            <FaTrashAlt style={{ marginRight: "8px" }} />
            Supprimer
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeamModal;
