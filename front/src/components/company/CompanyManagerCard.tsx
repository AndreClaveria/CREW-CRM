import React from "react";
import { companyDetailsStyles as styles } from "@/styles/pages/dashboard/admin/companyDetailStyles";
import { FaUserTie, FaExclamationTriangle } from "react-icons/fa";

interface CompanyManagerCardProps {
  manager: any;
  navigateToManager: (managerId: string) => void;
}

const CompanyManagerCard: React.FC<CompanyManagerCardProps> = ({
  manager,
  navigateToManager,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaUserTie style={styles.sectionIcon} />
          Manager
        </h2>
      </div>

      {manager ? (
        <div
          style={styles.managerCard}
          onClick={() => navigateToManager(manager._id)}
        >
          <div style={styles.managerAvatar}>
            {manager.firstName.charAt(0)}
            {manager.lastName.charAt(0)}
          </div>
          <div style={styles.managerInfo}>
            <h3 style={styles.managerName}>
              {manager.firstName} {manager.lastName}
            </h3>
            <div style={styles.managerEmail}>{manager.email}</div>
            <span style={styles.managerRole}>{manager.role}</span>
          </div>
        </div>
      ) : (
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            Aucun manager assigné à cette entreprise.
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagerCard;
