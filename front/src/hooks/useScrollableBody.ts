// src/hooks/useScrollableBody.ts
import { useEffect } from "react";

/**
 * Hook pour rendre le body et html scrollables
 * Modifie les styles de overflow et de hauteur des éléments html et body
 * Restaure les styles originaux lors du démontage du composant
 */
export const useScrollableBody = (): void => {
  useEffect(() => {
    // Sauvegarde des styles originaux
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyHeight = document.body.style.height;

    // Application des styles qui permettent le défilement
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.height = "auto";

    // Nettoyage à la désinstallation du composant
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.height = originalBodyHeight;
    };
  }, []);
};
