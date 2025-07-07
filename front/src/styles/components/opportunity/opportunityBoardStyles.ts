export const opportunityBoardStyles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    fontSize: "var(--font-size-normal)",
    color: "var(--color-grey-600)",
  },

  emptyContainer: {
    textAlign: "center" as const,
    marginTop: "40px",
    color: "var(--color-grey-600)",
  },

  tableContainer: {
    overflowX: "auto" as const,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "var(--color-white)",
  },

  tableHead: {
    borderBottom: `var(--border-big-width) solid var(--color-grey-400)`,
  },

  tableHeader: {
    padding: "12px 16px",
    textAlign: "left" as const,
  },

  tableHeaderRight: {
    padding: "12px 16px",
    textAlign: "right" as const,
  },

  tableHeaderCenter: {
    padding: "12px 16px",
    textAlign: "center" as const,
  },

  tableRow: {
    borderBottom: `var(--border-width) solid var(--color-grey-400)`,
  },

  tableCell: {
    padding: "12px 16px",
  },

  tableCellLink: {
    padding: "12px 16px",
    fontWeight: "var(--font-weight-medium)",
    cursor: "pointer",
  },

  tableCellRight: {
    padding: "12px 16px",
    textAlign: "right" as const,
  },

  tableCellCenter: {
    padding: "12px 16px",
    textAlign: "center" as const,
  },

  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "var(--border-small-radius)",
    color: "var(--color-white)",
    fontSize: "var(--font-size-small-small)",
  },

  kanbanContainer: {
    display: "flex",
    overflowX: "auto" as const,
    padding: "20px 0",
  },

  statusColumn: {
    minWidth: "280px",
    width: "280px",
    marginRight: "var(--spacing-normal)",
    display: "flex",
    flexDirection: "column" as const,
  },

  statusHeader: {
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-radius) var(--border-radius) 0 0",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
  },

  statusTitle: {
    margin: 0,
    fontSize: "var(--font-size-normal)",
  },

  statusCount: {
    color: "var(--color-white)",
    borderRadius: "var(--border-circle-radius)",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--font-size-small-small)",
  },

  statusBody: {
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "0 0 var(--border-radius) var(--border-radius)",
    padding: "12px",
    flex: 1,
    minHeight: "400px",
  },

  opportunityCard: {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "var(--spacing-normal)",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  },

  opportunityCardHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },

  opportunityTitle: {
    margin: "0 0 8px 0",
    fontSize: "var(--font-size-normal)",
  },

  opportunityValue: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text)",
    fontWeight: "var(--font-weight-bold)",
    marginBottom: "4px",
  },

  opportunityMeta: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    display: "flex",
    justifyContent: "space-between",
  },

  emptyColumnPlaceholder: {
    textAlign: "center" as const,
    color: "var(--color-grey-600)",
    fontSize: "var(--font-size-small)",
    marginTop: "20px",
    padding: "40px 0",
    border: `var(--border-big-width) dashed var(--color-grey-400)`,
    borderRadius: "var(--border-radius)",
  },

  statusColors: {
    lead: "var(--color-green)",
    qualified: "var(--color-warning)",
    proposition: "var(--color-warning)",
    negotiation: "var(--color-blue)",
    won: "var(--color-green)",
    lost: "var(--color-red)",
  },
};

export const statusColumns = [
  { id: "lead", label: "Nouveaux", color: "#A3B18A" },
  { id: "qualified", label: "Qualifié", color: "#E9C46A" },
  { id: "proposition", label: "En négociation", color: "#E76F51" },
  {
    id: "negotiation",
    label: "En attente de validation",
    color: "#3498DB",
  },
  { id: "won", label: "Terminé", color: "#F4F1DE" },
  { id: "lost", label: "Terminé (Perdu)", color: "#F4F1DE" },
];
