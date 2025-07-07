"use client";
import React from "react";

interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive,
  activeText = "Actif",
  inactiveText = "Inactif",
}) => {
  const badgeStyle = {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: isActive ? "#e6f7e6" : "#ffebee",
    color: isActive ? "#2e7d32" : "#d32f2f",
  };

  return <span style={badgeStyle}>{isActive ? activeText : inactiveText}</span>;
};

export default StatusBadge;
