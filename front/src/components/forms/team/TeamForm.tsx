// /components/form/team/TeamForm.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTeamForm } from "@/hooks/useTeamForm";
import { teamFormStyles as styles } from "@/styles/components/forms/TeamFormStyles";

// Import des sous-composants
import TeamInfoSection from "./TeamInfoSection";
import TeamLeaderSection from "./TeamLeaderSection";
import TeamSettingsSection from "./TeamSettingsSection";

interface TeamFormProps {
  mode: "create" | "edit";
  companyId: string;
  teamId?: string;
}

const TeamForm: React.FC<TeamFormProps> = ({ mode, companyId, teamId }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Utilisation du hook personnalisé
  const {
    formData,
    company,
    users,
    originalTeam,
    error,
    success,
    isLoadingData,
    handleChange,
    handleSubmit,
  } = useTeamForm({
    mode,
    companyId,
    teamId,
  });

  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Si chargement des données, afficher un loader
  if (isLoadingData || (mode === "edit" && !originalTeam)) {
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
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {mode === "create" ? "Ajouter une équipe" : "Modifier l'équipe"}
          </h1>
          {company && (
            <p style={styles.subTitle}>
              Entreprise: <strong>{company.name}</strong>
            </p>
          )}
        </div>
        <button
          onClick={() => router.push(`/dashboard/teams`)}
          style={styles.backButton}
        >
          Retour à la liste
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.container}>
          <TeamInfoSection
            name={formData.name}
            description={formData.description}
            handleChange={handleChange}
          />

          <TeamLeaderSection
            leader={formData.leader}
            users={users}
            handleChange={handleChange}
          />

          <TeamSettingsSection
            isActive={formData.isActive}
            handleChange={handleChange}
          />

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/teams`)}
              style={styles.cancelButton}
            >
              Annuler
            </button>

            <button type="submit" style={styles.submitButton}>
              {mode === "create"
                ? "Créer l'équipe"
                : "Enregistrer les modifications"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
