// /components/form/client/ClientContactSection.tsx
import React from "react";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

interface ClientContactSectionProps {
  email: string;
  phone: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ClientContactSection: React.FC<ClientContactSectionProps> = ({
  email,
  phone,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Coordonnées</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Email <span style={styles.requiredField}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Téléphone</label>
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default ClientContactSection;
