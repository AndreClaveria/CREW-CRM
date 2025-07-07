"use client";
import React, { useState } from "react";
import { updateUser } from "@/services/user.service";
import ActionButton from "@/components/common/ActionButton";

console.log("push");

interface ToggleUserStatusProps {
  userId: string;
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

const ToggleUserStatus: React.FC<ToggleUserStatusProps> = ({
  userId,
  isActive,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = async () => {
    if (isLoading) return;

    const newStatus = !isActive;
    const action = newStatus ? "activer" : "désactiver";

    // Confirmation avant changement
    if (!confirm(`Êtes-vous sûr de vouloir ${action} cet utilisateur ?`)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await updateUser(userId, { active: newStatus });
      onStatusChange(newStatus);
    } catch (err: any) {
      console.error(`Erreur lors du changement de statut:`, err);
      setError(err.message || `Impossible de ${action} l'utilisateur`);
      alert(
        `Erreur: ${err.message || `Impossible de ${action} l'utilisateur`}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActionButton
      onClick={toggleStatus}
      disabled={isLoading}
      variant={isActive ? "danger" : "success"}
      size="medium"
    >
      {isLoading ? "Traitement..." : isActive ? "Désactiver" : "Activer"}
    </ActionButton>
  );
};

export default ToggleUserStatus;
