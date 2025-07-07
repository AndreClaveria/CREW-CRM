// src/styles/pages/dashboard/manage/client/clientDetailsStyles.ts
export const clientDetailsStyles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "var(--color-text, #333)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  pageSubtitle: {
    fontSize: "1rem",
    fontWeight: "400",
    color: "var(--color-grey-600, #666)",
    marginTop: "0.375rem",
  },
  buttonContainer: {
    display: "flex",
    gap: "0.75rem",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
    alignItems: "start",
    "@media (maxWidth: 1024px)": {
      gridTemplateColumns: "1fr",
    },
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2rem",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2rem",
  },
  card: {
    background: "var(--color-white, #fff)",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "var(--color-text, #333)",
  },
  sectionIcon: {
    color: "var(--color-blue, #1976d2)",
    fontSize: "1.5rem",
  },
  clientHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.5rem",
    " @media (maxWidth: 768px)": {
      flexDirection: "column" as const,
      alignItems: "center",
    },
  },
  clientLogo: {
    width: "6.25rem",
    height: "6.25rem",
    borderRadius: "0.5rem",
    objectFit: "contain" as const,
    backgroundColor: "var(--color-grey-100, #f8f9fa)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "1.5rem",
    " @media (maxWidth: 768px)": {
      marginRight: "0",
      marginBottom: "1rem",
    },
  },
  clientLogoPlaceholder: {
    width: "6.25rem",
    height: "6.25rem",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-grey-100, #f8f9fa)",
    color: "var(--color-blue, #1976d2)",
    fontSize: "2.5rem",
    marginRight: "1.5rem",
    " @media (maxWidth: 768px)": {
      marginRight: "0",
      marginBottom: "1rem",
    },
  },
  clientInfo: {
    flex: 1,
    " @media (maxWidth: 768px)": {
      textAlign: "center" as const,
      width: "100%",
    },
  },
  clientName: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "var(--color-text, #333)",
    marginBottom: "0.5rem",
  },
  clientSector: {
    fontSize: "1rem",
    color: "var(--color-grey-600, #666)",
    marginBottom: "0.75rem",
  },
  badgeContainer: {
    display: "flex",
    gap: "0.75rem",
    " @media (maxWidth: 768px)": {
      justifyContent: "center",
    },
  },
  statusBadge: {
    display: "inline-block",
    borderRadius: "0.375rem",
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "var(--color-white, #fff)",
  },
  clientDescription: {
    color: "var(--color-grey-700, #555)",
    lineHeight: "1.6",
    margin: "1.5rem 0",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
    margin: "1.5rem 0",
    "@media (maxWidth: 500px)": {
      gridTemplateColumns: "1fr",
    },
  },
  detailItem: {
    marginBottom: "1rem",
  },
  detailLabel: {
    fontSize: "0.875rem",
    color: "var(--color-grey-600, #666)",
    marginBottom: "0.375rem",
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
  },
  detailValue: {
    fontSize: "1rem",
    color: "var(--color-text, #333)",
    fontWeight: "500",
    wordBreak: "break-word" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--color-grey-400, #ccc)",
    margin: "1.5rem 0",
  },
  linkItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid var(--color-grey-400, #ccc)",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: "1rem",
    "&:hover": {
      backgroundColor: "var(--color-grey-100, #f8f9fa)",
      transform: "translateY(-3px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    },
  },
  linkIcon: {
    fontSize: "1.25rem",
    color: "var(--color-blue, #1976d2)",
  },
  linkInfo: {
    flex: 1,
    overflow: "hidden",
  },
  linkTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--color-text, #333)",
  },
  linkSubtitle: {
    fontSize: "0.875rem",
    color: "var(--color-grey-600, #666)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  contactActionStyles: {
    display: "flex",
    marginTop: "10px",
    justifyContent: "flex-end",
  },

  contactsContainer: {
    display: "flex",

    flexDirection: "column" as const,
    gap: "1rem",
    maxHeight: "500px",
    overflowY: "auto" as const,
  },
  contactCard: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid var(--color-grey-400, #ccc)",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "var(--color-grey-100, #f8f9fa)",
      transform: "translateY(-3px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    },
  },
  contactAvatar: {
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    backgroundColor: "var(--color-blue, #1976d2)",
    color: "var(--color-white, #fff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
    fontWeight: "600",
    marginRight: "1rem",
    flexShrink: 0,
  },
  contactInfo: {
    flex: 1,
    minWidth: 0, // Nécessaire pour que l'overflow fonctionne correctement
  },
  contactName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--color-text, #333)",
    marginBottom: "0.25rem",
    display: "flex",
    alignItems: "center",
  },
  contactPosition: {
    fontSize: "0.875rem",
    color: "var(--color-grey-600, #666)",
    marginBottom: "0.5rem",
  },
  contactDetails: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
  },
  contactDetail: {
    fontSize: "0.875rem",
    color: "var(--color-grey-600, #666)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  contactDetailIcon: {
    fontSize: "0.875rem",
    color: "var(--color-grey-500, #777)",
  },
  contactEmail: {
    fontSize: "0.875rem",
    color: "var(--color-grey-600, #666)",
    wordBreak: "break-word" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  opportunitiesContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    maxHeight: "500px",
    overflowY: "auto" as const,
  },
  opportunityCard: {
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid var(--color-grey-400, #ccc)",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "var(--color-grey-100, #f8f9fa)",
      transform: "translateY(-3px)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    },
  },
  opportunityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  },
  opportunityTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--color-text, #333)",
    wordBreak: "break-word" as const,
  },
  opportunityValue: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "var(--color-success-dark, #2e7d32)",
    whiteSpace: "nowrap" as const,
  },
  opportunityDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  },
  opportunityStatus: {
    fontSize: "0.75rem",
    color: "var(--color-white, #fff)",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.375rem",
    textTransform: "capitalize" as const,
  },
  opportunityProbability: {
    fontSize: "0.875rem",
    color: "var(--color-grey-600, #666)",
    whiteSpace: "nowrap" as const,
  },
  noDataCard: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.5rem",
    textAlign: "center" as const,
  },
  noDataIcon: {
    fontSize: "3rem",
    color: "var(--color-grey-500, #999)",
    marginBottom: "1rem",
  },
  noDataText: {
    fontSize: "1rem",
    color: "var(--color-grey-600, #666)",
    marginBottom: "1.5rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    width: "100%",
    gap: "1rem",
  },
  loadingSpinner: {
    fontSize: "2rem",
    color: "var(--color-blue, #1976d2)",
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "0.5rem",
    padding: "1.5rem",
    border: "1px solid var(--color-grey-400, #ccc)",
    borderRadius: "0.5rem",
    background: "var(--color-grey-100, #f8f9fa)",
    margin: "1rem 0",
  },
  scoreLabel: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "var(--color-grey-700, #555)",
  },
  scoreValue: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "var(--color-primary, #1976d2)",
  },
  scoreDescription: {
    fontSize: "0.875rem",
    color: "var(--color-grey-600, #666)",
    textAlign: "center" as const,
    marginTop: "0.5rem",
  },
  progressBarContainer: {
    width: "100%",
    height: "1rem",
    backgroundColor: "var(--color-grey-300, #e0e0e0)",
    borderRadius: "0.5rem",
    overflow: "hidden",
    margin: "0.5rem 0",
  },
  progressBar: {
    height: "100%",
    borderRadius: "0.5rem",
  },
  modalBackdrop: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "var(--color-white, #fff)",
    borderRadius: "0.5rem",
    padding: "2rem",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "var(--color-text, #333)",
    marginBottom: "0.5rem",
  },
  modalText: {
    fontSize: "1rem",
    color: "var(--color-grey-600, #666)",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "2rem",
  },
  loadingOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    gap: "1rem",
  },
  noDataActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  actionButtons: {
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.2s",
    "&:hover": {
      backgroundColor: "var(--color-blue-100, #e3f2fd)",
      transform: "translateY(-2px)",
    },
  },
};

// Ajout d'une keyframe pour l'animation de rotation
export const keyframes = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Ajout des styles globaux pour les keyframes
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = keyframes;
  document.head.appendChild(style);
}
