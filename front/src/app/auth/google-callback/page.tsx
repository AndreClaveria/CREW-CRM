// app/auth/google-callback/page.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleCallback } from "@/hooks/useGoogleCallback";
import LoadingOverlay from "@/components/common/LoadingOverlay";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "edge";

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
