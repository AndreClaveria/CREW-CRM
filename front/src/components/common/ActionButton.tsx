"use client";
import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  customColor?: string;
  customTextColor?: string;
  customBorderColor?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  variant = "secondary",
  size = "medium",
  children,
  customColor,
  customTextColor,
  customBorderColor,
}) => {
  // Définir les couleurs en fonction du variant
  const variantStyles = {
    primary: {
      backgroundColor: "var(--color-blue)",
      color: "var(--color-neutral)",
      border: "none",
    },
    secondary: {
      backgroundColor: "var(--color-neutral)",
      color: "var(--color-black)",
      border: `var(--border-width) solid var(--color-grey-400)`,
    },
    success: {
      backgroundColor: "var(--color-success-light)",
      color: "var(--color-success-dark)",
      border: "none",
    },
    danger: {
      backgroundColor: "var(--color-error-light)",
      color: "var(--color-error-dark)",
      border: "none",
    },
    warning: {
      backgroundColor: "var(--color-warning)",
      color: "var(--color-text)",
      border: "none",
    },
    info: {
      backgroundColor: "var(--table-row-selected-bg)",
      color: "var(--color-blue)",
      border: "none",
    },
  };

  // Définir la taille du bouton
  const sizeStyles = {
    small: {
      padding: "4px 12px",
      fontSize: "var(--font-size-small-small)",
    },
    medium: {
      padding: "6px 16px",
      fontSize: "var(--font-size-small)",
    },
    large: {
      padding: "10px 20px",
      fontSize: "var(--font-size-normal)",
    },
  };

  const buttonStyle = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: "var(--border-small-radius)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? "var(--opacity-less)" : 1,
    fontWeight: "var(--font-weight-medium)",
    ...(customColor && { backgroundColor: customColor }),
    ...(customTextColor && { color: customTextColor }),
    ...(customBorderColor && {
      border: `var(--border-width) solid ${customBorderColor}`,
    }),
  };

  return (
    <button onClick={onClick} disabled={disabled} style={buttonStyle}>
      {children}
    </button>
  );
};

export default ActionButton;
