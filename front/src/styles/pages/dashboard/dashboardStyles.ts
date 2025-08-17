export const dashboardStyles = {
  container: {
    display: "flex",
    width: "100%",
    margin: 0,
    padding: 0,
    position: "relative",
    minHeight: "100vh", // Utiliser minHeight au lieu de height fixe
    overflowY: "visible", // Permettre le défilement vertical
  },
  sidebar: {
    width: "80px",
    backgroundColor: "var(--color-main)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    paddingTop: "var(--spacing-normal)",
    paddingBottom: "var(--spacing-normal)",
    color: "var(--color-white)",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    position: "fixed" as const, // Modifié en fixed pour rester visible pendant le défilement
    zIndex: 10,
    height: "100vh",
    top: 0,
    left: 0,
  },
  navigation: {
    width: "180px",
    backgroundColor: "var(--color-grey-100)",
    padding: "var(--spacing-normal) 0",
    paddingTop: "8rem", // Espace pour aligner avec l'icône
    margin: 0,
    transition: "var(--animation-transition)",
    position: "fixed" as const, // Modifié en fixed pour rester visible pendant le défilement
    left: "80px",
    top: 0,
    height: "100vh",
    zIndex: 5,
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
    overflowY: "auto" as const, // Permettre le défilement de la navigation
  },
  navigationHidden: {
    display: "none",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-grey-600)",
    transition: "var(--animation-transition-time)",
    borderLeft: "3px solid transparent",
  },
  navItemActive: {
    borderLeft: "3px solid var(--color-blue)",
    color: "var(--color-main)",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  content: {
    flex: 1,
    padding: "var(--spacing-big)",
    backgroundColor: "var(--color-white)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    margin: 0,
    transition: "margin-left var(--animation-transition-time)",
    marginLeft: "80px",
    width: "calc(100% - 80px)",
    minHeight: "100vh",
    height: "auto",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  contentWithMenu: {
    marginLeft: "260px", // 80px (sidebar) + 180px (navigation)
    width: "calc(100% - 260px)",
  },
  contentFullWidth: {
    marginLeft: "80px",
    width: "calc(100% - 80px)",
  },
  welcomeCard: {
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-radius)",
    padding: "var(--spacing-big)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "var(--spacing-big)",
    width: "100%",
  },
  welcomeTitle: {
    fontSize: "var(--font-size-big)",
    fontWeight: "var(--font-weight-bold)",
    marginBottom: "0.5rem",
    color: "var(--color-text)",
  },
  welcomeText: {
    color: "var(--color-grey-600)",
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
  },
  logoContainer: {
    marginBottom: "var(--spacing-big)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "60px",
    height: "60px",
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: "var(--border-circle-radius)",
    objectFit: "contain" as const,
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60px",
    height: "60px",
    marginBottom: "var(--spacing-normal)",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  },
  iconButtonActive: {
    backgroundColor: "var(--color-grey-600)",
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    position: "absolute",
    top: "var(--spacing-normal)",
    right: "var(--spacing-normal)",
    backgroundColor: "var(--color-red)",
    color: "var(--color-white)",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "var(--border-small-radius)",
    cursor: "pointer",
    transition: "var(--animation-transition)",
    fontSize: "var(--font-size-normal)",
    fontWeight: "var(--font-weight-medium)",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "var(--color-grey-100)",
    fontSize: "1.25rem",
    color: "var(--color-grey-600)",
  },
  svgIcon: {
    width: "28px",
    height: "28px",
  },
  menuToggle: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  // Styles pour les menus spécifiques aux icônes
  navigationDashboard: {
    display: "none", // Caché par défaut, sera affiché au survol
  },
  navigationPhone: {
    display: "none",
  },
  navigationEmail: {
    display: "none",
  },
  navigationCalendar: {
    display: "none",
  },
  // Styles pour quand les menus sont visibles
  navigationDashboardVisible: {
    display: "block",
  },
  navigationPhoneVisible: {
    display: "block",
  },
  navigationEmailVisible: {
    display: "block",
  },
  navigationCalendarVisible: {
    display: "block",
  },
  // Styles additionnels pour la solution de défilement
  globalContainer: {
    display: "flex",
    width: "100%",
    position: "relative" as const,
    margin: 0,
    padding: 0,
    minHeight: "100vh",
  },
  fixedSidebar: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "80px",
    height: "100vh",
    zIndex: 10,
    backgroundColor: "var(--color-main)",
    overflow: "visible",
  },
  contentArea: {
    marginLeft: "80px",
    width: "calc(100% - 80px)",
    padding: "var(--spacing-big)",
    overflowY: "auto" as const,
    height: "auto",
    minHeight: "100vh",
    boxSizing: "border-box" as const,
  },
} as const;
