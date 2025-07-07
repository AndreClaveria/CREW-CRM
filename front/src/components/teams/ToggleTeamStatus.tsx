"use client";
import React, { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { updateTeam } from "@/services/team.service";

interface ToggleTeamStatusProps {
  teamId: string;
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

const ToggleTeamStatus: React.FC<ToggleTeamStatusProps> = ({
  teamId,
  isActive,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newStatus = !isActive;
      await updateTeam(teamId, { isActive: newStatus });
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert(
        "Impossible de modifier le statut de l'équipe. Veuillez réessayer."
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

export default ToggleTeamStatus;
