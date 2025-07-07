export const metricsDashboardStyles = {
  container: {
    padding: "2rem 0",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1e293b",
    margin: 0,
  },

  subtitle: {
    color: "#64748b",
    fontSize: "1rem",
    margin: 0,
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "1.5rem",
    marginBottom: "2rem",
  },

  card: {
    background: "#fff",
    borderRadius: "1rem",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px 0 rgba(224, 231, 255, 0.2)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "box-shadow 0.2s, border-color 0.2s",
    cursor: "pointer",
  },

  cardHover: {
    boxShadow: "0 4px 16px 0 rgba(99, 102, 241, 0.2)",
    borderColor: "#6366f1",
  },

  cardTitle: {
    fontSize: "1rem",
    color: "#64748b",
    fontWeight: "500",
    margin: 0,
  },

  cardValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: "0.25rem",
    margin: "0.25rem 0 0 0",
  },

  cardSubtitle: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    marginTop: "0.25rem",
    margin: "0.25rem 0 0 0",
  },

  cardIcon: {
    fontSize: "2.5rem",
    opacity: 0.2,
    alignSelf: "flex-end",
    marginTop: "1rem",
  },

  graphSection: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
    marginBottom: "2rem",
  },

  graphCard: {
    background: "#fff",
    borderRadius: "1rem",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px 0 rgba(224, 231, 255, 0.2)",
    padding: "1.5rem",
  },

  graphTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "1rem",
  },

  tableSection: {
    background: "#fff",
    borderRadius: "1rem",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px 0 rgba(224, 231, 255, 0.2)",
    padding: "1.5rem",
    marginTop: "1.5rem",
    overflowX: "auto",
  },

  tableTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "1rem",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeader: {
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    padding: "0.75rem 1rem",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
  },

  tableCell: {
    color: "#334155",
    fontSize: "0.95rem",
    padding: "0.75rem 1rem",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
  },

  tableRow: {
    transition: "background-color 0.2s",
  },

  tableRowHover: {
    backgroundColor: "#f8fafc",
  },

  tableRowLast: {
    borderBottom: "none",
  },

  progressBar: {
    background: "#e0e7ff",
    borderRadius: "9999px",
    height: "0.5rem",
    position: "relative",
    overflow: "hidden",
    width: "100%",
  },

  progressBarInner: {
    background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.3s ease-in-out",
  },

  statusBadge: {
    padding: "0.25rem 0.5rem",
    borderRadius: "0.375rem",
    fontSize: "0.75rem",
    fontWeight: "500",
    display: "inline-block",
  },

  statusSuccess: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },

  statusError: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },

  statusWarning: {
    backgroundColor: "#fefce8",
    color: "#ca8a04",
    border: "1px solid #fef3c7",
  },

  errorPanel: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "0.75rem",
    padding: "1rem",
    marginTop: "1rem",
  },

  errorTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },

  errorMessage: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },

  updateInfo: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.95rem",
    marginTop: "1rem",
    fontStyle: "italic",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem",
  },

  loadingSpinner: {
    width: "2rem",
    height: "2rem",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },

  loadingText: {
    color: "#64748b",
    fontSize: "1rem",
  },

  refreshButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  refreshButtonHover: {
    backgroundColor: "#4f46e5",
  },

  emptyState: {
    textAlign: "center",
    padding: "3rem",
    color: "#64748b",
  },

  emptyStateIcon: {
    fontSize: "3rem",
    opacity: 0.3,
    marginBottom: "1rem",
  },

  emptyStateText: {
    fontSize: "1.125rem",
    marginBottom: "0.5rem",
  },

  emptyStateSubtext: {
    fontSize: "0.875rem",
    color: "#94a3b8",
  },
};
