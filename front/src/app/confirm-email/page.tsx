"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { confirmEmailStyles as styles } from "@/styles/pages/confirm-email/confirmEmailStyles";

const ConfirmEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Utilisation du hook personnalisé pour gérer la vérification
  const { status, message } = useEmailVerification({
    token,
    redirectDelay: 3000,
    redirectUrl: "/getting-started",
  });

  // Calcul du style de l'en-tête en fonction du statut
  const getHeadingStyle = () => {
    if (status === "success") return styles.headingSuccess;
    if (status === "error") return styles.headingError;
    return styles.headingLoading;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          {status === "loading" && <div style={styles.loadingIcon}></div>}

          {status === "success" && (
            <svg
              style={styles.successIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}

          {status === "error" && (
            <svg
              style={styles.errorIcon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <h2 style={getHeadingStyle()}>
          {status === "success"
            ? "Email vérifié"
            : status === "error"
            ? "Erreur de vérification"
            : "Vérification en cours"}
        </h2>

        <p style={styles.message}>{message}</p>

        {status === "success" && (
          <p style={styles.redirectMessage}>
            Vous allez être redirigé vers l'étape suivante dans quelques
            secondes...
          </p>
        )}

        {status === "error" && (
          <button onClick={() => router.push("/auth")} style={styles.button}>
            Retour à l'authentification
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
