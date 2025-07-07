// app/page.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/useRedirect";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function Home() {
  const { isAuthenticated, isProfileComplete, isLoading } = useAuth();

  // Utilisation du hook personnalisé pour gérer la redirection
  useAuthRedirect(isLoading, isAuthenticated, isProfileComplete);

  // Interface utilisateur simplifiée - juste un écran de chargement
  return <LoadingOverlay isVisible={true} message="Redirection..." />;
}
