"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

// Type pour le contexte de la navbar
interface NavbarContextType {
  hoveredIcon: number | null;
  setHoveredIcon: (index: number | null) => void;
  navigateBack: () => void;
  getCurrentPath: () => string;
  getPreviousPath: () => string;
  debugHistory: () => string[];
}

// Clé pour le stockage de l'historique
const HISTORY_KEY = "navigation_history";

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Fonctions de gestion de l'historique
  const getHistory = (): string[] => {
    if (typeof window === "undefined") return [];

    const storedHistory = sessionStorage.getItem(HISTORY_KEY);

    return storedHistory ? JSON.parse(storedHistory) : [];
  };

  const saveHistory = (history: string[]) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  };

  const addToHistory = (path: string) => {
    const history = getHistory();

    // Éviter les doublons consécutifs
    if (history.length === 0 || history[history.length - 1] !== path) {
      // Limiter la taille de l'historique
      if (history.length >= 20) {
        const removed = history.shift();
      }

      history.push(path);

      saveHistory(history);
    }
  };

  // Initialisation du système de tracking
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

    router.push = function (url: string, options?: any) {
      // Ajouter à l'historique avant la navigation
      setTimeout(() => {
        addToHistory(url);
      }, 0);

      return originalPush.apply(this, [url, options]);
    };

    return () => {
      // Restaurer la méthode originale à la destruction du composant

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

  const getCurrentPath = () => {
    const history = getHistory();
    const current = history.length > 0 ? history[history.length - 1] : "";

    return current;
  };

  const getPreviousPath = () => {
    const history = getHistory();
    const previous = history.length > 1 ? history[history.length - 2] : "";

    return previous;
  };

  const debugHistory = () => {
    const history = getHistory();

    return history;
  };

  return (
    <NavbarContext.Provider
      value={{
        hoveredIcon,
        setHoveredIcon,
        navigateBack,
        getCurrentPath,
        getPreviousPath,
        debugHistory,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};
