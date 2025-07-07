// src/hooks/useCssAnimation.ts
import { useEffect } from "react";

/**
 * Hook personnalisé pour injecter des animations CSS dans le document
 * @param name - Nom de l'animation
 * @param keyframes - Règles CSS de l'animation
 */
export const useCssAnimation = (name: string, keyframes: string): void => {
  useEffect(() => {
    // Crée un identifiant unique pour l'animation
    const animationId = `animation-${name}`;

    // Vérifie si l'animation existe déjà
    if (!document.getElementById(animationId)) {
      // Crée un élément style
      const style = document.createElement("style");
      style.id = animationId;
      style.innerHTML = `
        @keyframes ${name} {
          ${keyframes}
        }
      `;
      document.head.appendChild(style);

      // Nettoyage lors du démontage du composant
      return () => {
        const styleElement = document.getElementById(animationId);
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, [name, keyframes]);
};

// Hooks prédéfinis pour les animations courantes
export const useSpinAnimation = (): void => {
  useCssAnimation(
    "spin",
    `
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `
  );
};

export const usePulseAnimation = (): void => {
  useCssAnimation(
    "pulse",
    `
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `
  );
};

export const useFadeAnimation = (): void => {
  useCssAnimation(
    "fade",
    `
    0% { opacity: 0; }
    100% { opacity: 1; }
  `
  );
};
