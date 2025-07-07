// /components/form/team/TeamSettingsSection.tsx
import React from "react";
import { teamFormStyles as styles } from "@/styles/components/forms/TeamFormStyles";

interface TeamSettingsSectionProps {
  isActive: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const TeamSettingsSection: React.FC<TeamSettingsSectionProps> = ({
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
        <label htmlFor="activeCheckbox">Équipe active</label>
      </div>
    </div>
  );
};

export default TeamSettingsSection;
