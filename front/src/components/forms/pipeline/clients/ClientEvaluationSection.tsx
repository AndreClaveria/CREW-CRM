// /components/form/client/ClientEvaluationSection.tsx
import React from "react";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

interface ClientEvaluationSectionProps {
  goodForCustomer: number;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ClientEvaluationSection: React.FC<ClientEvaluationSectionProps> = ({
  goodForCustomer,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Évaluation</h2>

      <div>
        <label style={styles.label}>
          Indicateur "bonne poire" ({goodForCustomer}/100)
        </label>
        <input
          type="range"
          name="goodForCustomer"
          value={goodForCustomer}
          onChange={handleChange}
          min="0"
          max="100"
          step="5"
          style={styles.rangeInput}
        />
        <div style={styles.rangeLegend}>
          <span>0 - Difficile</span>
          <span>50 - Moyen</span>
          <span>100 - Facile</span>
        </div>
      </div>
    </div>
  );
};

export default ClientEvaluationSection;
