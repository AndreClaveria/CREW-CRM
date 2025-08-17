import React, { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteEmailModalProps {
  emailSubject: string;
  onCancel: () => void;
  onConfirm: () => void;
  isPermanent?: boolean;
}

const DeleteEmailModal: React.FC<DeleteEmailModalProps> = ({
  emailSubject,
  onCancel,
  onConfirm,
  isPermanent = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "480px",
          width: "90%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icône d&apos;avertissement */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#fee",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaExclamationTriangle
              style={{
                fontSize: "24px",
                color: "#dc2626",
              }}
            />
          </div>
        </div>

        {/* Titre */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#111827",
            textAlign: "center",
            marginBottom: "12px",
            fontFamily: "var(--font-first)",
          }}
        >
          {isPermanent
            ? "Supprimer définitivement l&apos;email"
            : "Supprimer l&apos;email"}
        </h3>

        {/* Message de confirmation */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
            color: "#6b7280",
            lineHeight: "1.5",
          }}
        >
          <p style={{ marginBottom: "12px" }}>
            Êtes-vous sûr de vouloir supprimer cet email ?
          </p>
          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              marginBottom: "12px",
            }}
          >
            <strong>Sujet :</strong> {emailSubject}
          </div>
          {isPermanent ? (
            <p style={{ color: "#dc2626", fontSize: "14px" }}>
              <strong>Attention :</strong> Cette action est irréversible.
              L&apos;email sera définitivement supprimé.
            </p>
          ) : (
            <p style={{ fontSize: "14px" }}>
              L&apos;email sera déplacé dans la corbeille et pourra être
              restauré.
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <ActionButton
            onClick={onCancel}
            variant="secondary"
            size="medium"
            disabled={isDeleting}
            customTextColor="#6b7280"
            customBorderColor="#d1d5db"
          >
            Annuler
          </ActionButton>
          <ActionButton
            onClick={handleConfirm}
            variant="danger"
            size="medium"
            disabled={isDeleting}
            customColor="#dc2626"
          >
            {isDeleting
              ? "Suppression..."
              : isPermanent
              ? "Supprimer définitivement"
              : "Supprimer"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmailModal;
