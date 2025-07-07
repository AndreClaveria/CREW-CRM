// /components/form/team/TeamInfoSection.tsx
import React from "react";
import { teamFormStyles as styles } from "@/styles/components/forms/TeamFormStyles";

interface TeamInfoSectionProps {
  name: string;
  description: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const TeamInfoSection: React.FC<TeamInfoSectionProps> = ({
  name,
  description,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Informations de l'équipe</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Nom de l'équipe <span style={styles.requiredField}>*</span>
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

export default TeamInfoSection;
