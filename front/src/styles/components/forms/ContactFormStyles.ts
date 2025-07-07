// /styles/components/form/ContactStyles.ts

export const contactStyles = {
  container: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    marginBottom: "var(--spacing-big)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-normal)",
  },
  title: {
    fontSize: "var(--font-size-medium)",
    margin: 0,
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
  },
  noContactsMessage: {
    color: "var(--color-grey-600)",
    fontStyle: "italic",
  },
  maxContactsWarning: {
    color: "var(--color-warning)",
    marginBottom: "var(--spacing-normal)",
  },
  contactItem: {
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-radius)",
    padding: "var(--spacing-normal)",
    marginBottom: "var(--spacing-normal)",
  },
  contactHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "var(--spacing-normal)",
  },
  contactTitle: {
    fontSize: "var(--font-size-normal)",
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-red)",
    color: "var(--color-text)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-normal)",
  },
  formGroup: {
    marginBottom: "var(--spacing-normal)",
  },
  flexRow: {
    display: "flex",
    gap: "var(--spacing-normal)",
    marginBottom: "var(--spacing-normal)",
  },
  flexColumn: {
    flex: 1,
  },
  label: {
    display: "block",
    marginBottom: "var(--spacing-small)",
    color: "var(--color-text)",
  },
  requiredField: {
    color: "var(--color-red)",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-normal)",
    transition: "var(--animation-transition)",
    "&:focus": {
      borderColor: "var(--color-blue)",
      outline: "none",
    },
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-normal)",
    resize: "vertical" as const,
    minHeight: "100px",
    transition: "var(--animation-transition)",
    "&:focus": {
      borderColor: "var(--color-blue)",
      outline: "none",
    },
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-small)",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--spacing-normal)",
    marginTop: "var(--spacing-normal)",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#E9C46A",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontSize: "var(--font-size-normal)",
    fontWeight: "var(--font-weight-medium)",
    transition: "var(--animation-transition)",
    "&:hover": {
      backgroundColor: "var(--color-blue-dark)",
    },
  },
  errorMessage: {
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    padding: "var(--spacing-normal)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
  },
  successMessage: {
    backgroundColor: "var(--color-success-light)",
    color: "var(--color-success-dark)",
    padding: "var(--spacing-normal)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
  },
  loadingMessage: {
    textAlign: "center" as const,
    padding: "var(--spacing-big)",
    color: "var(--color-grey-600)",
  },
  displayField: {
    padding: "8px 12px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#333",
  },
};
