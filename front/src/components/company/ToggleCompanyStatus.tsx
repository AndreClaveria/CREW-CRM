"use client";
import React, { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { updateCompany } from "@/services/company.service";

interface ToggleCompanyStatusProps {
  companyId: string;
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

const ToggleCompanyStatus: React.FC<ToggleCompanyStatusProps> = ({
  companyId,
  isActive,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newStatus = !isActive;
      await updateCompany(companyId, { isActive: newStatus });
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert(
        "Impossible de modifier le statut de l'entreprise. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActionButton
      onClick={handleToggle}
      variant={isActive ? "warning" : "success"}
      size="medium"
      disabled={loading}
    >
      {loading ? "..." : isActive ? "Désactiver" : "Activer"}
    </ActionButton>
  );
};

export default ToggleCompanyStatus;
