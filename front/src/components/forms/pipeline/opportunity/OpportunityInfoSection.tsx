// /components/forms/opportunities/OpportunityInfoSection.tsx
import React from "react";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";

interface OpportunityInfoSectionProps {
  title: string;
  description: string;
  isActive: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const OpportunityInfoSection: React.FC<OpportunityInfoSectionProps> = ({
  title,
  description,
  isActive,
  handleChange,
}) => {
  return (
    <div style={styles.sectionContainer}>
      <div style={styles.formGroup}>
        <label htmlFor="title" style={styles.label}>
          Titre <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleChange}
          style={styles.input}
          required
          placeholder="Nom de l'opportunité"
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="description" style={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={handleChange}
          style={{ ...styles.input, minHeight: "100px" }}
          placeholder="Description détaillée de l'opportunité"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.checkboxContainer}>
          <input
            type="checkbox"
            name="isActive"
            checked={isActive}
            onChange={handleChange}
            style={styles.checkbox}
          />
          <span style={styles.checkboxLabel}>Opportunité active</span>
        </label>
      </div>
    </div>
  );
};

export default OpportunityInfoSection;
