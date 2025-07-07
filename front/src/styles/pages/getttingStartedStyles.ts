// styles/gettingStartedStyles.ts

export const gettingStartedStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "3rem var(--spacing-normal)",
    backgroundColor: "var(--color-grey-100)",
  },

  formWrapper: {
    width: "100%",
    maxWidth: "28rem",
    margin: "0 auto",
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },

  logo: {
    borderRadius: "var(--border-circle-radius)",
    objectFit: "cover" as const,
  },

  title: {
    fontSize: "var(--font-size-big)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
    textAlign: "center" as const,
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },

  subtitle: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-grey-600)",
    textAlign: "center" as const,
    marginBottom: "var(--spacing-big)",
  },

  form: {
    marginTop: "var(--spacing-big)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },

  inputGroup: {
    marginBottom: "var(--spacing-normal)",
  },

  label: {
    display: "block",
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text)",
    marginBottom: "0.5rem",
  },

  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "var(--border-small-radius)",
    border: "var(--border-width) solid var(--color-grey-400)",
    backgroundColor: "var(--color-white)",
    color: "var(--color-text)",
    fontSize: "var(--font-size-small)",
    outline: "none",
    transition: "var(--animation-transition)",
  },

  inputFocus: {
    borderColor: "var(--color-blue)",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },

  errorContainer: {
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    padding: "0.75rem",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
    fontSize: "var(--font-size-small)",
    textAlign: "center" as const,
  },

  captchaContainer: {
    padding: "var(--spacing-normal)",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    backgroundColor: "var(--color-grey-100)",
    marginBottom: "var(--spacing-normal)",
  },

  captchaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },

  captchaTitle: {
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text)",
  },

  captchaButton: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.75rem",
    borderRadius: "var(--border-small-radius)",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    fontSize: "var(--font-size-small-small)",
    fontWeight: "var(--font-weight-medium)",
    border: "none",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  },

  captchaButtonHover: {
    backgroundColor: "var(--color-blue)",
    opacity: "var(--opacity-less)",
  },

  captchaPlaceholder: {
    height: "4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-grey-300)",
    color: "var(--color-grey-600)",
    fontSize: "var(--font-size-small)",
    marginTop: "0.5rem",
  },

  captchaInfo: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    marginTop: "0.25rem",
  },

  submitButton: {
    position: "relative" as const,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    fontWeight: "var(--font-weight-medium)",
    fontSize: "var(--font-size-small)",
    borderRadius: "var(--border-small-radius)",
    border: "none",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  },

  submitButtonHover: {
    backgroundColor: "var(--color-blue)",
    opacity: "var(--opacity-less)",
  },

  submitButtonDisabled: {
    opacity: "var(--opacity-less)",
    cursor: "not-allowed",
  },

  spinner: {
    position: "absolute" as const,
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    width: "1.25rem",
    height: "1.25rem",
  },
};
