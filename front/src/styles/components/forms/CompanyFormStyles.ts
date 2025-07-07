// /styles/components/form/CompanyFormStyles.ts

export const companyFormStyles = {
  container: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition:
      "background-color var(--animation-transition-time), box-shadow var(--animation-transition-time)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-normal)",
  },
  title: {
    fontSize: "var(--font-size-big)",
    color: "var(--color-text)",
    transition: "color var(--animation-transition-time)",
  },
  backButton: {
    padding: "10px 16px",
    backgroundColor: "var(--color-neutral)",
    color: "var(--color-text)",
    border: `var(--border-width) solid var(--color-grey-400)`,
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    transition:
      "var(--animation-transition), background-color var(--animation-transition-time), color var(--animation-transition-time), border-color var(--animation-transition-time)",
  },
  backButtonHover: {
    backgroundColor: "var(--color-grey-200)",
  },
  errorMessage: {
    padding: "12px",
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
    transition:
      "background-color var(--animation-transition-time), color var(--animation-transition-time)",
  },
  successMessage: {
    padding: "12px",
    backgroundColor: "var(--color-success-light)",
    color: "var(--color-success-dark)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
    transition:
      "background-color var(--animation-transition-time), color var(--animation-transition-time)",
  },
  section: {
    marginBottom: "var(--spacing-normal)",
  },
  sectionTitle: {
    fontSize: "var(--font-size-medium)",
    marginBottom: "var(--spacing-small)",
    color: "var(--color-text)",
    transition: "color var(--animation-transition-time)",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--spacing-normal)",
  },
  threeColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "var(--spacing-normal)",
  },
  formGroup: {
    marginBottom: "var(--spacing-normal)",
  },
  formGroupMt: {
    marginTop: "var(--spacing-normal)",
  },
  label: {
    display: "block",
    marginBottom: "var(--spacing-small)",
    color: "var(--color-text)",
    fontWeight: "var(--font-weight-medium)",
    transition: "color var(--animation-transition-time)",
  },
  requiredField: {
    color: "var(--color-error-dark)",
    marginLeft: "4px",
    transition: "color var(--animation-transition-time)",
  },
  input: {
    width: "100%",
    padding: "var(--spacing-small)",
    backgroundColor: "var(--color-white)",
    color: "var(--color-text)",
    border: `var(--border-width) solid var(--color-grey-400)`,
    borderRadius: "var(--border-small-radius)",
    transition:
      "var(--animation-transition), background-color var(--animation-transition-time), color var(--animation-transition-time), border-color var(--animation-transition-time)",
  },
  inputFocus: {
    borderColor: "var(--color-blue)",
    boxShadow: "0 0 0 3px rgba(23, 89, 182, 0.1)",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "var(--spacing-small)",
    backgroundColor: "var(--color-white)",
    color: "var(--color-text)",
    border: `var(--border-width) solid var(--color-grey-400)`,
    borderRadius: "var(--border-small-radius)",
    resize: "vertical" as const,
    minHeight: "100px",
    transition:
      "var(--animation-transition), background-color var(--animation-transition-time), color var(--animation-transition-time), border-color var(--animation-transition-time)",
  },
  textareaFocus: {
    borderColor: "var(--color-blue)",
    boxShadow: "0 0 0 3px rgba(23, 89, 182, 0.1)",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "var(--spacing-small)",
    backgroundColor: "var(--color-white)",
    color: "var(--color-text)",
    border: `var(--border-width) solid var(--color-grey-400)`,
    borderRadius: "var(--border-small-radius)",
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: "30px",
    transition:
      "var(--animation-transition), background-color var(--animation-transition-time), color var(--animation-transition-time), border-color var(--animation-transition-time)",
  },
  selectFocus: {
    borderColor: "var(--color-blue)",
    boxShadow: "0 0 0 3px rgba(23, 89, 182, 0.1)",
    outline: "none",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "var(--spacing-small)",
  },
  checkbox: {
    marginRight: "var(--spacing-small)",
    accentColor: "var(--color-blue)",
    width: "18px",
    height: "18px",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  },
  checkboxLabel: {
    color: "var(--color-text)",
    cursor: "pointer",
    transition: "color var(--animation-transition-time)",
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
    color: "var(--color-text)",
    border: `var(--border-width) solid var(--color-grey-400)`,
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontWeight: "var(--font-weight-medium)",
    transition:
      "var(--animation-transition), background-color var(--animation-transition-time), color var(--animation-transition-time), border-color var(--animation-transition-time)",
  },
  cancelButtonHover: {
    backgroundColor: "var(--color-grey-200)",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontWeight: "var(--font-weight-medium)",
    transition:
      "var(--animation-transition), background-color var(--animation-transition-time)",
  },
  submitButtonHover: {
    backgroundColor: "rgba(23, 89, 182, 0.9)",
  },
  submitButtonDisabled: {
    backgroundColor: "var(--color-grey-400)",
    cursor: "not-allowed",
    opacity: "0.7",
  },
  helperText: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-grey-600)",
    marginTop: "calc(var(--spacing-small) / 2)",
    transition: "color var(--animation-transition-time)",
  },
  fieldError: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-error-dark)",
    marginTop: "calc(var(--spacing-small) / 2)",
    transition: "color var(--animation-transition-time)",
  },
  inputError: {
    borderColor: "var(--color-error-dark)",
  },
  infoText: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-grey-600)",
    marginBottom: "var(--spacing-normal)",
    fontStyle: "italic",
    transition: "color var(--animation-transition-time)",
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--color-grey-400)",
    margin: "var(--spacing-normal) 0",
    transition: "background-color var(--animation-transition-time)",
  },
  // Groupe d'inputs en ligne (ex: préfixe téléphonique)
  inputGroup: {
    display: "flex",
    alignItems: "center",
  },
  inputGroupPrefix: {
    padding: "var(--spacing-small)",
    backgroundColor: "var(--color-grey-200)",
    color: "var(--color-text)",
    border: `var(--border-width) solid var(--color-grey-400)`,
    borderRight: "none",
    borderRadius: `var(--border-small-radius) 0 0 var(--border-small-radius)`,
    transition:
      "background-color var(--animation-transition-time), color var(--animation-transition-time), border-color var(--animation-transition-time)",
  },
  inputGroupInput: {
    borderRadius: `0 var(--border-small-radius) var(--border-small-radius) 0`,
    flexGrow: 1,
  },
};
