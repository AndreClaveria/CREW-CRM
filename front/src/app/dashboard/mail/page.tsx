"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import EmailTable from "@/components/email/EmailTable";
import EmailComposeModal from "@/components/email/EmailCompose";
import ActionButton from "@/components/common/ActionButton";

const MailList: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["user"],
    redirectPath: "/dashboard",
  });

  const {
    dashboardData,
    loading: isLoadingDashboard,
    error: dashboardError,
  } = useUserDashboard();

  if (isLoadingAuth || isLoadingDashboard || !hasAccess) {
    return null;
  }

  if (dashboardError) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{dashboardError}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  if (!dashboardData?.company) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Information</h2>
        <p>
          Vous n&apos;avez pas encore d&apos;entreprise associée à votre compte.
        </p>
        <ActionButton
          onClick={() => router.push("/dashboard")}
          variant="secondary"
          size="medium"
        >
          Retour au tableau de bord
        </ActionButton>
      </div>
    );
  }

  const company = dashboardData.company;

  const handleComposeClick = () => {
    setIsComposeModalOpen(true);
  };

  const handleCloseCompose = () => {
    setIsComposeModalOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "50px",
              marginBottom: "8px",
              color: "#333333",
              fontFamily: "var(--font-first)",
            }}
          >
            Emails
          </h1>
          <p style={{ color: "#666" }}>
            Entreprise: <strong>{company.name}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <ActionButton
            onClick={() => alert("Action Importer à définir")}
            variant="secondary"
            size="medium"
            customTextColor="#E9C46A"
            customBorderColor="#E9C46A"
          >
            Importer
          </ActionButton>

          <ActionButton
            onClick={handleComposeClick}
            variant="primary"
            size="large"
            customColor="#E9C46A"
          >
            Composer
          </ActionButton>
        </div>
      </div>

      {/* Table des emails */}
      {user?._id ? (
        <EmailTable userId={user._id} />
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: "#f44336" }}>
          <p>Utilisateur non identifié</p>
        </div>
      )}

      {/* Modal de composition */}
      <EmailComposeModal
        isOpen={isComposeModalOpen}
        onClose={handleCloseCompose}
        userId={user?._id || ""}
        companyId={company._id}
      />
    </div>
  );
};

export default MailList;
