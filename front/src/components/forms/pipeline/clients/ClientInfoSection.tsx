// /components/form/client/ClientInfoSection.tsx
import React from "react";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

interface ClientInfoSectionProps {
  name: string;
  sector: string;
  description: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  name,
  sector,
  description,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Informations du client</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Nom & Prénom du client <span style={styles.requiredField}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Secteur d'activité</label>
        <input
          type="text"
          name="sector"
          value={sector}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          rows={4}
          style={styles.textarea}
        />
      </div>
    </div>
  );
};

export default ClientInfoSection;
