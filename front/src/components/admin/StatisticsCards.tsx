import React from "react";
import { adminDashboardStyles as styles } from "@/styles/pages/dashboard/admin/adminDashboardStyles";
import { FaUsers, FaUserAlt, FaBuilding } from "react-icons/fa";

interface StatisticsCardsProps {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  activeCompanies: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalUsers,
  activeUsers,
  totalCompanies,
  activeCompanies,
}) => {
  return (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <FaUsers style={{ color: "var(--color-blue)", fontSize: "32px" }} />
        <div style={styles.statValue}>{totalUsers}</div>
        <div style={styles.statLabel}>Utilisateurs totaux</div>
      </div>
      <div style={styles.statCard}>
        <FaUserAlt style={{ color: "var(--color-green)", fontSize: "32px" }} />
        <div style={{ ...styles.statValue, color: "var(--color-green)" }}>
          {activeUsers}
        </div>
        <div style={styles.statLabel}>Utilisateurs actifs</div>
      </div>
      <div style={styles.statCard}>
        <FaBuilding
          style={{ color: "var(--color-orange)", fontSize: "32px" }}
        />
        <div style={{ ...styles.statValue, color: "var(--color-orange)" }}>
          {totalCompanies}
        </div>
        <div style={styles.statLabel}>Entreprises totales</div>
      </div>
      <div style={styles.statCard}>
        <FaBuilding
          style={{ color: "var(--color-purple)", fontSize: "32px" }}
        />
        <div style={{ ...styles.statValue, color: "var(--color-purple)" }}>
          {activeCompanies}
        </div>
        <div style={styles.statLabel}>Entreprises actives</div>
      </div>
    </div>
  );
};

export default StatisticsCards;
