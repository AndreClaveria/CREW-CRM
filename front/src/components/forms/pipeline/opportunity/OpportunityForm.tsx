// /components/forms/opportunities/OpportunityForm.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOpportunityForm } from "@/hooks/useOpportunityForm";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";

// Import des sous-composants
import OpportunityInfoSection from "./OpportunityInfoSection";
import OpportunityValueSection from "./OpportunityValueSection";
import OpportunityStatusSection from "./OpportunityStatusSection";
import OpportunityNotesSection from "./OpportunityNotesSection";
import OpportunityProductsSection from "./OpportunityProductsSection";
import OpportunityContactsSection from "./OpportunityContactsSection";
import ActionButton from "@/components/common/ActionButton";
import { OpportunityAssignmentSection } from "./OpportunityAssignmentSection";

interface OpportunityFormProps {
  mode: "create" | "edit";
  companyId?: string;
  clientId: string;
  opportunityId?: string;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  mode,
  companyId,
  clientId,
  opportunityId,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Utilisation du hook personnalisé
  const {
    formData,
    products,
    client,
    users,
    availableContacts,
    selectedContacts,
    dataLoading,
    error,
    success,
    currentStep,
    totalSteps,
    steps,
    progressPercentage,
    handleChange,
    addProduct,
    removeProduct,
    handleProductChange,
    handleContactSelection,
    nextStep,
    prevStep,
    handleSubmit,
    findUserById,
    calculateProductsTotal,
  } = useOpportunityForm({
    mode,
    companyId,
    clientId,
    opportunityId,
  });

  // Affichage conditionnel pendant le chargement initial
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

  const getBackUrl = () => {
    return `/dashboard/pipeline/clients/opportunity/${clientId}`;
  };

  // Styles pour le récapitulatif
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

