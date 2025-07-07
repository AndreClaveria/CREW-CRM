// src/hooks/useEmailConfirmation.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  resendConfirmationEmail,
  getCurrentUser,
} from "@/services/auth.service";

interface UseEmailConfirmationReturn {
  email: string;
  loading: boolean;
  message: string;
  messageType: "success" | "error" | null;
  handleResendEmail: () => Promise<void>;
}

export const useEmailConfirmation = (): UseEmailConfirmationReturn => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  // Récupérer l'email depuis le localStorage au chargement
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setEmail(user.email || "");
    } else {
      router.push("/auth");
    }
  }, [router]);

  // Fonction pour gérer le renvoi de l'email de confirmation
  const handleResendEmail = async () => {
    if (!email) return;

    setLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      // Utiliser la fonction du service d'authentification
      const data = await resendConfirmationEmail(email);

      if (data.success) {
        setMessage(
          "Un nouvel email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
        );
        setMessageType("success");
      } else {
        setMessage(
          "Erreur: " + (data.message || "Impossible d'envoyer l'email.")
        );
        setMessageType("error");
      }
    } catch (error: any) {
      console.error("Erreur:", error);
      setMessage(
        error.message || "Une erreur s'est produite. Veuillez réessayer."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    loading,
    message,
    messageType,
    handleResendEmail,
  };
};
