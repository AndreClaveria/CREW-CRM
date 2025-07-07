import { CSSProperties } from "react";

export interface TableStyleProps {
  variant?: "default" | "striped" | "bordered" | "compact";
  headerStyle?: "light" | "dark" | "primary";
  rounded?: boolean;
  borderless?: boolean;
  width?: string;
  maxWidth?: string;
  centered?: boolean;
}

export const tableStyles = (props: TableStyleProps = {}) => {
  const {
    variant = "striped",
    headerStyle = "light",
    rounded = true,
    borderless = false,
    width = "100%",
    maxWidth = "1200px",
    centered = true,
  } = props;

  // Styles de base du conteneur
  const containerStyle: CSSProperties = {
    width: width,
    maxWidth: maxWidth,
    margin: centered ? "0 auto" : undefined,
    overflowX: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderRadius: rounded ? "var(--border-radius)" : "0",
  };

  // Styles de base du tableau
  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "var(--color-white)",
    overflow: "hidden",
    border: borderless
      ? "none"
      : `var(--border-width) solid var(--table-border)`,
  };

  // Styles d'en-tête selon le thème
  const getHeaderStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      padding: variant === "compact" ? "8px 12px" : "16px",
      textAlign: "left",
      fontWeight: "var(--font-weight-bold)",
      borderBottom: borderless
        ? "none"
        : `var(--border-big-width) solid var(--table-border)`,
    };

    switch (headerStyle) {
      case "dark":
        return {
          ...baseStyle,
          backgroundColor: "var(--color-black)",
          color: "var(--color-white)",
        };
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "var(--color-blue)",
          color: "var(--color-white)",
        };
      case "light":
      default:
        return {
          ...baseStyle,
          backgroundColor: "var(--table-header-bg)",
          color: "var(--table-header-text)",
        };
    }
  };

  // Styles des cellules
  const cellStyle = (isEven: boolean = false): CSSProperties => {
    const baseStyle: CSSProperties = {
      padding: variant === "compact" ? "8px 12px" : "14px 16px",
      borderBottom: borderless
        ? "none"
        : `var(--border-width) solid var(--table-border)`,
    };

    // Appliquer des couleurs alternées en fonction du variant
    if (variant === "striped" && isEven) {
      return {
        ...baseStyle,
        backgroundColor: "var(--table-row-alt-bg)",
      };
    }

    return baseStyle;
  };

  // Style pour les lignes
  const rowStyle = (isEven: boolean = false): CSSProperties => {
    return {
      transition: "var(--animation-transition)",
      backgroundColor:
        variant === "striped" && isEven
          ? "var(--table-row-alt-bg)"
          : "var(--table-row-bg)",
    };
  };

  // Styles pour les actions sur la dernière colonne
  const actionsCellStyle: CSSProperties = {
    padding: variant === "compact" ? "4px 8px" : "8px 12px",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return {
    containerStyle,
    tableStyle,
    headerStyle: getHeaderStyle(),
    rowStyle,
    cellStyle,
    actionsCellStyle,
  };
};

// Pour faciliter l'utilisation avec les tables génériques
export const tableStyleProps: TableStyleProps = {
  variant: "striped",
  headerStyle: "light",
  rounded: true,
  borderless: false,
  width: "100%",
  maxWidth: "1200px",
  centered: true,
};
