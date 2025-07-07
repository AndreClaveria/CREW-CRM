export const opportunityBoardStyles = {
  container: {
    padding: "20px",
    width: "100%",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px 0",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    padding: "6px 12px",
    backgroundColor: "#3498DB",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    "&:hover": {
      backgroundColor: "#2980B9",
    },
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#E74C3C",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    "&:hover": {
      backgroundColor: "#C0392B",
    },
  },
  cardContent: {
    color: "#666",
  },
  description: {
    marginBottom: "15px",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  details: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  detail: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },
  label: {
    color: "#666",
    fontWeight: "500",
  },
  value: {
    color: "#333",
    fontWeight: "600",
  },
}; 