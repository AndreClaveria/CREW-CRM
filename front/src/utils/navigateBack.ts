// src/utils/navigation.ts
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Utiliser un objet de session ou localStorage pour stocker l'historique de navigation
const HISTORY_KEY = "navigation_history";

export const useNavigation = () => {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser ou récupérer l'historique
  const getHistory = (): string[] => {
    if (typeof window === "undefined") return [];

    const storedHistory = sessionStorage.getItem(HISTORY_KEY);

    return storedHistory ? JSON.parse(storedHistory) : [];
  };

  // Sauvegarder l'historique
  const saveHistory = (history: string[]) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  };

  // Ajouter une page à l'historique
  const addToHistory = (path: string) => {
    const history = getHistory();

    // Éviter les doublons consécutifs
    if (history.length === 0 || history[history.length - 1] !== path) {
      // Limiter la taille de l'historique (facultatif)
      if (history.length >= 20) {
        const removed = history.shift(); // Enlever le plus ancien
      }

      history.push(path);

      saveHistory(history);
    } else {
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (isInitialized) {
      return;
    }

    // Capture l'URL actuelle au chargement initial
    const currentPath = window.location.pathname;

    addToHistory(currentPath);
    setIsInitialized(true);

    // Intercepter les navigations programmatiques
    const originalPush = router.push;

    // @ts-ignore - Pour surcharger la méthode
    router.push = function (url: string, options?: any) {
      // Ajouter à l'historique avant la navigation
      setTimeout(() => {
        addToHistory(url);
      }, 0);

      return originalPush.apply(this, [url, options]);
    };

    return () => {
      // Restaurer la méthode originale à la destruction du composant

      // @ts-ignore
      router.push = originalPush;
    };
  }, [router, isInitialized]);

  // Fonction pour revenir à la page précédente
  const navigateBack = () => {
    const history = getHistory();

    // S'il y a au moins deux pages dans l'historique
    if (history.length >= 2) {
      // La page actuelle est la dernière de l'historique
      const currentPath = history.pop();
      // La page précédente est maintenant la dernière
      const previousPath = history[history.length - 1];

      // Mise à jour de l'historique
      saveHistory(history);

      // Navigation vers la page précédente

      router.push(previousPath);
    } else {
      // Fallback: retour à une page par défaut
      router.push("/dashboard");
    }
  };

  return {
    navigateBack,
    getCurrentPath: () => {
      const history = getHistory();
      const current = history.length > 0 ? history[history.length - 1] : "";

      return current;
    },
    getPreviousPath: () => {
      const history = getHistory();
      const previous = history.length > 1 ? history[history.length - 2] : "";

      return previous;
    },
    // Fonction de debug pour afficher l'historique complet
    debugHistory: () => {
      const history = getHistory();

      return history;
    },
  };
};
