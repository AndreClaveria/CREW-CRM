// src/hooks/useDateFormatter.ts
import { useMemo } from "react";

interface UseDateFormatterOptions {
  locale?: string;
  dateStyle?: "short" | "medium" | "long" | "full";
  timeStyle?: "short" | "medium" | "long" | "full";
  format?: "date" | "time" | "datetime";
  customFormat?: {
    day?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    year?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    second?: "numeric" | "2-digit";
  };
}

/**
 * Hook personnalisé pour formater les dates
 */
export const useDateFormatter = (options: UseDateFormatterOptions = {}) => {
  const {
    locale = "fr-FR",
    format = "date",
    customFormat = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  } = options;

  // Créer la fonction de formatage
  const formatDate = useMemo(() => {
    return (dateString?: string): string => {
      if (!dateString) return "Non disponible";

      try {
        const date = new Date(dateString);

        // Vérifier si la date est valide
        if (isNaN(date.getTime())) {
          return "Date invalide";
        }

        // Formater selon les options
        if (format === "date") {
          return date.toLocaleDateString(locale, customFormat);
        } else if (format === "time") {
          return date.toLocaleTimeString(locale, customFormat);
        } else {
          return date.toLocaleString(locale, customFormat);
        }
      } catch (e) {
        console.error("Erreur de formatage de date:", e);
        return dateString;
      }
    };
  }, [locale, format, customFormat]);

  return formatDate;
};

// Hooks prédéfinis pour les formats courants
export const useDateFormatterFr = () => {
  return useDateFormatter({
    locale: "fr-FR",
    customFormat: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  });
};

export const useDateTimeFormatterFr = () => {
  return useDateFormatter({
    locale: "fr-FR",
    format: "datetime",
    customFormat: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  });
};
