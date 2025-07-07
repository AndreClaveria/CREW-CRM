// /styles/components/form/TeamFormStyles.ts

export const teamFormStyles = {
  container: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-normal)",
  },
  title: {
    fontSize: "var(--font-size-big)",
    marginBottom: "var(--spacing-small)",
  },
  subTitle: {
    color: "var(--color-grey-600)",
  },
  backButton: {
    padding: "10px 16px",
    backgroundColor: "var(--color-neutral)",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
  },
  errorMessage: {
    padding: "12px",
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
  },
  successMessage: {
    padding: "12px",
    backgroundColor: "var(--color-success-light)",
    color: "var(--color-success-dark)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
  },
  section: {
    marginBottom: "var(--spacing-normal)",
  },
  sectionTitle: {
    fontSize: "var(--font-size-medium)",
    marginBottom: "var(--spacing-normal)",
  },
  formGroup: {
    marginBottom: "var(--spacing-normal)",
  },
  label: {
    display: "block",
    marginBottom: "var(--spacing-small)",
  },
  requiredField: {
    color: "var(--color-red)",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    resize: "vertical" as const,
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
  },
  helperText: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-grey-600)",
    marginTop: "4px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "var(--spacing-small)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--spacing-normal)",
    marginTop: "var(--spacing-big)",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-neutral)",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontWeight: "var(--font-weight-medium)",
  },
};
