// /components/form/company/CompanySettings.tsx
import React from "react";
import { companyFormStyles as styles } from "@/styles/components/forms/CompanyFormStyles";

interface CompanySettingsProps {
  isActive: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({
  isActive,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Paramètres</h2>

      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          name="isActive"
          checked={isActive}
          onChange={handleChange}
          id="activeCheckbox"
          style={styles.checkbox}
        />
        <label htmlFor="activeCheckbox">Entreprise active</label>
      </div>
    </div>
  );
};

export default CompanySettings;
