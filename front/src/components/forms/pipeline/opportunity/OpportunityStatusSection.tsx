// /components/forms/opportunities/OpportunityStatusSection.tsx
import React from "react";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";

interface OpportunityStatusSectionProps {
  status: "lead" | "qualified" | "proposition" | "negotiation" | "won" | "lost";
  probability: number;
  expectedClosingDate: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const OpportunityStatusSection: React.FC<OpportunityStatusSectionProps> = ({
  status,
  probability,
  expectedClosingDate,
  handleChange,
}) => {
  return (
    <div style={styles.sectionContainer}>
      <h3 style={styles.subSectionTitle}>Statut et probabilité</h3>

      <div style={styles.formGroup}>
        <label htmlFor="status" style={styles.label}>
          Statut <span style={styles.required}>*</span>
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="lead">Nouveau prospect</option>
          <option value="qualified">Qualifié</option>
          <option value="proposition">Proposition</option>
          <option value="negotiation">En négociation</option>
          <option value="won">Gagné</option>
          <option value="lost">Perdu</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="probability" style={styles.label}>
          Probabilité (%)
        </label>
        <input
          type="number"
          id="probability"
          name="probability"
          value={probability}
          onChange={handleChange}
          style={styles.input}
          min="0"
          max="100"
          step="1"
        />
        <div style={styles.sliderContainer}>
          <input
            type="range"
            min="0"
            max="100"
            value={probability}
            onChange={handleChange}
            name="probability"
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="expectedClosingDate" style={styles.label}>
          Date de clôture prévue
        </label>
        <input
          type="date"
          id="expectedClosingDate"
          name="expectedClosingDate"
          value={expectedClosingDate}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default OpportunityStatusSection;
