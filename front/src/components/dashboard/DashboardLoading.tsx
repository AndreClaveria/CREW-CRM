import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";

const DashboardLoading: React.FC = () => {
  return (
    <div style={dashboardStyles.container}>
      {/* En-tête de chargement */}
      <div style={dashboardStyles.welcomeCard}>
        <div
          style={{
            height: "2rem",
            backgroundColor: "var(--color-grey-200)",
            borderRadius: "var(--border-small-radius)",
            marginBottom: "1rem",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
        <div
          style={{
            height: "1.5rem",
            backgroundColor: "var(--color-grey-200)",
            borderRadius: "var(--border-small-radius)",
            width: "70%",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </div>

      {/* Grille de statistiques en chargement */}
      <div style={dashboardStyles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              ...dashboardStyles.statCard,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <div
              style={{
                height: "3rem",
                backgroundColor: "var(--color-grey-200)",
                borderRadius: "var(--border-small-radius)",
                marginBottom: "0.5rem",
              }}
            />
            <div
              style={{
                height: "1.5rem",
                backgroundColor: "var(--color-grey-200)",
                borderRadius: "var(--border-small-radius)",
                width: "60%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Graphiques en chargement */}
      <div style={dashboardStyles.chartsGrid}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              ...dashboardStyles.chartSection,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <div
              style={{
                height: "2rem",
                backgroundColor: "var(--color-grey-200)",
                borderRadius: "var(--border-small-radius)",
                marginBottom: "1rem",
              }}
            />
            <div
              style={{
                height: "8rem",
                backgroundColor: "var(--color-grey-200)",
                borderRadius: "var(--border-small-radius)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Sections en chargement */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            ...dashboardStyles.activitySection,
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          <div
            style={{
              height: "2rem",
              backgroundColor: "var(--color-grey-200)",
              borderRadius: "var(--border-small-radius)",
              marginBottom: "1rem",
            }}
          />
          <div
            style={{
              height: "6rem",
              backgroundColor: "var(--color-grey-200)",
              borderRadius: "var(--border-small-radius)",
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLoading;
