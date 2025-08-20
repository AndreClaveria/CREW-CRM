export const dashboardStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: 0,
    padding: 0,
    position: "relative",
    minHeight: "100vh",
    overflowY: "visible",
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
  // Nouveaux styles pour les dashboards
  dashboardGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-big)",
    width: "100%",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "var(--spacing-normal)",
    marginBottom: "var(--spacing-big)",
  },
  statCard: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
    border: "1px solid var(--color-grey-200)",
  },
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
    margin: "0 0 0.5rem 0",
  },
  statLabel: {
    fontSize: "var(--font-size-normal)",
    color: "var(--color-text-secondary)",
    margin: 0,
    fontWeight: "var(--font-weight-medium)",
  },
  sectionTitle: {
    fontSize: "var(--font-size-big)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
    marginBottom: "var(--spacing-normal)",
    borderBottom: "2px solid var(--color-grey-200)",
    paddingBottom: "0.5rem",
  },
  // Styles pour l'activité récente
  activitySection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
  },
  activityList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-normal)",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-normal)",
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-50)",
    borderRadius: "var(--border-small-radius)",
  },
  activityIcon: {
    fontSize: "1.5rem",
    minWidth: "2rem",
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    margin: "0 0 0.25rem 0",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text)",
  },
  activityTime: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-grey-500)",
  },
  // Styles pour les actions
  actionsSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
  },
  actionList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-normal)",
  },
  actionItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-normal)",
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-50)",
    borderRadius: "var(--border-small-radius)",
    justifyContent: "space-between",
  },
  actionPriority: {
    fontSize: "1.25rem",
  },
  actionDate: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-grey-500)",
    fontWeight: "var(--font-weight-medium)",
  },
  // Styles pour le dashboard manager
  teamSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
  },
  teamTable: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "var(--spacing-normal)",
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-small-radius)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "var(--spacing-normal)",
    padding: "var(--spacing-normal)",
    borderBottom: "1px solid var(--color-grey-200)",
    alignItems: "center",
  },
  memberName: {
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text)",
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "var(--border-small-radius)",
    color: "var(--color-white)",
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
    textTransform: "capitalize" as const,
  },
  // Styles pour le pipeline
  pipelineSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
  },
  pipelineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "var(--spacing-normal)",
  },
  pipelineCard: {
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-50)",
    borderRadius: "var(--border-small-radius)",
    border: "1px solid var(--color-grey-200)",
  },
  pipelineStage: {
    margin: "0 0 var(--spacing-normal) 0",
    fontSize: "var(--font-size-normal)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
    textAlign: "center",
  },
  pipelineStats: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  pipelineStat: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center",
  },
  pipelineNumber: {
    fontSize: "var(--font-size-big)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
  },
  pipelineLabel: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text-secondary)",
  },
  // Styles pour les alertes
  alertsSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
  },
  alertsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-normal)",
  },
  alertItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-normal)",
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-50)",
    borderRadius: "var(--border-small-radius)",
    borderLeft: "4px solid var(--color-orange)",
  },
  alertIcon: {
    fontSize: "1.25rem",
  },
  // Styles pour l'indicateur de rôle
  roleIndicator: {
    marginTop: "var(--spacing-normal)",
    display: "flex",
    justifyContent: "flex-start",
  },
  roleBadge: {
    backgroundColor: "var(--color-main)",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  // Styles pour les graphiques
  chartSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-normal)",
  },
  chartItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  chartLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
  },
  chartValue: {
    color: "var(--color-text)",
    fontWeight: "var(--font-weight-bold)",
  },
  chartBar: {
    height: "8px",
    backgroundColor: "var(--color-grey-200)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  chartBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  // Style pour la grille des graphiques
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "var(--spacing-big)",
  },
  // Styles pour le sélecteur de rôle
  roleSelector: {
    display: "flex",
    gap: "var(--spacing-normal)",
    marginTop: "var(--spacing-normal)",
    flexWrap: "wrap",
  },
  roleButton: {
    padding: "0.75rem 1.5rem",
    borderRadius: "var(--border-small-radius)",
    border: "none",
    cursor: "pointer",
    fontSize: "var(--font-size-normal)",
    fontWeight: "var(--font-weight-medium)",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  // Nouveaux styles pour le design cohérent
  statsSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
    marginBottom: "var(--spacing-big)",
  },

  chartsSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
    marginBottom: "var(--spacing-big)",
  },

  dealsSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
    marginBottom: "var(--spacing-big)",
  },

  financialSection: {
    backgroundColor: "var(--color-white)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid var(--color-grey-200)",
    marginBottom: "var(--spacing-big)",
  },

  dealsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "var(--spacing-normal)",
  },

  dealCard: {
    backgroundColor: "var(--color-grey-50)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-small-radius)",
    border: "1px solid var(--color-grey-200)",
    textAlign: "center",
  },

  dealValue: {
    fontSize: "2rem",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
    margin: "0 0 0.5rem 0",
  },

  dealLabel: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text-secondary)",
    margin: 0,
  },

  financialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "var(--spacing-normal)",
  },

  financialCard: {
    backgroundColor: "var(--color-grey-50)",
    padding: "var(--spacing-big)",
    borderRadius: "var(--border-small-radius)",
    border: "1px solid var(--color-grey-200)",
    textAlign: "center",
  },

  financialValue: {
    fontSize: "2rem",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
    margin: "0 0 0.5rem 0",
  },

  financialLabel: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text-secondary)",
    margin: 0,
  },

  activityTable: {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-small-radius)",
    border: "1px solid var(--color-grey-200)",
    overflow: "hidden",
  },

  actionsTable: {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-small-radius)",
    border: "1px solid var(--color-grey-200)",
    overflow: "hidden",
  },

  alertsTable: {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-small-radius)",
    border: "1px solid var(--color-grey-200)",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "var(--spacing-normal)",
    padding: "var(--spacing-normal)",
    backgroundColor: "var(--color-grey-100)",
    borderBottom: "1px solid var(--color-grey-200)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--color-text)",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "var(--spacing-normal)",
    padding: "var(--spacing-normal)",
    borderBottom: "1px solid var(--color-grey-100)",
    alignItems: "center",
  },

  activityType: {
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text)",
  },

  activityMessage: {
    color: "var(--color-text)",
  },

  activityTime: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text-secondary)",
    textAlign: "right",
  },

  priorityBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "var(--border-small-radius)",
    fontSize: "var(--font-size-small)",
    fontWeight: "var(--font-weight-medium)",
    display: "inline-block",
  },

  actionText: {
    color: "var(--color-text)",
  },

  actionDate: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text-secondary)",
    textAlign: "right",
  },

  alertType: {
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text)",
  },

  alertDetails: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text-secondary)",
    textAlign: "right",
  },
} as const;
