import React from "react";
import { adminDashboardStyles as styles } from "@/styles/pages/dashboard/admin/adminDashboardStyles";
import { FaUsers, FaUsersCog } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";
import UsersTable from "@/components/admin/users/UserTable";

interface UsersSectionProps {
  users: any[];
  navigateToUserDetails: (userId: string) => void;
  navigateToUserManagement: () => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
  users,
  navigateToUserDetails,
  navigateToUserManagement,
}) => {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaUsers style={styles.sectionIcon} />
          Utilisateurs
        </h2>
        <ActionButton
          onClick={navigateToUserManagement}
          variant="primary"
          size="small"
        >
          <FaUsersCog style={{ marginRight: "8px" }} />
          Gérer les utilisateurs
        </ActionButton>
      </div>

      <div style={styles.dataCard}>
        <UsersTable
          users={users}
          maxDisplayed={3}
          navigateToUserDetails={navigateToUserDetails}
          navigateToUserManagement={navigateToUserManagement}
          showViewMore={true}
        />
      </div>
    </div>
  );
};

export default UsersSection;
