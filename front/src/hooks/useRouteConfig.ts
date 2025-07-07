// src/hooks/useRoutePrefix.ts
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook pour déterminer le préfixe de route basé sur le rôle de l'utilisateur
 * @returns Le préfixe de route ('admin' ou 'manager')
 */
export const useRoutePrefix = (): string => {
  const { user } = useAuth();
  return user?.role === "admin" ? "admin" : "manager";
};
