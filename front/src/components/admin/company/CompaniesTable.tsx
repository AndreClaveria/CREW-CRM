import React, { useState } from "react";
import { adminDashboardStyles as styles } from "@/styles/pages/dashboard/admin/adminDashboardStyles";
import { FaSearch, FaEye, FaEllipsisH, FaUserTie } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface CompaniesTableProps {
  companies: any[];
  maxDisplayed?: number;
  navigateToCompanyDetails: (companyId: string) => void;
  navigateToCompanyManagement: () => void;
  showViewMore?: boolean;
  searchEnabled?: boolean;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  maxDisplayed = Infinity,
  navigateToCompanyDetails,
  navigateToCompanyManagement,
  showViewMore = false,
  searchEnabled = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les entreprises en fonction de la recherche
  const filteredCompanies = searchQuery
    ? companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.industry &&
            company.industry
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (company.owner &&
            company.owner.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : companies;

  // Limiter le nombre d'entreprises affichées
  const displayedCompanies = filteredCompanies.slice(0, maxDisplayed);

  return (
    <>
      {searchEnabled && (
        <div style={styles.searchInputContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {filteredCompanies.length === 0 ? (
        <div style={styles.emptyState}>
          <p>
            Aucune entreprise{" "}
            {searchQuery ? "trouvée" : "enregistrée dans le système"}.
          </p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nom</th>
              <th style={styles.tableHeader}>Secteur</th>
              <th style={styles.tableHeader}>Propriétaire</th>
              <th style={styles.tableHeader}>Statut</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCompanies.map((company) => (
              <tr key={company._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{company.name}</td>
                <td style={styles.tableCell}>
                  {company.industry || "Non spécifié"}
                </td>
                <td style={styles.tableCell}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <FaUserTie
                      style={{
                        marginRight: "5px",
                        color: "var(--color-blue)",
                      }}
                    />
                    {company.owner ? company.owner : "Non assigné"}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: company.isActive
                        ? "var(--color-green)"
                        : "var(--color-warning)",
                    }}
                  >
                    {company.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={styles.tableCellActions}>
                  <ActionButton
                    onClick={() => navigateToCompanyDetails(company._id)}
                    variant="secondary"
                    size="small"
                  >
                    <FaEye style={{ marginRight: "5px" }} />
                    Détails
                  </ActionButton>
                </td>
              </tr>
            ))}
            {showViewMore && filteredCompanies.length > maxDisplayed && (
              <tr style={styles.viewMoreRow}>
                <td colSpan={5} style={styles.viewMoreCell}>
                  <div style={styles.viewMoreContent}>
                    <FaEllipsisH style={{ marginRight: "10px" }} />
                    <span>
                      Voir {filteredCompanies.length - maxDisplayed} autres
                      entreprises
                    </span>
                    <ActionButton
                      onClick={navigateToCompanyManagement}
                      variant="secondary"
                      size="small"
                    >
                      Voir tout
                    </ActionButton>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CompaniesTable;
