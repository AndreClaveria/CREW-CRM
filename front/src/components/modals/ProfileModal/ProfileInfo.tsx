import React, { useState } from "react";
import { profileModalStyles } from "@/styles/components/modals/ProfileModal/profileModalStyles";
import { ProfileInfoProps } from "./types";

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userData }) => {
  const [language, setLanguage] = useState("Français");

  const initials = `${userData.firstName?.charAt(0) || ""}${
    userData.lastName?.charAt(0) || ""
  }`;

  return (
    <div>
      <div style={profileModalStyles.profileHeader}>
        <div style={profileModalStyles.avatar}>
          {userData.avatar ? (
            <img src={userData.avatar} alt="Avatar" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div style={profileModalStyles.profileInfo}>
          <h2 style={profileModalStyles.h2}>
            {`${userData.firstName} ${userData.lastName}`}
          </h2>
          <span style={profileModalStyles.roleBadge}>
            {userData.role === "admin"
              ? "Admin"
              : userData.role === "manager"
              ? "Manager"
              : "Utilisateur"}
          </span>
        </div>
      </div>

      <div style={profileModalStyles.formField}>
        <label style={profileModalStyles.fieldLabel}>Email</label>
        <p style={profileModalStyles.fieldValue}>{userData.email}</p>
      </div>

      <div style={profileModalStyles.formField}>
        <label style={profileModalStyles.fieldLabel}>Téléphone</label>
        <p style={profileModalStyles.fieldValue}>
          {userData.phone || userData.phoneNumber || "Non renseigné"}
        </p>
      </div>

      <div style={profileModalStyles.formField}>
        <label style={profileModalStyles.fieldLabel}>Langue d’affichage</label>
        <div style={profileModalStyles.languageContainer}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={profileModalStyles.select}
          >
            <option>Français</option>
            <option>English</option>
            <option>Español</option>
            <option>Deutsch</option>
          </select>
          <button style={profileModalStyles.button}>Appliquer</button>
        </div>
        <p style={profileModalStyles.p}>
          Cette langue sera utilisée dans toute l’interface du CRM.
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
