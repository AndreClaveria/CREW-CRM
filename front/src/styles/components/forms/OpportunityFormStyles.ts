// /styles/components/forms/OpportunityFormStyles.ts
export const opportunityFormStyles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    fontSize: "var(--font-size-normal)",
    color: "var(--color-grey-600)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-big)",
  },

  title: {
    fontSize: "var(--font-size-big)",
    margin: "0 0 4px 0",
    fontWeight: "var(--font-weight-bold)",
  },

  subTitle: {
    fontSize: "var(--font-size-normal)",
    color: "var(--color-grey-600)",
    margin: "0",
  },

  backButton: {
    padding: "10px 20px",
    background: "var(--color-neutral)",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
  },

  errorMessage: {
    padding: "12px 16px",
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
    border: "var(--border-width) solid var(--color-error-dark)",
  },

  successMessage: {
    padding: "12px 16px",
    backgroundColor: "var(--color-success-light)",
    color: "var(--color-success-dark)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
    border: "var(--border-width) solid var(--color-success-dark)",
  },

  // Stepper styles
  stepperContainer: {
    marginBottom: "30px",
  },

  stepperSteps: {
    display: "flex",
    justifyContent: "space-between",
    position: "relative" as const,
    marginBottom: "10px",
  },

  stepperLine: {
    position: "absolute" as const,
    top: "50%",
    transform: "translateY(-50%)",
    height: "var(--border-big-width)",
    background: "var(--color-grey-300)",
    width: "100%",
    zIndex: 0,
  },

  stepperStep: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    position: "relative" as const,
    zIndex: 1,
  },

  stepperCircle: {
    width: "30px",
    height: "30px",
    borderRadius: "var(--border-circle-radius)",
    background: "var(--color-white)",
    border: "var(--border-big-width) solid var(--color-grey-500)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "8px",
    color: "var(--color-grey-600)",
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
  },

  stepperActiveCircle: {
    border: "var(--border-big-width) solid #3498DB",
    color: "#3498DB",
  },

  stepperCompletedCircle: {
    border: "var(--border-big-width) solid var(--color-green)",
    background: "var(--color-green)",
    color: "var(--color-white)",
  },

  stepperLabel: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-grey-600)",
    fontWeight: "var(--font-weight-regular)",
    transition: "var(--animation-transition)",
  },

  stepperActiveLabel: {
    color: "#3498DB",
    fontWeight: "var(--font-weight-bold)",
  },

  stepperProgressBar: {
    height: "4px",
    backgroundColor: "var(--color-grey-300)",
    borderRadius: "var(--border-small-radius)",
    overflow: "hidden",
  },

  stepperProgress: {
    height: "100%",
    backgroundColor: "#3498DB",
    borderRadius: "var(--border-small-radius)",
    transition: "width 0.3s ease",
  },

  // Section styles
  container: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "var(--spacing-normal)",
  },

  sectionContainer: {
    marginBottom: "30px",
  },

  sectionTitle: {
    fontSize: "var(--font-size-medium)",
    fontWeight: "var(--font-weight-bold)",
    marginTop: "0",
    marginBottom: "var(--spacing-normal)",
  },

  subSectionTitle: {
    fontSize: "var(--font-size-medium)",
    fontWeight: "var(--font-weight-medium)",
    marginTop: "0",
    marginBottom: "var(--spacing-normal)",
    color: "var(--color-text)",
  },

  formGroup: {
    marginBottom: "var(--spacing-normal)",
  },

  label: {
    display: "block",
    marginBottom: "var(--spacing-small)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text)",
  },

  required: {
    color: "var(--color-red)",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
  },

  select: {
    width: "100%",
    padding: "10px 12px",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
  },

  helperText: {
    display: "block",
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    marginTop: "4px",
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  checkbox: {
    marginRight: "var(--spacing-small)",
  },

  checkboxLabel: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text)",
  },

  // Slider styles
  sliderContainer: {
    marginTop: "12px",
  },

  slider: {
    width: "100%",
    margin: "0",
  },

  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "4px",
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
  },

  // Product section styles
  productListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-normal)",
  },

  addButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
  },

  emptyState: {
    padding: "var(--spacing-big)",
    textAlign: "center" as const,
    backgroundColor: "var(--color-neutral)",
    borderRadius: "var(--border-small-radius)",
    color: "var(--color-grey-600)",
  },

  productCard: {
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
    border: "var(--border-width) solid var(--color-grey-400)",
  },

  productCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  productTitle: {
    margin: "0",
    fontSize: "var(--font-size-normal)",
    fontWeight: "var(--font-weight-medium)",
  },

  removeButton: {
    padding: "4px 8px",
    backgroundColor: "var(--color-red)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontSize: "var(--font-size-small-small)",
    transition: "var(--animation-transition)",
  },

  productFormGroup: {
    marginBottom: "12px",
  },

  productRow: {
    display: "flex",
    gap: "var(--spacing-normal)",
  },

  productTotal: {
    padding: "10px 12px",
    backgroundColor: "var(--color-grey-200)",
    borderRadius: "var(--border-small-radius)",
    fontWeight: "var(--font-weight-bold)",
  },

  totalSection: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "var(--spacing-normal)",
    padding: "12px 16px",
    backgroundColor: "var(--color-success-light)",
    borderRadius: "var(--border-small-radius)",
  },

  totalLabel: {
    fontWeight: "var(--font-weight-bold)",
    marginRight: "12px",
  },

  totalValue: {
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--font-size-medium)",
    color: "var(--color-success-dark)",
  },

  // Contact section styles
  contactsContainer: {
    marginTop: "var(--spacing-normal)",
    maxHeight: "300px",
    overflowY: "auto" as const,
    padding: "4px",
  },

  contactCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "var(--border-small-radius)",
    border: "var(--border-width) solid var(--color-grey-400)",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  },

  contactCardSelected: {
    backgroundColor: "var(--table-row-selected-bg)",
    borderColor: "var(--color-blue)",
  },

  contactCheckbox: {
    marginRight: "12px",
  },

  contactInfo: {
    flex: "1",
  },

  contactName: {
    fontWeight: "var(--font-weight-bold)",
    marginBottom: "4px",
  },

  contactPosition: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    marginBottom: "2px",
  },

  contactEmail: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
  },

  noResults: {
    padding: "12px",
    textAlign: "center" as const,
    color: "var(--color-grey-600)",
    fontStyle: "italic",
  },

  selectedSummary: {
    marginTop: "var(--spacing-normal)",
    fontSize: "var(--font-size-small)",
    color: "var(--color-blue)",
    fontWeight: "var(--font-weight-medium)",
  },

  // Navigation buttons
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "var(--spacing-big)",
  },

  prevButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-neutral)",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
  },

  nextButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
  },

  submitStepperButton: {
    padding: "12px 32px",
    backgroundColor: "#3498DB",
    border: "none",
    color: "#ffffff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#2980B9",
    },
  },

  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "var(--color-neutral)",
    border: "var(--border-width) solid var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
  },

  // Summary styles
  summaryContainer: {
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-radius)",
    padding: "var(--spacing-normal)",
    marginBottom: "var(--spacing-normal)",
  },

  summarySection: {
    marginBottom: "var(--spacing-normal)",
  },

  summarySectionTitle: {
    fontSize: "var(--font-size-normal)",
    fontWeight: "var(--font-weight-bold)",
    marginTop: "0",
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: "var(--border-width) solid var(--color-grey-400)",
  },

  summaryItem: {
    display: "flex",
    marginBottom: "8px",
  },

  summaryLabel: {
    flex: "0 0 150px",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-grey-600)",
  },

  summaryValue: {
    flex: "1",
  },

  summaryContactItem: {
    backgroundColor: "var(--color-grey-200)",
    borderRadius: "var(--border-small-radius)",
    padding: "12px",
    marginBottom: "12px",
  },

  summaryPrimaryContact: {
    display: "inline-block",
    padding: "4px 8px",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small-small)",
    marginTop: "8px",
  },
} as const;
