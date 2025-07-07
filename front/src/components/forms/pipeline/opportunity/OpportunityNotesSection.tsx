// /components/forms/opportunities/OpportunityNotesSection.tsx
import React from "react";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";

interface OpportunityNotesSectionProps {
  notes: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const OpportunityNotesSection: React.FC<OpportunityNotesSectionProps> = ({
  notes,
  handleChange,
}) => {
  return (
    <div style={styles.sectionContainer}>
      <h3 style={styles.subSectionTitle}>Notes et commentaires</h3>

      <div style={styles.formGroup}>
        <label htmlFor="notes" style={styles.label}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={handleChange}
          style={{ ...styles.input, minHeight: "120px" }}
          placeholder="Ajoutez des notes, commentaires ou informations complémentaires sur cette opportunité"
        />
      </div>
    </div>
  );
};

export default OpportunityNotesSection;
