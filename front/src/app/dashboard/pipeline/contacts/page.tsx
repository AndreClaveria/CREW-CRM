"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useContact } from "@/hooks/useContact";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import ContactTable from "@/components/pipeline/contacts/ContactTable";
import ActionButton from "@/components/common/ActionButton";

const ContactList: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();

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

  const {
    contacts,
    loading: isLoadingContacts,
    error: contactsError,
  } = useContact({ companyId: dashboardData?.company?._id });

  if (isLoadingAuth || isLoadingDashboard || !hasAccess) {
    return null;
  }

  const error = dashboardError || contactsError;
  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
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
        <p>Vous n'avez pas encore d'entreprise associée à votre compte.</p>
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
            }}
          >
            Contacts
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
            onClick={() =>
              router.push(`/dashboard/pipeline/contacts/add/${company._id}`)
            }
            variant="primary"
            size="large"
            customColor="#E9C46A"
          >
            Créer contact
          </ActionButton>
        </div>
      </div>

      <ContactTable
        contacts={contacts}
        companyId={company._id}
        isLoading={isLoadingContacts}
      />
    </div>
  );
};

export default ContactList;
