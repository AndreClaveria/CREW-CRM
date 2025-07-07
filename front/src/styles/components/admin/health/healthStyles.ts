export const healthStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "var(--spacing-big)",
    maxWidth: "1200px",
    margin: "0 auto",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-big)",
    paddingBottom: "var(--spacing-normal)",
    borderBottom: "var(--border-width) solid var(--table-border)",
  },

  title: {
    fontSize: "var(--font-size-big)",
    color: "var(--color-text)",
    margin: 0,
  },

  actions: {
    display: "flex",
    gap: "var(--spacing-small)",
  },
  reply: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
  },
  refreshButton: {
    padding: "10px 16px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small)",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  },

  statusOverview: {
    marginBottom: "var(--spacing-big)",
  },

  overviewCard: {
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "var(--border-width) solid var(--table-border)",
  },

  lastUpdated: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    marginTop: "var(--spacing-small)",
  },

  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "var(--spacing-big)",
  },

  serviceCard: {
    padding: "var(--spacing-normal)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "var(--border-width) solid var(--table-border)",
    transition: "var(--animation-transition)",
  },
  serviceInfo: {
    padding: "var(--spacing-normal)",
    borderRadius: "var(--border-radius)",
    transition: "var(--animation-transition)",
  },

  serviceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    paddingBottom: "var(--spacing-small)",
    borderBottom: "var(--border-width) solid var(--table-border)",
  },

  statusBadge: {
    fontSize: "var(--font-size-small-small)",
    fontFamily: "var(--font-second-bold)",
    padding: "4px 8px",
    borderRadius: "var(--border-small-radius)",
    display: "inline-block",
  },

  statusUp: {
    backgroundColor: "var(--color-success-light)",
    color: "var(--color-success-dark)",
    border: "var(--border-width) solid var(--color-success-dark)",
  },

  statusDown: {
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    border: "var(--border-width) solid var(--color-error-dark)",
  },

  serviceDetails: {
    fontSize: "var(--font-size-small)",
    fontFamily: "var(--font-second-regular)",
  },

  errorDetails: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "var(--color-error-light)",
    borderRadius: "var(--border-small-radius)",
    color: "var(--color-error-dark)",
  },

  timestamp: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--spacing-big)",
  },

  loadingSpinner: {
    width: "32px",
    height: "32px",
    border: "4px solid var(--color-grey-400)",
    borderTop: "4px solid var(--color-blue)",
    borderRadius: "var(--border-circle-radius)",
    animation: "spin 1s linear infinite",
    marginBottom: "var(--spacing-normal)",
  },

  errorPanel: {
    padding: "var(--spacing-normal)",
    marginBottom: "var(--spacing-big)",
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    borderRadius: "var(--border-small-radius)",
    border: "var(--border-width) solid var(--color-error-dark)",
  },
};
