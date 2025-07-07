// components/team/LoadingOverlay.tsx
import React from "react";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import { FaSyncAlt } from "react-icons/fa";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Chargement...",
}) => {
  if (!isVisible) return null;

  return (
    <div style={styles.loadingOverlay}>
      <div style={styles.loadingSpinner}>
        <FaSyncAlt style={{ animation: "spin 1s linear infinite" }} />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingOverlay;
