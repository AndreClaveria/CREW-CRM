// /components/form/client/ClientSettingsSection.tsx
import React from "react";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

interface ClientSettingsSectionProps {
  isActive: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ClientSettingsSection: React.FC<ClientSettingsSectionProps> = ({
  isActive,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          name="isActive"
          checked={isActive}
          onChange={handleChange}
          id="activeCheckbox"
          style={styles.checkbox}
        />
        <label htmlFor="activeCheckbox">Client actif</label>
      </div>
    </div>
  );
};

export default ClientSettingsSection;
