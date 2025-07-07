// components/modals/ProfileModal/ProfileEdit.tsx
import React from "react";
import { profileModalStyles } from "@/styles/components/modals/ProfileModal/profileModalStyles";
import { ProfileEditProps } from "./types";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useUserUpdate } from "@/hooks/useUserUpdate";

const ProfileEdit: React.FC<ProfileEditProps> = ({
  userData,
  userId,
  updateUserData,
  onUserUpdate,
}) => {
  const { updateUser } = useUserUpdate({
    updateUserData,
    onUserUpdate,
  });

  const {
    formData,
    error: formError,
    success,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useProfileForm({
    initialData: userData,
    onSubmit: (data) => updateUser(userId, data),
  });

  return (
    <div>
      <h2 style={profileModalStyles.h2}>Modifier mes informations</h2>
      {formError && <div style={profileModalStyles.error}>{formError}</div>}
      {success && <div style={profileModalStyles.sucess}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Prénom*</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={profileModalStyles.inputField}
            required
          />
        </div>

        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Nom*</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={profileModalStyles.inputField}
            required
          />
        </div>

        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={profileModalStyles.inputField}
            required
          />
        </div>

        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>Téléphone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            style={profileModalStyles.inputField}
            placeholder="Ex: 06 12 34 56 78"
          />
        </div>

        <div>
          <button
            type="submit"
            style={{
              ...profileModalStyles.buttonPrimary,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
