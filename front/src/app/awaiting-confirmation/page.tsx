"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEmailConfirmation } from "@/hooks/useEmailConfirmation";
import { awaitingConfirmationStyles as styles } from "@/styles/pages/awaiting-confirmation/awaitingConfirmationStyles";

const AwaitingConfirmationPage = () => {
  const router = useRouter();
  // Utilisation du hook personnalisé pour gérer la logique liée à l'email
  const { email, loading, message, messageType, handleResendEmail } =
    useEmailConfirmation();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <Image
            src="/img/logo/logo_crew.png"
            alt="Logo Crew"
            width={100}
            height={100}
            style={styles.logo}
          />
        </div>

        <h2 style={styles.title}>Vérifiez votre email</h2>

        <p style={styles.subtitle}>
          Un email de confirmation a été envoyé à <strong>{email}</strong>.
          Veuillez cliquer sur le lien dans cet email pour activer votre compte
          et continuer.
        </p>

        {message && messageType && (
          <div
            style={
              messageType === "success"
                ? styles.alertSuccess
                : styles.alertError
            }
          >
            {message}
          </div>
        )}

        <div style={styles.buttonContainer}>
          <button
            onClick={handleResendEmail}
            disabled={loading}
            style={
              loading
                ? { ...styles.primaryButton, ...styles.primaryButtonDisabled }
                : styles.primaryButton
            }
          >
            {loading
              ? "Envoi en cours..."
              : "Renvoyer l&apos;email de confirmation"}
          </button>

          <button
            onClick={() => router.push("/auth")}
            style={styles.secondaryButton}
          >
            Retour à l&apos;authentification
          </button>
        </div>

        <p style={styles.footnote}>
          Si vous ne trouvez pas notre email, vérifiez votre dossier spam.
        </p>
      </div>
    </div>
  );
};

export default AwaitingConfirmationPage;
