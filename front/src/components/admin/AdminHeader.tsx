import React from "react";
import { adminDashboardStyles as styles } from "@/styles/pages/dashboard/admin/adminDashboardStyles";
import { FaHeartbeat } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface AdminHeaderProps {
  navigateToSystemHealth: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  navigateToSystemHealth,
}) => {
  return (
    <>
      <h1 style={styles.pageTitle}>Tableau de bord administrateur</h1>

      <div style={styles.actionButtonsContainer}>
        <ActionButton
          onClick={navigateToSystemHealth}
          variant="secondary"
          size="medium"
        >
          <FaHeartbeat style={{ marginRight: "10px" }} />
          État du système
        </ActionButton>
      </div>
    </>
  );
};

export default AdminHeader;
