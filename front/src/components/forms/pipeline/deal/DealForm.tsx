// /components/forms/pipeline/deal/DealForm.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dealFormStyles as styles } from "@/styles/components/forms/DealFormStyles";
import ActionButton from "@/components/common/ActionButton";
import { useDealForm } from "@/hooks/useDealForm";
import { Client, getClientsByCompany } from "@/services/client.service";

interface DealFormProps {
  mode?: "create" | "edit";
  companyId?: string;
  clientId?: string;
  dealId?: string;
}

const DealForm: React.FC<DealFormProps> = ({
  mode = "create",
  companyId,
  clientId,
  dealId,
}) => {
  const router = useRouter();
  const {
    formData,
    setFormData,
    dataLoading,
    error,
    success,
    currentStep,
    totalSteps,
    steps,
    progressPercentage,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit,
  } = useDealForm({ mode, companyId, clientId, dealId });

  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const needsClientSelection = !clientId && !!companyId;

  useEffect(() => {
    const loadClients = async () => {
      if (!needsClientSelection || !companyId) return;
      try {
        setClientsLoading(true);
        const list = await getClientsByCompany(companyId);
        setClients(list);
      } catch (e) {
        // noop, l’erreur sera affichée via error global si nécessaire
      } finally {
        setClientsLoading(false);
      }
    };
    loadClients();
  }, [needsClientSelection, companyId]);

  if (dataLoading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Chargement des données...</p>
      </div>
    );
  }

  const getBackUrl = () => "/dashboard/pipeline/deals";

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
          style={{ ...styles.stepperProgress, width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Informations du deal</h2>

            {needsClientSelection && (
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Client <span style={styles.required}>*</span>
                </label>
                {clientsLoading ? (
                  <div>Chargement des clients...</div>
                ) : (
                  <select
                    style={styles.select}
                    value={formData.client || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        client: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" disabled>
                      Sélectionnez un client
                    </option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Titre <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.input as React.CSSProperties}
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Valorisation</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Valeur (€) <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Statut</label>
              <select
                style={styles.select}
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="prospection">Prospection</option>
                <option value="qualification">Qualification</option>
                <option value="proposition">Proposition</option>
                <option value="negociation">Négociation</option>
                <option value="signature">Signature</option>
                <option value="perdu">Perdu</option>
                <option value="gagne">Gagné</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Probabilité (%)</label>
              <input
                style={styles.input}
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date de clôture</label>
              <input
                style={styles.input}
                type="date"
                name="expectedClosingDate"
                value={formData.expectedClosingDate || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Notes</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes</label>
              <textarea
                style={styles.input as React.CSSProperties}
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Récapitulatif</h2>
            <div style={styles.summaryContainer}>
              <div style={styles.summarySection}>
                <h3 style={styles.summarySectionTitle}>Informations</h3>
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
              </div>
              <div style={styles.summarySection}>
                <h3 style={styles.summarySectionTitle}>Valorisation</h3>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>Valeur :</div>
                  <div style={styles.summaryValue}>{formData.value} €</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>Statut :</div>
                  <div style={styles.summaryValue}>{formData.status}</div>
                </div>
                <div style={styles.summaryItem}>
                  <div style={styles.summaryLabel}>Probabilité :</div>
                  <div style={styles.summaryValue}>{formData.probability}%</div>
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
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => (
    <div style={styles.buttonContainer}>
      {currentStep > 1 ? (
        <button type="button" onClick={prevStep} style={styles.prevButton}>
          ← Précédent
        </button>
      ) : (
        <ActionButton
          onClick={() => router.push(getBackUrl())}
          variant="primary"
          size="medium"
        >
          Retour aux deals
        </ActionButton>
      )}

      {currentStep < totalSteps ? (
        <ActionButton onClick={nextStep} variant="primary" size="large">
          Suivant →
        </ActionButton>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          style={styles.submitStepperButton}
        >
          {mode === "create"
            ? "Créer le deal"
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
            {mode === "create" ? "Ajouter un deal" : "Modifier le deal"}
          </h1>
        </div>
        <ActionButton
          onClick={() => router.push(getBackUrl())}
          variant="primary"
          size="large"
        >
          Retour aux deals
        </ActionButton>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      {renderStepper()}
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        {renderNavigationButtons()}
      </form>
    </div>
  );
};

export default DealForm;
