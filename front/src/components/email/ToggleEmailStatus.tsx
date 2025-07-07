import React, { useState } from "react";
import ActionButton from "@/components/common/ActionButton";

interface ToggleEmailStatusProps {
  emailId: string;
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
  disabled?: boolean;
}

const ToggleEmailStatus: React.FC<ToggleEmailStatusProps> = ({
  emailId,
  isActive,
  onStatusChange,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      const newStatus = !isActive;
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActionButton
      onClick={handleToggle}
      variant={isActive ? "success" : "secondary"}
      size="small"
      disabled={disabled || isLoading}
      customColor={isActive ? "#4caf50" : undefined}
      customTextColor={isActive ? "#fff" : "#666"}
      customBorderColor={isActive ? "#4caf50" : "#ddd"}
    >
      {isLoading ? "..." : isActive ? "Actif" : "Inactif"}
    </ActionButton>
  );
};

export default ToggleEmailStatus;
