"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useContactDetails } from "@/hooks/useContactDetails";
import { contactStyles as styles } from "@/styles/components/forms/ContactFormStyles";
import ActionButton from "@/components/common/ActionButton";
import { useNavigation } from "@/hooks/useNavigation";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ContactDetailsPage() {
  const params = useParams();
  const contactId = params.contactId as string;
  const companyId = params.companyId as string;
  const router = useRouter();

  const { contact, loading, error } = useContactDetails({
    contactId,
  });

  const handleBack = () => {
    router.push(`/dashboard/pipeline/contacts`);
  };

  const handleEdit = () => {
    if (contact) {
      router.push(
        `/dashboard/pipeline/contacts/edit/${companyId}/${contactId}`
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingMessage}>Chargement du contact...</div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>{error || "Contact non trouvé"}</div>
        <ActionButton
          onClick={handleBack}
          variant="secondary"
          size="medium"
          customTextColor="#E9C46A"
          customBorderColor="#E9C46A"
        >
          Retour
        </ActionButton>
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
          Détails du contact
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <ActionButton
            onClick={handleEdit}
            variant="primary"
            size="large"
            customColor="#E9C46A"
          >
            <FaEdit style={{ marginRight: "8px" }} />
            Modifier
          </ActionButton>
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
      </div>

      <div style={styles.form}>
        <div style={styles.flexRow}>
          <div style={styles.flexColumn}>
            <label style={styles.label}>Prénom</label>
            <div style={styles.displayField}>{contact.firstName}</div>
          </div>

          <div style={styles.flexColumn}>
            <label style={styles.label}>Nom</label>
            <div style={styles.displayField}>{contact.lastName}</div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Poste</label>
          <div style={styles.displayField}>
            {contact.position || "Non renseigné"}
          </div>
        </div>

        <div style={styles.flexRow}>
          <div style={styles.flexColumn}>
            <label style={styles.label}>Email</label>
            <div style={styles.displayField}>
              {contact.email || "Non renseigné"}
            </div>
          </div>

          <div style={styles.flexColumn}>
            <label style={styles.label}>Téléphone fixe</label>
            <div style={styles.displayField}>
              {contact.phone || "Non renseigné"}
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile</label>
          <div style={styles.displayField}>
            {contact.mobile || "Non renseigné"}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contact principal</label>
          <div style={styles.displayField}>
            {contact.isPrimary ? "Oui" : "Non"}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Notes</label>
          <div style={styles.displayField}>
            {contact.notes || "Aucune note"}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Statut</label>
          <div style={styles.displayField}>
            {contact.isActive ? "Actif" : "Inactif"}
          </div>
        </div>
      </div>
    </div>
  );
}
