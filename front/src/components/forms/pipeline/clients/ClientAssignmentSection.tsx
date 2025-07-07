// /components/form/client/ClientAssignmentSection.tsx
import React from "react";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

interface ClientAssignmentSectionProps {
  assignedTo: string;
  users: Array<{ _id: string; firstName: string; lastName: string }>;
  onAssignedToChange: (value: string) => void;
}

const ClientAssignmentSection: React.FC<ClientAssignmentSectionProps> = ({
  assignedTo,
  users,
  onAssignedToChange,
}) => {
  return (
    <div style={styles.section}>
      <div style={styles.formGroup}>
        <label htmlFor="assignedTo" style={styles.label}>
          Responsable du client
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          value={assignedTo}
          onChange={(e) => onAssignedToChange(e.target.value)}
          style={styles.select}
        >
          <option value="">Sélectionner un responsable</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ClientAssignmentSection;
