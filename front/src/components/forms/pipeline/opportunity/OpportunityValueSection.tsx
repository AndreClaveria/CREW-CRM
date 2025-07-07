// /components/forms/opportunities/OpportunityValueSection.tsx
import React from "react";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";

interface OpportunityValueSectionProps {
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OpportunityValueSection: React.FC<OpportunityValueSectionProps> = ({
  value,
  handleChange,
}) => {
  return (
    <div style={styles.sectionContainer}>
      <div style={styles.formGroup}>
        <label htmlFor="value" style={styles.label}>
          Valeur (€) <span style={styles.required}>*</span>
        </label>
        <input
          type="number"
          id="value"
          name="value"
          value={value}
          onChange={handleChange}
          style={styles.input}
          required
          min="0"
          step="1"
          placeholder="Montant en euros"
        />
        <small style={styles.helperText}>
          Valeur estimée de l'opportunité en euros
        </small>
      </div>
    </div>
  );
};

export default OpportunityValueSection;
