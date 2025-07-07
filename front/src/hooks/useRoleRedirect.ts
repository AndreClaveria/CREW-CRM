// src/hooks/useRoleRedirect.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseRoleRedirectProps {
  isLoading: boolean;
  user: {
    role?: string;
  } | null;
  roleRedirects: Record<string, string>;
  defaultRedirect: string;
}

/**
 * Hook personnalisé pour rediriger l'utilisateur
 * Redirige toujours vers le chemin par défaut
 */
export const useRoleRedirect = ({
  isLoading,
  user,
  roleRedirects,
  defaultRedirect,
}: UseRoleRedirectProps): void => {
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    router.push(defaultRedirect);
  }, [isLoading, user, defaultRedirect, router]);
};
