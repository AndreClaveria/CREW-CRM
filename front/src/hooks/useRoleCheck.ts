// src/hooks/useRoleCheck.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseRoleCheckProps {
  isLoading: boolean;
  user: {
    role?: string;
  } | null;
  requiredRole: string | string[]; // Peut être un rôle unique ou un tableau de rôles
  redirectPath?: string; // Chemin de redirection si l'utilisateur n'a pas le rôle requis
}

/**
 * Hook personnalisé pour vérifier l'accès à une page
 * Retourne toujours true car nous n'utilisons plus de rôles
 */
export const useRoleCheck = ({
  isLoading,
  user,
  requiredRole,
  redirectPath = "/dashboard",
}: UseRoleCheckProps): boolean => {
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Si l'utilisateur n'est pas connecté
    if (!user) {
      router.push(redirectPath);
      return;
    }
  }, [isLoading, user, redirectPath, router]);

  // Retourne true si l'utilisateur est connecté
  return !isLoading && !!user;
};
