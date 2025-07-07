import React, { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import { updateContact } from "@/services/contact.service";

interface ToggleContactStatusProps {
  contactId: string;
  isActive: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

const ToggleContactStatus: React.FC<ToggleContactStatusProps> = ({
  contactId,
  isActive,
  onStatusChange,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = async () => {
    setIsUpdating(true);
    try {
      await updateContact(contactId, { isActive: !isActive });
      onStatusChange(!isActive);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors de la mise à jour du statut du contact");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ActionButton
      onClick={toggleStatus}
      variant={isActive ? "warning" : "success"}
      size="medium"
      disabled={isUpdating}
    >
      {isUpdating ? "Mise à jour..." : isActive ? "Désactiver" : "Activer"}
    </ActionButton>
  );
};

export default ToggleContactStatus;