  // Rendu du contenu de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Informations de l'opportunité</h2>
            <OpportunityInfoSection
              title={formData.title}
              description={formData.description}
              isActive={formData.isActive}
              handleChange={handleChange}
            />
          </div>
        );

      case 2:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Valorisation</h2>
            <OpportunityValueSection
              value={formData.value}
              handleChange={handleChange}
            />
            <OpportunityStatusSection
              status={formData.status}
              probability={formData.probability}
              expectedClosingDate={formData.expectedClosingDate}
              handleChange={handleChange}
            />
          </div>
        );

      case 3:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Attribution</h2>
            <OpportunityAssignmentSection
              assignedTo={formData.assignedTo}
              users={users}
              onAssignedToChange={(value) =>
                handleChange({
                  target: { name: "assignedTo", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            />
            <OpportunityNotesSection
              notes={formData.notes}
              handleChange={handleChange}
            />
            <OpportunityContactsSection
              availableContacts={availableContacts}
              selectedContactIds={selectedContacts}
              onContactSelection={handleContactSelection}
            />
          </div>
        );

      case 4:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Produits et services</h2>
            <OpportunityProductsSection
              products={products}
              addProduct={addProduct}
              removeProduct={removeProduct}
              handleProductChange={handleProductChange}
            />
          </div>
        );

      case 5:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Récapitulatif</h2>
            <div style={twoColumnLayout}>
              {/* Colonne de gauche */}
              <div style={leftColumn}>
                <div style={styles.summaryContainer}>
                  <div style={styles.summarySection}>
                    <h3 style={styles.summarySectionTitle}>
                      Informations de l'opportunité
                    </h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Titre :</div>
                      <div style={styles.summaryValue}>{formData.title}</div>
                    </div>
                    {formData.description && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>Description :</div>
                        <div style={styles.summaryValue}>
                          {formData.description}
                        </div>
                      </div>
                    )}
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Statut :</div>
                      <div style={styles.summaryValue}>
                        {formData.isActive ? "Actif" : "Inactif"}
                      </div>
                    </div>
                  </div>

                  <div style={styles.summarySection}>
                    <h3 style={styles.summarySectionTitle}>
                      Valorisation et suivi
                    </h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Valeur :</div>
                      <div style={styles.summaryValue}>
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(formData.value)}
                      </div>
                    </div>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Statut :</div>
                      <div style={styles.summaryValue}>
                        {formData.status === "lead" && "Nouveau prospect"}
                        {formData.status === "qualified" && "Qualifié"}
                        {formData.status === "proposition" && "Proposition"}
                        {formData.status === "negotiation" && "En négociation"}
                        {formData.status === "won" && "Gagné"}
                        {formData.status === "lost" && "Perdu"}
                      </div>
                    </div>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Probabilité :</div>
                      <div style={styles.summaryValue}>
                        {formData.probability}%
                      </div>
                    </div>
                    {formData.expectedClosingDate && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>
                          Date de clôture prévue :
                        </div>
                        <div style={styles.summaryValue}>
                          {formData.expectedClosingDate}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.summarySection}>
                    <h3 style={styles.summarySectionTitle}>Attribution</h3>
                    <div style={styles.summaryItem}>
                      <div style={styles.summaryLabel}>Responsable :</div>
                      <div style={styles.summaryValue}>
                        {formData.assignedTo
                          ? findUserById(formData.assignedTo)
                          : "Non assigné"}
                      </div>
                    </div>
                    {formData.notes && (
                      <div style={styles.summaryItem}>
                        <div style={styles.summaryLabel}>Notes :</div>
                        <div style={styles.summaryValue}>{formData.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne de droite */}
              <div style={rightColumn}>
                {products.length > 0 && (
                  <div style={styles.summaryContainer}>
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>
                        Produits et services ({products.length})
                      </h3>
                      {products.map((product, index) => (
                        <div key={index} style={styles.summaryContactItem}>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Produit :</div>
                            <div style={styles.summaryValue}>
                              {product.name}
                            </div>
                          </div>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>
                              Prix unitaire :
                            </div>
                            <div style={styles.summaryValue}>
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(product.price)}
                            </div>
                          </div>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Quantité :</div>
                            <div style={styles.summaryValue}>
                              {product.quantity}
                            </div>
                          </div>
                          <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Total :</div>
                            <div style={styles.summaryValue}>
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(product.price * product.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        style={{
                          ...styles.summaryContactItem,
                          marginTop: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        <div style={styles.summaryItem}>
                          <div style={styles.summaryLabel}>
                            Total des produits :
                          </div>
                          <div style={styles.summaryValue}>
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(calculateProductsTotal())}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {products.length === 0 && (
                  <div style={styles.summaryContainer}>
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>Produits</h3>
                      <p style={{ color: "#666", fontStyle: "italic" }}>
                        Aucun produit ajouté
                      </p>
                    </div>
                  </div>
                )}

                {selectedContacts.length > 0 && (
                  <div
                    style={{ ...styles.summaryContainer, marginTop: "20px" }}
                  >
                    <div style={styles.summarySection}>
                      <h3 style={styles.summarySectionTitle}>
                        Contacts associés ({selectedContacts.length})
                      </h3>
                      <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                        {selectedContacts.map((contactId) => {
                          const contact = availableContacts.find(
                            (c) => c._id === contactId
                          );
                          return (
                            <li key={contactId} style={{ marginBottom: "8px" }}>
                              {contact
                                ? `${contact.firstName} ${contact.lastName}`
                                : contactId}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
          customTextColor="#3498DB"
          customBorderColor="#3498DB"
        >
          Annuler
        </ActionButton>
      )}

      {currentStep < totalSteps ? (
        <ActionButton
          onClick={nextStep}
          variant="primary"
          size="large"
          customColor="#3498DB"
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
            ? "Créer l'opportunité"
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
            {mode === "create"
              ? "Ajouter une opportunité"
              : "Modifier l'opportunité"}
          </h1>
          {client && (
            <p style={styles.subTitle}>
              Client: <strong>{client.name}</strong>
            </p>
          )}
        </div>
        <ActionButton
          onClick={() => router.push(getBackUrl())}
          variant="secondary"
          size="large"
          customTextColor="#3498DB"
          customBorderColor="#3498DB"
        >
          Retour aux opportunités
        </ActionButton>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      {success && <div style={styles.successMessage}>{success}</div>}

      {/* Stepper */}
      {renderStepper()}

      {/* Contenu de l'étape actuelle */}
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        {renderNavigationButtons()}
      </form>
    </div>
  );
};

export default OpportunityForm;
