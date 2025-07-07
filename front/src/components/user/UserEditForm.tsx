import React from "react";
import { userDetailsStyles as styles } from "@/styles/pages/dashboard/admin/userDetailsStyles";
import { FaSave } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface UserEditFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
  isSaving: boolean;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setIsEditing,
  isSaving,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="firstName">
          Prénom
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="lastName">
          Nom
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="phoneNumber">
          Téléphone
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber || ""}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.actionsContainer}>
        <ActionButton
          onClick={() => setIsEditing(false)}
          variant="secondary"
          size="medium"
        >
          Annuler
        </ActionButton>
        <ActionButton
          onClick={() => setIsEditing(false)}
          variant="info"
          size="medium"
        >
          <FaSave style={{ marginRight: "8px" }} />
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </ActionButton>
      </div>
    </form>
  );
};

export default UserEditForm;
