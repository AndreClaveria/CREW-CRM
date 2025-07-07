import React from "react";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";
import { FaArrowLeft, FaEdit, FaTrashAlt } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface ClientHeaderProps {
  clientName: string;
  clientId: string;
  company: { _id: string } | null;
  navigateBack: () => void;
  onDeleteClick: () => void;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({
  clientName,
  clientId,
  company,
  navigateBack,
  onDeleteClick,
}) => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.pageTitle}>
          <FaArrowLeft style={{ cursor: "pointer" }} onClick={navigateBack} />
          {clientName}
        </h1>
        <div style={styles.pageSubtitle}>Gestion et informations du client</div>
      </div>
      <div style={styles.buttonContainer}>
        <ActionButton
          onClick={() =>
            (window.location.href = `/dashboard/admin/manage/company/clients/${company?._id}/edit/${clientId}`)
          }
          variant="secondary"
          size="medium"
        >
          <FaEdit style={{ marginRight: "8px" }} />
          Modifier
        </ActionButton>
        <ActionButton onClick={onDeleteClick} variant="danger" size="medium">
          <FaTrashAlt style={{ marginRight: "8px" }} />
          Supprimer
        </ActionButton>
      </div>
    </div>
  );
};

export default ClientHeader;
