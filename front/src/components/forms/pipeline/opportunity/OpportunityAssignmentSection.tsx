// /components/forms/opportunities/OpportunityAssignmentSection.tsx
import React from "react";
import { User } from "@/services/user.service";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";

interface OpportunityAssignmentSectionProps {
  users: User[];
  assignedTo: string;
  onAssignedToChange: (value: string) => void;
}

export const OpportunityAssignmentSection: React.FC<
  OpportunityAssignmentSectionProps
> = ({ users, assignedTo, onAssignedToChange }) => {
  const teamUsers = users;

  return (
    <div style={styles.sectionContainer}>
      <h3 style={styles.subSectionTitle}>Responsable</h3>
      <div style={styles.formGroup}>
        <label htmlFor="assignedTo" style={styles.label}>
          Personne en charge
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          value={assignedTo}
          onChange={(e) => onAssignedToChange(e.target.value)}
          style={styles.select}
        >
          <option value="">Sélectionner un responsable</option>
          {teamUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName} - {user.role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
