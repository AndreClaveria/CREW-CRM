"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { tableStyles, TableStyleProps } from "@/styles/components/tableStyles";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  align?: "left" | "center" | "right";
  width?: string;
  isAction?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  styleProps?: TableStyleProps;
  pagination?: boolean; // Activer/désactiver la pagination
  defaultItemsPerPage?: 5 | 10 | 25; // Nombre d'éléments par page par défaut
  paginationActiveColor?: string; // Couleur de fond pour le numéro de page actif
  paginationTextColor?: string; // Couleur du texte pour les numéros de page
  onRowClick?: (item: T) => void;
}

const Table = <T extends object>({
  data,
  columns,
  keyField,
  isLoading = false,
  emptyMessage = "Aucune donnée disponible",
  className = "",
  styleProps,
  pagination = true,
  defaultItemsPerPage = 10,
  paginationActiveColor = "#A3B18A", // Couleur par défaut si non spécifiée
  paginationTextColor = "#A3B18A", // Couleur par défaut si non spécifiée
  onRowClick,
}: TableProps<T>) => {
  const styles = tableStyles(styleProps);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<5 | 10 | 25>(
    defaultItemsPerPage
  );
  const [paginatedData, setPaginatedData] = useState<T[]>([]);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Mettre à jour les données paginées lors des changements
  useEffect(() => {
    // Réinitialiser à la page 1 si les données ou itemsPerPage changent
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

    // Calculer les données à afficher pour la page courante
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    // Extraire le sous-ensemble de données
    const currentPageData = data.slice(startIndex, endIndex);
    setPaginatedData(currentPageData);
  }, [data, currentPage, itemsPerPage, totalPages]);

  const getHeaderCellStyle = (column: TableColumn<T>): React.CSSProperties => {
    return {
      ...styles.headerStyle,
      textAlign: column.align || "left",
      width: column.width,
    };
  };

  const getCellStyle = (
    column: TableColumn<T>,
    isEven: boolean
  ): React.CSSProperties => {
    if (column.isAction) {
      return {
        ...styles.actionsCellStyle,
        textAlign: column.align || "center",
      };
    }

    return {
      ...styles.cellStyle(isEven),
      textAlign: column.align || "left",
    };
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return item[column.accessor] as ReactNode;
  };

  // Gérer les changements de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Gérer les changements d'éléments par page
  const handleItemsPerPageChange = (value: 5 | 10 | 25) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Revenir à la première page
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          margin: "0 auto",
          maxWidth: styleProps?.maxWidth || "1200px",
        }}
      >
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={styles.containerStyle} className={className}>
      <table style={styles.tableStyle}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={getHeaderCellStyle(column)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(pagination ? paginatedData : data).length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "16px", textAlign: "center" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            (pagination ? paginatedData : data).map((item, rowIndex) => (
              <tr
                key={String(item[keyField])}
                style={{
                  ...styles.rowStyle(rowIndex % 2 === 1),
                }}
              >
                {columns.map((column, colIndex) => {
                  const isLastColumn = colIndex === columns.length - 1;
                  const cellStyle = {
                    ...getCellStyle(column, rowIndex % 2 === 1),
                    cursor: !isLastColumn && onRowClick ? "pointer" : undefined,
                  };

                  return (
                    <td
                      key={colIndex}
                      style={cellStyle}
                      onClick={
                        !isLastColumn && onRowClick
                          ? (e) => {
                              e.stopPropagation();
                              onRowClick(item);
                            }
                          : undefined
                      }
                    >
                      {renderCell(item, column)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Contrôles de pagination */}
      {pagination && data.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 16px 16px",
            borderRadius: "8px",
          }}
        >
          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* Pagination buttons in the middle/right */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "transparent",
                  color: currentPage === 1 ? "#aaaaaa" : paginationTextColor,
                  border: "1px solid transparent",
                  borderRadius: "4px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                &lt; Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: "4px 10px",
                      backgroundColor:
                        page === currentPage
                          ? paginationActiveColor
                          : "transparent",
                      color:
                        page === currentPage ? "#ffffff" : paginationTextColor,
                      border:
                        page === currentPage
                          ? `1px solid ${paginationActiveColor}`
                          : `1px solid ${paginationTextColor}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "transparent",
                  color:
                    currentPage === totalPages
                      ? "#aaaaaa"
                      : paginationTextColor,
                  border: "1px solid transparent",
                  borderRadius: "4px",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
              >
                Next &gt;
              </button>

              {/* "X per page" on the right */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(
                      Number(e.target.value) as 5 | 10 | 25
                    )
                  }
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #dddddd",
                    backgroundColor: "#ffffff",
                    marginRight: "5px",
                    color: paginationTextColor,
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span style={{ color: paginationTextColor }}>par page</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
