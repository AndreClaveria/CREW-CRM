"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as loginService,
  logout as logoutService,
} from "@/services/auth.service";
import {
  updateUser,
  getStoredUser,
  type User,
  type UpdateUserRequest,
} from "@/services/user.service";
import LoadingOverlay from "@/components/common/LoadingOverlay";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (firstName: string, lastName: string) => Promise<void>;
  updateUserData: (
    userId: string,
    userData: UpdateUserRequest
  ) => Promise<User>;
  setLoadingWithMessage: (isLoading: boolean, message?: string) => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};

// Provider du contexte
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Chargement en cours..."
  );
  const router = useRouter();

  // Vérifie si le profil de l'utilisateur est complet
  const isProfileComplete = user?.firstName && user?.lastName ? true : false;

  // Vérifie si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  // Fonction pour définir l'état de chargement avec un message personnalisé
  const setLoadingWithMessage = (loading: boolean, message?: string) => {
    setIsLoading(loading);
    if (message) {
      setLoadingMessage(message);
    } else {
      setLoadingMessage("Chargement en cours...");
    }
  };

  // Timeout de sécurité pour le chargement
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // Définir un délai maximum de 30 secondes pour le chargement
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        console.warn(
          "Le chargement a été interrompu après 30 secondes d'attente"
        );
      }, 30000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Fonction pour vérifier la validité du token
  const checkTokenValidity = () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      handleLogout();
    }
  };

  // Fonction centralisée pour la déconnexion
  const handleLogout = () => {
    setLoadingWithMessage(true, "Déconnexion en cours...");
    document.documentElement.setAttribute("data-theme", "light");
    logoutService();
    setToken(null);
    setUser(null);
    router.push("/auth");
    setIsLoading(false);
  };

  // Vérification périodique du token
  useEffect(() => {
    // Vérifier toutes les 5 minutes
    const intervalId = setInterval(checkTokenValidity, 5 * 60 * 1000);

    // Vérifier aussi lors du focus de la fenêtre
    const handleFocus = () => {
      checkTokenValidity();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Charge l'utilisateur et le token depuis le localStorage au démarrage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          // Vérifier si l'utilisateur s'est connecté via Google
          if (storedUser.email && storedUser.email.includes("@gmail.com")) {
            // Marquer comme un utilisateur Google
            setUser({
              ...storedUser,
              provider: "google",
            });
          } else {
            setUser(storedUser);
          }
          setToken(storedToken);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
        logoutService();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const currentPath = window.location.pathname;

      if (!isAuthenticated && currentPath === "/health") {
        return;
      }
      if (!isAuthenticated && currentPath !== "/auth") {
        router.push("/auth");
      } else if (
        isAuthenticated &&
        user &&
        !user.active &&
        currentPath !== "/awaiting-confirmation"
      ) {
        // Rediriger vers la page d'attente de confirmation si le compte n'est pas actif
        router.push("/awaiting-confirmation");
      } else if (
        isAuthenticated &&
        user?.active && // S'assurer que le compte est actif
        !isProfileComplete &&
        currentPath !== "/getting-started"
      ) {
        router.push("/getting-started");
      } else if (
        isAuthenticated &&
        user?.active && // S'assurer que le compte est actif
        isProfileComplete &&
        (currentPath === "/auth" ||
          currentPath === "/getting-started" ||
          currentPath === "/awaiting-confirmation")
      ) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isProfileComplete, isLoading, router, user]);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setLoadingWithMessage(true, "Connexion en cours...");

      const data = await loginService({ email, password });

      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion modifiée pour gérer le thème
  const logout = () => {
    handleLogout();
  };

  // Fonction de mise à jour du profil
  const updateUserProfile = async (firstName: string, lastName: string) => {
    try {
      setLoadingWithMessage(true, "Mise à jour du profil...");

      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      // Utilisation du service utilisateur
      const updatedUser = await updateUser(user._id, { firstName, lastName });
      setUser(updatedUser);

      // La redirection est gérée par useEffect
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Nouvelle fonction pour mettre à jour les données utilisateur et l'état global
  const updateUserData = async (
    userId: string,
    userData: UpdateUserRequest
  ): Promise<User> => {
    try {
      setLoadingWithMessage(true, "Mise à jour des informations...");

      // Utilisation du service utilisateur
      const updatedUser = await updateUser(userId, userData);

      // Mettre à jour l'état global si l'utilisateur mis à jour est l'utilisateur actuel
      if (user && user._id === userId) {
        setUser(updatedUser);

        // Mettre à jour le localStorage pour refléter les changements immédiatement
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des informations utilisateur:",
        error
      );
      throw error;
    } finally {
      setLoadingWithMessage(false);
    }
  };

  // Valeur du contexte
  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isProfileComplete,
    login,
    logout,
    updateUserProfile,
    updateUserData, // Nouvelle fonction ajoutée
    setLoadingWithMessage,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <LoadingOverlay isVisible={isLoading} message={loadingMessage} />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
