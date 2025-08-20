import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";

interface QuickStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: string;
    color?: string;
  }>;
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <div style={dashboardStyles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} style={dashboardStyles.statCard}>
          {stat.icon && (
            <div
              style={{
                fontSize: "2.5rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {stat.icon}
            </div>
          )}
          <h3
            style={{
              ...dashboardStyles.statNumber,
              color: stat.color || "var(--color-text)",
              fontSize: "2.5rem",
              marginBottom: "0.5rem",
            }}
          >
            {stat.value}
          </h3>
          <p
            style={{
              ...dashboardStyles.statLabel,
              fontSize: "var(--font-size-normal)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
