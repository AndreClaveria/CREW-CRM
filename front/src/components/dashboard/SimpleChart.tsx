import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";

interface SimpleChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    maxValue: number;
    color?: string;
  }>;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ title, data }) => {
  return (
    <div style={dashboardStyles.chartSection}>
      <h3
        style={{
          ...dashboardStyles.sectionTitle,
          fontSize: "1.25rem",
          marginBottom: "1.5rem",
          color: "var(--color-grey-800)",
        }}
      >
        {title}
      </h3>
      <div style={dashboardStyles.chartContainer}>
        {data.map((item, index) => (
          <div key={index} style={dashboardStyles.chartItem}>
            <div style={dashboardStyles.chartLabel}>
              <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                {item.label}
              </span>
              <span
                style={{
                  ...dashboardStyles.chartValue,
                  color: item.color || "var(--color-text)",
                  fontWeight: "var(--font-weight-bold)",
                }}
              >
                {item.value}
              </span>
            </div>
            <div style={dashboardStyles.chartBar}>
              <div
                style={{
                  ...dashboardStyles.chartBarFill,
                  width: `${(item.value / item.maxValue) * 100}%`,
                  backgroundColor: item.color || "var(--color-main)",
                  borderRadius: "var(--border-small-radius)",
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleChart;
