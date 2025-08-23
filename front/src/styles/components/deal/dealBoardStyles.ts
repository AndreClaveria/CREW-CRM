export const dealBoardStyles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  } as React.CSSProperties,
  emptyContainer: {
    textAlign: "center" as const,
    marginTop: "40px",
    color: "var(--color-grey-600)",
  },
  tableContainer: { overflowX: "auto" as const },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "var(--color-white)",
  } as React.CSSProperties,
  tableHead: {
    borderBottom: `var(--border-big-width) solid var(--color-grey-400)`,
  } as React.CSSProperties,
  tableHeader: {
    padding: "12px 16px",
    textAlign: "left" as const,
  } as React.CSSProperties,
  tableHeaderRight: {
    padding: "12px 16px",
    textAlign: "right" as const,
  } as React.CSSProperties,
  tableHeaderCenter: {
    padding: "12px 16px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  tableRow: {
    borderBottom: `var(--border-width) solid var(--color-grey-400)`,
  } as React.CSSProperties,
  tableCell: { padding: "12px 16px" } as React.CSSProperties,
  tableCellLink: {
    padding: "12px 16px",
    fontWeight: "var(--font-weight-medium)",
    cursor: "pointer",
  } as React.CSSProperties,
  tableCellRight: {
    padding: "12px 16px",
    textAlign: "right" as const,
  } as React.CSSProperties,
  tableCellCenter: {
    padding: "12px 16px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "var(--border-small-radius)",
    color: "var(--color-white)",
    fontSize: "var(--font-size-small-small)",
  } as React.CSSProperties,
  kanbanContainer: {
    display: "flex",
    overflowX: "auto" as const,
    padding: "20px 0",
  } as React.CSSProperties,
  statusColumn: {
    minWidth: "280px",
    width: "280px",
    marginRight: "var(--spacing-normal)",
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,
  statusHeader: {
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "var(--border-radius) var(--border-radius) 0 0",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
  } as React.CSSProperties,
  statusTitle: {
    margin: 0,
    fontSize: "var(--font-size-normal)",
  } as React.CSSProperties,
  statusCount: {
    color: "var(--color-white)",
    borderRadius: "var(--border-circle-radius)",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--font-size-small-small)",
  } as React.CSSProperties,
  statusBody: {
    backgroundColor: "var(--color-grey-100)",
    borderRadius: "0 0 var(--border-radius) var(--border-radius)",
    padding: "12px",
    flex: 1,
    minHeight: "400px",
  } as React.CSSProperties,
  card: {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-radius)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "var(--spacing-normal)",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "var(--animation-transition)",
  } as React.CSSProperties,
  cardHover: {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  } as React.CSSProperties,
  cardTitle: {
    margin: "0 0 8px 0",
    fontSize: "var(--font-size-normal)",
  } as React.CSSProperties,
  cardValue: {
    fontSize: "var(--font-size-small)",
    color: "var(--color-text)",
    fontWeight: "var(--font-weight-bold)",
    marginBottom: "4px",
  } as React.CSSProperties,
  cardMeta: {
    fontSize: "var(--font-size-small-small)",
    color: "var(--color-grey-600)",
    display: "flex",
    justifyContent: "space-between",
  } as React.CSSProperties,
};

export const dealStatusColumns = [
  { id: "prospection", label: "Prospection", color: "#A3B18A" },
  { id: "qualification", label: "Qualification", color: "#E9C46A" },
  { id: "proposition", label: "Proposition", color: "#E76F51" },
  { id: "negociation", label: "Négociation", color: "#3498DB" },
  { id: "signature", label: "Signature", color: "#8E44AD" },
  { id: "gagne", label: "Gagné", color: "#2ECC71" },
  { id: "perdu", label: "Perdu", color: "#C0392B" },
];
