export const userDashboardStyles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "var(--spacing-normal)",
  },
  card: {
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "var(--font-size-big)",
    marginBottom: "var(--spacing-normal)",
  },
  cardTitle: {
    fontSize: "var(--font-size-medium)",
    marginBottom: "15px",
  },
};
