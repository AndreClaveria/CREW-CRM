import React, { useState } from "react";
import { companyDetailsStyles as styles } from "@/styles/pages/dashboard/admin/companyDetailStyles";
import {
  FaUserTie,
  FaPlus,
  FaSearch,
  FaEye,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface CompanyClientsTableProps {
  clients: any[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  navigateToClient: (clientId: string) => void;
  navigateToClientsManagement: () => void;
}

const CompanyClientsTable: React.FC<CompanyClientsTableProps> = ({
  clients,
  currentPage,
  totalPages,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  navigateToClient,
  navigateToClientsManagement,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les clients en fonction de la recherche
  const filteredClients = searchQuery
    ? clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (client.email &&
            client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (client.phone &&
            client.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : clients;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
  };

  // Générer les numéros de page pour la pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Afficher toutes les pages si le nombre total est inférieur ou égal à maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Stratégie plus complexe pour un grand nombre de pages
      let startPage: number;
      let endPage: number;

      if (currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
        // Près du début
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        // Près de la fin
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // Au milieu
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Ajouter les ellipses si nécessaire
      if (startPage > 1) {
        pages.unshift(1);
        if (startPage > 2) pages.splice(1, 0, -1); // -1 représente l'ellipse
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaUserTie style={styles.sectionIcon} />
          Clients
        </h2>
        <ActionButton
          onClick={navigateToClientsManagement}
          variant="primary"
          size="small"
        >
          <FaPlus style={{ marginRight: "8px" }} />
          Ajouter un client
        </ActionButton>
      </div>

      {/* Barre de recherche */}
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <FaSearch
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-grey-500, #999)",
          }}
        />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "0.75rem 0.75rem 0.75rem 2.5rem",
            fontSize: "0.9375rem",
            border: "1px solid var(--color-grey-400, #ccc)",
            borderRadius: "0.375rem",
          }}
        />
      </div>

      {filteredClients.length > 0 ? (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableHeader}>Nom</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Téléphone</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Slice les clients pour la pagination */}
                {filteredClients
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((client) => (
                    <tr key={client._id} style={styles.tableRow}>
                      <td style={styles.tableCell}>{client.name}</td>
                      <td style={styles.tableCell}>{client.email || "-"}</td>
                      <td style={styles.tableCell}>{client.phone || "-"}</td>
                      <td style={styles.tableCellActions}>
                        <ActionButton
                          onClick={() => navigateToClient(client._id)}
                          variant="secondary"
                          size="small"
                        >
                          <FaEye style={{ marginRight: "5px" }} />
                          Détails
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <div style={styles.pageItemsSelector}>
              <span>Afficher</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                style={styles.pageItemsSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>par page</span>
            </div>

            <div style={styles.paginationInfo}>
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredClients.length)} sur{" "}
              {filteredClients.length} client(s)
            </div>

            <div style={styles.paginationControls}>
              <button
                style={styles.paginationButton}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
                <FaChevronLeft style={{ marginLeft: "-0.375rem" }} />
              </button>

              <button
                style={styles.paginationButton}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>

              <div style={styles.paginationPageNumbers}>
                {generatePageNumbers().map((page, index) =>
                  page === -1 ? (
                    <span
                      key={`ellipsis-${index}`}
                      style={{
                        ...styles.paginationButton,
                        cursor: "default",
                      }}
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      style={{
                        ...styles.paginationButton,
                        ...(page === currentPage
                          ? styles.paginationButtonActive
                          : {}),
                      }}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                style={styles.paginationButton}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>

              <button
                style={styles.paginationButton}
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
                <FaChevronRight style={{ marginLeft: "-0.375rem" }} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            {searchQuery
              ? "Aucun client ne correspond à votre recherche."
              : "Aucun client n'a été ajouté à cette entreprise."}
          </div>
          {!searchQuery && (
            <ActionButton
              onClick={navigateToClientsManagement}
              variant="primary"
              size="medium"
            >
              <FaPlus style={{ marginRight: "8px" }} />
              Ajouter un client
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyClientsTable;
