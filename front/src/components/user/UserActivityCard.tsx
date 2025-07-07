import React from "react";
import { userDetailsStyles as styles } from "@/styles/pages/dashboard/admin/userDetailsStyles";
import { FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";

const UserActivityCard: React.FC = () => {
  return (
    <>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaCalendarAlt style={styles.sectionIcon} />
          Activité récente
        </h2>
      </div>
      <div style={styles.card}>
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            Les données d'activité ne sont pas encore disponibles.
          </div>
        </div>
      </div>
    </>
  );
};

export default UserActivityCard;
