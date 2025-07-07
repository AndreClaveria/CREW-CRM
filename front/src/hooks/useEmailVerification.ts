// src/hooks/useEmailVerification.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail } from "@/services/auth.service";

interface UseEmailVerificationProps {
  token: string | null;
  redirectDelay?: number; // Délai de redirection en ms après une vérification réussie
  redirectUrl?: string; // URL de redirection après une vérification réussie
}

interface UseEmailVerificationReturn {
  status: "loading" | "success" | "error";
  message: string;
}

/**
 * Hook personnalisé pour gérer la vérification d'email
 */
export const useEmailVerification = ({
  token,
  redirectDelay = 3000,
  redirectUrl = "/getting-started",
}: UseEmailVerificationProps): UseEmailVerificationReturn => {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Vérification de votre email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de confirmation manquant.");
      return;
    }

    const confirmEmail = async () => {
      try {
        const data = await verifyEmail(token);

        if (data.success) {
          setStatus("success");
          setMessage("Votre email a été vérifié avec succès!");

          // Rediriger après le délai spécifié
          if (redirectUrl) {
            setTimeout(() => {
              router.push(redirectUrl);
            }, redirectDelay);
          }
        } else {
          setStatus("error");
          setMessage(
            data.message || "Une erreur est survenue lors de la vérification."
          );
        }
      } catch (error: any) {
        console.error("Erreur lors de la vérification:", error);
        setStatus("error");
        setMessage(
          error.message ||
            "Une erreur est survenue lors de la vérification de votre email."
        );
      }
    };

    confirmEmail();
  }, [token, redirectDelay, redirectUrl, router]);

  return {
    status,
    message,
  };
};
