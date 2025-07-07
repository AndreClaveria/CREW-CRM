// src/hooks/useRoutePrefix.ts
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook pour déterminer le préfixe de route
 * @returns Le préfixe de route ('dashboard')
 */
export const useRoutePrefix = (): string => {
  return "dashboard";
};
