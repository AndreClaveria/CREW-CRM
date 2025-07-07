// src/hooks/useRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectCondition {
  condition: boolean;
  path: string;
}

/**
 * Hook personnalisé pour gérer les redirections conditionnelles
 *
 * @param {boolean} isLoading - Indique si le chargement est en cours
 * @param {RedirectCondition[]} redirectConditions - Array de conditions et chemins de redirection
 * @param {string} defaultPath - Chemin par défaut si aucune condition n'est remplie
 *
 * Exemple d'utilisation:
 * ```
 * useRedirect(
 *   isLoading,
 *   [
 *     { condition: !isAuthenticated, path: "/auth" },
 *     { condition: !isProfileComplete, path: "/getting-started" }
 *   ],
 *   "/dashboard"
 * );
 * ```
 */
export const useRedirect = (
  isLoading: boolean,
  redirectConditions: RedirectCondition[],
  defaultPath: string
): void => {
  const router = useRouter();

  useEffect(() => {
    // Ne pas rediriger si le chargement est en cours
    if (isLoading) return;

    // Parcourir les conditions dans l'ordre
    for (const { condition, path } of redirectConditions) {
      if (condition) {
        router.push(path);
        return;
      }
    }

    // Si aucune condition n'est remplie, rediriger vers le chemin par défaut
    router.push(defaultPath);
  }, [isLoading, redirectConditions, defaultPath, router]);
};

/**
 * Hook spécifique pour les redirections d'authentification
 * pour le cas spécifique que vous avez fourni
 */
export const useAuthRedirect = (
  isLoading: boolean,
  isAuthenticated: boolean,
  isProfileComplete: boolean
): void => {
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else if (!isProfileComplete) {
        router.push("/getting-started");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isProfileComplete, isLoading, router]);
};
