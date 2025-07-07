// components/forms/client/ClientForm.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useClientForm } from "@/hooks/useClientForm";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";
import ClientInfoSection from "./ClientInfoSection";
import ClientContactSection from "./ClientContactSection";
import ClientAddressSection from "./ClientAddressSection";
import ContactsSection from "../contacts/ContactsSection";
import ActionButton from "@/components/common/ActionButton";
import ClientAssignmentSection from "./ClientAssignmentSection";

interface ClientFormProps {
  mode: "create" | "edit";
  companyId: string;
  clientId?: string;
}

const ClientForm: React.FC<ClientFormProps> = ({
  mode,
  companyId,
  clientId,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Utilisation du hook personnalisé
  const {
    formData,
    contacts,
    error,
    success,
    dataLoading,
    currentStep,
    steps,
    progressPercentage,
    nextStep,
    prevStep,
    handleChange,
    addContact,
    removeContact,
    handleContactChange,
    handleSubmit,
    users,
  } = useClientForm({
    mode,
    companyId,
    clientId,
  });

  // Affichage conditionnel pendant le chargement
  if (isLoading || !user) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  // Affichage pendant le chargement des données spécifiques à cette page
  if (dataLoading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Chargement des données...</p>
      </div>
    );
  }

  // Rendu du stepper (indicateur d'étapes)
  const renderStepper = () => (
    <div style={styles.stepperContainer}>
      <div style={styles.stepperSteps}>
        <div style={styles.stepperLine}></div>
        {steps.map((step) => (
          <div key={step.number} style={styles.stepperStep}>
            <div
              style={{
                ...styles.stepperCircle,
                ...(currentStep === step.number
                  ? styles.stepperActiveCircle
                  : {}),
                ...(currentStep > step.number
                  ? styles.stepperCompletedCircle
                  : {}),
              }}
            >
              {currentStep > step.number ? "✓" : step.number}
            </div>
            <div
              style={{
                ...styles.stepperLabel,
                ...(currentStep === step.number
                  ? styles.stepperActiveLabel
                  : {}),
              }}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.stepperProgressBar}>
        <div
          style={{
            ...styles.stepperProgress,
            width: `${progressPercentage}%`,
          }}
        ></div>
      </div>
    </div>
  );

  // Styles additionnels pour le récapitulatif en colonnes
  const twoColumnLayout = {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "20px",
  };

  const leftColumn = {
    flex: "1 1 400px",
  };

  const rightColumn = {
    flex: "1 1 300px",
  };

  // Rendu du contenu de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.container}>
            <ClientInfoSection
              name={formData.name}
              sector={formData.sector}
              description={formData.description}
              handleChange={handleChange}
            />
          </div>
        );

      case 2:
        return (
          <div style={styles.container}>
            <ClientContactSection
              email={formData.email}
              phone={formData.phone}
              handleChange={handleChange}
            />
            <ClientAddressSection
              address={formData.address}
              handleChange={handleChange}
            />
          </div>
        );

      case 3:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Attribution</h2>
            <ClientAssignmentSection
              assignedTo={formData.assignedTo}
              users={users}
              onAssignedToChange={(value: string) =>
                handleChange({
                  target: { name: "assignedTo", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            />
          </div>
        );

      case 4:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Contacts du client</h2>
            <ContactsSection
              contacts={contacts}
              addContact={addContact}
              removeContact={removeContact}
              handleContactChange={handleContactChange}
            />
          </div>
        );
    }
  };

  const getBackUrl = () => {
    return `/dashboard/pipeline/clients?company=${companyId}`;
  };

  // Rendu des boutons de navigation
  const renderNavigationButtons = () => (
    <div style={styles.buttonContainer}>
      {currentStep > 1 ? (
        <button type="button" onClick={prevStep} style={styles.prevButton}>
          ← Précédent
        </button>
      ) : (
        <ActionButton
          onClick={() => router.push(getBackUrl())}
          variant="secondary"
          size="medium"
          customTextColor="#A3B18A"
          customBorderColor="#A3B18A"
        >
          Annuler
        </ActionButton>
      )}

      {currentStep < steps.length ? (
        <ActionButton
          onClick={nextStep}
          variant="primary"
          size="large"
          customColor="#A3B18A"
        >
          Suivant →
        </ActionButton>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          style={styles.submitStepperButton}
        >
          {mode === "create"
            ? "Créer le client"
            : "Enregistrer les modifications"}
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1
            style={{
              fontSize: "50px",
              marginBottom: "8px",
              color: "#333333",
              fontFamily: "var(--font-first)",
            }}
          >
            {mode === "create" ? "Ajouter un client" : "Modifier le client"}
          </h1>
        </div>
        <ActionButton
          onClick={() => router.push(getBackUrl())}
          variant="secondary"
          size="large"
          customTextColor="#A3B18A"
          customBorderColor="#A3B18A"
        >
          Retour à la liste
        </ActionButton>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepper()}
        {renderStepContent()}
        {renderNavigationButtons()}
      </form>
    </div>
  );
};

export default ClientForm;
