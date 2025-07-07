// components/modals/ProfileModal/ProfileErrorState.tsx
import React from "react";
import { profileModalStyles } from "@/styles/components/modals/ProfileModal/profileModalStyles";
import { ProfileErrorStateProps } from "./types";

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({
  onClose,
  getCloseButtonStyle,
  isCloseHovered,
  setIsCloseHovered,
  handleModalClick,
}) => {
  const updatedModalContainer = {
    ...profileModalStyles.modalContainer,
    ...profileModalStyles.errorStateModalContainer,
  };

  const updatedMainContent = {
    ...profileModalStyles.mainContent,
    ...profileModalStyles.errorStateMainContent,
  };

  return (
    <div style={profileModalStyles.overlay} onClick={onClose}>
      <div style={updatedModalContainer} onClick={handleModalClick}>
        <div style={profileModalStyles.modalHeader}>
          <h2 style={profileModalStyles.modalTitle}>Profil</h2>
          <button
            style={getCloseButtonStyle()}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div style={updatedMainContent}>
          <div style={profileModalStyles.errorStateBox}>
            <h3 style={profileModalStyles.errorStateTitle}>
              Erreur d'identification
            </h3>
            <p style={profileModalStyles.errorStateText}>
              Impossible de charger les informations de votre profil. Votre
              session a peut-être expiré.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              style={profileModalStyles.errorStateButton}
            >
              Se reconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileErrorState;
