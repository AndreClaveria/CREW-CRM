// app/auth/google-callback/page.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleCallback } from "@/hooks/useGoogleCallback";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function GoogleCallbackPage() {
  const { setLoadingWithMessage } = useAuth();

  useGoogleCallback({ setLoadingWithMessage });

  return (
    <LoadingOverlay
      isVisible={true}
      message="Finalisation de la connexion Google..."
    />
  );
}
