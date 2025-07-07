// /components/form/company/CompanyForm.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyForm } from "@/hooks/useCompanyForm";
import { companyFormStyles as styles } from "@/styles/components/forms/CompanyFormStyles";

// Import des sous-composants
import CompanyGeneralInfo from "./CompanyGeneralInfo";
import CompanyAddressInfo from "./CompanyAddressInfo";
import CompanyContactInfo from "./CompanyContactInfo";
import CompanySettings from "./CompanySettings";

interface CompanyFormProps {
  mode: "create" | "edit";
  companyId?: string;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ mode, companyId }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Utilisation du hook personnalisé
  const {
    formData,
    originalCompany,
    error,
    success,
    isLoadingCompany,
    handleChange,
    handleSubmit,
  } = useCompanyForm({ mode, companyId });

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Si mode édition et chargement des données, afficher un message de chargement
  if (mode === "edit" && !originalCompany && isLoadingCompany) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <p>Chargement des données de l'entreprise...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {mode === "create"
            ? "Ajouter une entreprise"
            : "Modifier l'entreprise"}
        </h1>
        <button
          onClick={() => router.push(`/dashboard/companies`)}
          style={styles.backButton}
        >
          Retour à la liste
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.container}>
          <CompanyGeneralInfo
            name={formData.name}
            industry={formData.industry}
            description={formData.description}
            handleChange={handleChange}
          />

          <CompanyAddressInfo
            street={formData.street}
            city={formData.city}
            zipCode={formData.zipCode}
            country={formData.country}
            handleChange={handleChange}
          />

          <CompanyContactInfo
            email={formData.email}
            phone={formData.phone}
            website={formData.website}
            handleChange={handleChange}
          />

          <CompanySettings
            isActive={formData.isActive}
            handleChange={handleChange}
          />

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/companies`)}
              style={styles.cancelButton}
            >
              Annuler
            </button>

            <button type="submit" style={styles.submitButton}>
              {mode === "create"
                ? "Créer l'entreprise"
                : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
