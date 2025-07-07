import React, { useState } from "react";
import { adminDashboardStyles as styles } from "@/styles/pages/dashboard/admin/adminDashboardStyles";
import { FaSearch, FaEye, FaEllipsisH } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface UsersTableProps {
  users: any[];
  maxDisplayed?: number;
  navigateToUserDetails: (userId: string) => void;
  navigateToUserManagement: () => void;
  showViewMore?: boolean;
  searchEnabled?: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  maxDisplayed = Infinity,
  navigateToUserDetails,
  navigateToUserManagement,
  showViewMore = false,
  searchEnabled = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Limiter le nombre d'utilisateurs affichés
  const displayedUsers = filteredUsers.slice(0, maxDisplayed);

  return (
    <>
      {searchEnabled && (
        <div style={styles.searchInputContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div style={styles.emptyState}>
          <p>
            Aucun utilisateur{" "}
            {searchQuery ? "trouvé" : "enregistré dans le système"}.
          </p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nom</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Statut</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user) => (
              <tr key={user._id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  {user.firstName} {user.lastName}
                </td>
                <td style={styles.tableCell}>{user.email}</td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: user.active ? "#4caf50" : "#f44336",
                    }}
                  >
                    {user.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={styles.tableCellActions}>
                  <ActionButton
                    onClick={() => navigateToUserDetails(user._id)}
                    variant="secondary"
                    size="small"
                  >
                    <FaEye style={{ marginRight: "5px" }} />
                    Détails
                  </ActionButton>
                </td>
              </tr>
            ))}
            {showViewMore && filteredUsers.length > maxDisplayed && (
              <tr style={styles.viewMoreRow}>
                <td colSpan={4} style={styles.viewMoreCell}>
                  <div style={styles.viewMoreContent}>
                    <FaEllipsisH style={{ marginRight: "10px" }} />
                    <span>
                      Voir {filteredUsers.length - maxDisplayed} autres
                      utilisateurs
                    </span>
                    <ActionButton
                      onClick={navigateToUserManagement}
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

export default UsersTable;
