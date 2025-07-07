// src/hooks/useGoogleCallback.ts
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseGoogleCallbackProps {
  setLoadingWithMessage: (isLoading: boolean, message?: string) => void;
}

/**
 * Hook personnalisé pour gérer le callback de l'authentification Google
 * Il récupère le token et les informations utilisateur depuis les paramètres d'URL,
 * les stocke dans localStorage et redirige vers la page appropriée.
 */
export const useGoogleCallback = ({
  setLoadingWithMessage,
}: UseGoogleCallbackProps): void => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        setLoadingWithMessage(true, "Finalisation de la connexion Google...");

        // Récupérer les paramètres de l'URL
        const token = searchParams.get("token");
        const userStr = searchParams.get("user");

        if (!token || !userStr) {
          console.error("Token ou données utilisateur manquants");
          router.push("/auth?error=invalid_callback");
          return;
        }

        // Parser les données utilisateur
        const user = JSON.parse(decodeURIComponent(userStr));

        // Stocker dans localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Vérifier si le profil est complet
        if (user.firstName && user.lastName) {
          router.push("/dashboard");
        } else {
          router.push("/getting-started");
        }
      } catch (error) {
        console.error("Erreur lors du traitement du callback Google:", error);
        router.push("/auth?error=callback_processing");
      } finally {
        setLoadingWithMessage(false);
      }
    };

    handleGoogleCallback();
  }, [router, searchParams, setLoadingWithMessage]);
};
