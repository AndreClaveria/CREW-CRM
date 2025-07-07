"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useContactForm } from "@/hooks/useContactForm";
import { contactStyles as styles } from "@/styles/components/forms/ContactFormStyles";
import ActionButton from "@/components/common/ActionButton";
import { useNavigation } from "@/hooks/useNavigation";

export default function AddContactPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const { navigateToContact } = useNavigation();

  const { formData, loading, error, success, handleChange, handleSubmit } =
    useContactForm(companyId);

  const handleBack = () => {
    navigateToContact("list");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingMessage}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1
          style={{
            fontSize: "50px",
            marginBottom: "8px",
          }}
        >
          Créer un contact
        </h1>
        <ActionButton
          onClick={handleBack}
          variant="secondary"
          size="large"
          customTextColor="#E9C46A"
          customBorderColor="#E9C46A"
        >
          Retour
        </ActionButton>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.flexRow}>
          <div style={styles.flexColumn}>
            <label style={styles.label}>
              Prénom <span style={styles.requiredField}>*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.flexColumn}>
            <label style={styles.label}>
              Nom <span style={styles.requiredField}>*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Poste</label>
          <input
            type="text"
            name="position"
            value={formData.position || ""}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.flexRow}>
          <div style={styles.flexColumn}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.flexColumn}>
            <label style={styles.label}>Téléphone fixe</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="isPrimary"
              checked={formData.isPrimary || false}
              onChange={handleChange}
              style={styles.checkbox}
            />
            Contact principal
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            style={styles.textarea}
            rows={4}
          />
        </div>

        <div style={styles.buttonContainer}>
          <ActionButton
            onClick={handleBack}
            variant="secondary"
            size="large"
            customTextColor="#E9C46A"
            customBorderColor="#E9C46A"
          >
            Annuler
          </ActionButton>
          <button type="submit" style={styles.submitButton}>
            Créer
          </button>
        </div>
      </form>
    </div>
  );
}
