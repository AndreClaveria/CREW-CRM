export const profileModalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "var(--z-index-top)",
  },

  modalContainer: {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-big-radius)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottomWidth: "var(--border-width)",
    borderBottomStyle: "solid" as const,
    borderBottomColor: "var(--table-border)",
  },

  modalTitle: {
    fontSize: "var(--font-size-big)",
    fontFamily: "var(--font-second-bold)",
    color: "var(--color-text)",
    margin: 10,
  },

  closeButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    borderRadius: "var(--border-circle-radius)",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonHover: {
    backgroundColor: "var(--color-grey-100)",
  },

  contentContainer: {
    display: "flex",
    height: "100%",
  },

  tabButton: {
    width: "100%",
    padding: "14px 16px",
    textAlign: "left" as const,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "var(--animation-transition)",
  },

  tabButtonActive: {
    backgroundColor: "var(--table-row-selected-bg)",
    borderLeftWidth: "3px",
    borderLeftStyle: "solid" as const,
    borderLeftColor: "var(--color-blue)",
  },

  mainContent: {
    width: "67%",
    padding: "var(--spacing-big) 30px",
    overflowY: "auto" as const,
  },

  inputField: {
    width: "85%",
    padding: "10px 12px",
    borderWidth: "var(--border-width)",
    borderStyle: "solid",
    borderColor: "var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small)",
    transition: "var(--animation-transition)",
    outline: "none",
  },

  buttonPrimary: {
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: "var(--border-small-radius)",
    padding: "12px 20px",
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
    cursor: "pointer",
    transition: "var(--animation-transition)",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    minWidth: "140px",
  },

  sidebar: {
    width: "33%",
    borderRightWidth: "var(--border-width)",
    borderRightStyle: "solid" as const,
    borderRightColor: "var(--table-border)",
    backgroundColor: "var(--color-grey-100)",
  },

  tabIconContainer: {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
  },

  h3: {
    fontFamily: "var(--font-second-regular)",
    fontSize: "var(--font-size-normal)",
    color: "var(--color-text)",
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
  },

  avatar: {
    width: "88px",
    height: "88px",
    borderRadius: "var(--border-circle-radius)",
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontFamily: "var(--font-second-bold)",
    marginRight: "var(--spacing-big)",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },

  profileInfo: {
    display: "flex" as const,
    flexDirection: "column" as const,
  },

  h2: {
    fontSize: "var(--font-size-big)",
    fontFamily: "var(--font-second-bold)",
    color: "var(--color-text)",
    margin: "0 0 6px 0",
  },

  roleBadge: {
    display: "inline-block",
    backgroundColor: "var(--table-row-selected-bg)",
    color: "var(--color-blue)",
    padding: "4px 10px",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small-small)",
    fontFamily: "var(--font-second-bold)",
  },

  formField: {
    marginTop: "15px",
    marginBottom: "var(--spacing-big)",
  },

  fieldLabel: {
    display: "block",
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    marginBottom: "6px",
    fontFamily: "var(--font-second-bold)",
  },

  fieldValue: {
    fontSize: "var(--font-size-normal)",
    color: "var(--color-text)",
    padding: "4px 0",
    fontFamily: "var(--font-second-regular)",
  },

  languageContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
    marginBottom: "15px",
  },

  select: {
    padding: "10px 12px",
    borderWidth: "var(--border-width)",
    borderStyle: "solid",
    borderColor: "var(--color-grey-400)",
    borderRadius: "var(--border-small-radius)",
    marginRight: "10px",
    fontSize: "var(--font-size-small)",
    minWidth: "150px",
    outline: "none",
  },

  button: {
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: "var(--border-small-radius)",
    padding: "10px 20px",
    fontSize: "var(--font-size-small)",
    fontFamily: "var(--font-second-regular)",
    cursor: "pointer",
    marginLeft: "8px",
    transition: "var(--animation-transition)",
  },

  p: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    fontFamily: "var(--font-second-regular)",
  },

  info: {
    marginTop: "30px",
    padding: "12px",
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-small-radius)",
  },

  error: {
    backgroundColor: "var(--color-error-light)",
    color: "var(--color-error-dark)",
    padding: "10px 12px",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
  },

  sucess: {
    backgroundColor: "var(--color-success-light)",
    color: "var(--color-success-dark)",
    padding: "10px 12px",
    borderRadius: "var(--border-small-radius)",
    marginBottom: "var(--spacing-normal)",
  },

  errorStateModalContainer: {
    maxHeight: "85vh",
    minHeight: "540px",
  },

  errorStateMainContent: {
    minHeight: "450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  errorStateBox: {
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-error-light)",
    borderRadius: "var(--border-radius)",
    maxWidth: "400px",
    textAlign: "center" as const,
  },

  errorStateTitle: {
    color: "var(--color-error-dark)",
    marginBottom: "12px",
  },

  errorStateText: {
    marginBottom: "var(--spacing-normal)",
  },

  errorStateButton: {
    backgroundColor: "var(--color-blue)",
    color: "var(--color-white)",
    borderWidth: 0,
    padding: "10px 20px",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
  },
} as const;
