import React, { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { FaCheck, FaTimes } from "react-icons/fa";

interface ToggleClientStatusProps {
  clientId: string;
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

const ToggleClientStatus: React.FC<ToggleClientStatusProps> = ({
  clientId,
  isActive,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      await onStatusChange(!isActive);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActionButton
      onClick={handleToggle}
      variant={isActive ? "success" : "danger"}
      size="medium"
      disabled={isLoading}
    >
      {isActive ? (
        <>
          <FaCheck style={{ marginRight: "8px" }} />
          Actif
        </>
      ) : (
        <>
          <FaTimes style={{ marginRight: "8px" }} />
          Inactif
        </>
      )}
    </ActionButton>
  );
};

export default ToggleClientStatus;
