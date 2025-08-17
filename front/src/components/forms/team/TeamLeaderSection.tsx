// /components/form/team/TeamLeaderSection.tsx
import React from "react";
import { teamFormStyles as styles } from "@/styles/components/forms/TeamFormStyles";
import { User } from "@/services/user.service";

interface TeamLeaderSectionProps {
  leader: string;
  users: User[];
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const TeamLeaderSection: React.FC<TeamLeaderSectionProps> = ({
  leader,
  users,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Chef d’équipe</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Sélectionner un chef d’équipe</label>
        <select
          name="leader"
          value={leader}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Aucun chef d’équipe</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {`${user.firstName} ${user.lastName} (${user.email})`}
            </option>
          ))}
        </select>
        <p style={styles.helperText}>
          Le chef d’équipe sera automatiquement ajouté comme membre de l’équipe.
        </p>
      </div>
    </div>
  );
};

export default TeamLeaderSection;
