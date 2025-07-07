// components/modals/ProfileModal/ProfilePassword.tsx
import React, { useState } from "react";
import { profileModalStyles } from "@/styles/components/modals/ProfileModal/profileModalStyles";
import { ProfilePasswordProps } from "./types";
import { ChangePasswordRequest } from "@/services/user.service";

const ProfilePassword: React.FC<ProfilePasswordProps> = ({
  userId,
  changePassword,
}) => {
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Tous les champs sont obligatoires.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "Le nouveau mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await changePassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess("Votre mot de passe a été modifié avec succès.");
    } catch (error: any) {
      setPasswordError(
        error.message || "Erreur lors du changement de mot de passe."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={profileModalStyles.h2}>Changer votre mot de passe</h2>
      {passwordError && (
        <div style={profileModalStyles.error}>{passwordError}</div>
      )}

      {passwordSuccess && (
        <div style={profileModalStyles.sucess}>{passwordSuccess}</div>
      )}

      <form onSubmit={handlePasswordSubmit}>
        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>
            Mot de passe actuel
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            style={profileModalStyles.inputField}
          />
        </div>
        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            style={profileModalStyles.inputField}
          />
        </div>
        <div style={profileModalStyles.formField}>
          <label style={profileModalStyles.fieldLabel}>
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            style={profileModalStyles.inputField}
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
            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </div>
      </form>

      <div style={profileModalStyles.info}>
        <p style={profileModalStyles.p}>
          <strong>Conseil de sécurité :</strong> Utilisez un mot de passe unique
          et fort contenant au moins 8 caractères, des lettres majuscules,
          minuscules, des chiffres et des caractères spéciaux.
        </p>
      </div>
    </div>
  );
};

export default ProfilePassword;
