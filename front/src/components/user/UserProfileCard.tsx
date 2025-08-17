import React from "react";
import { userDetailsStyles as styles } from "@/styles/pages/dashboard/admin/userDetailsStyles";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheck,
  FaUserShield,
} from "react-icons/fa";

interface UserProfileCardProps {
  user: any;
  formatDate: (dateString?: string) => string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  formatDate,
}) => {
  return (
    <>
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </div>
        <div style={styles.profileInfo}>
          <h2 style={styles.profileName}>
            {user.firstName} {user.lastName}
          </h2>
          <div style={styles.profileEmail}>{user.email}</div>
          <div style={styles.profileBadges}>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: user.active ? "#4caf50" : "#f44336",
              }}
            >
              {user.active ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.divider}></div>

      <div style={styles.detailsGrid}>
        <div style={styles.detailsItem}>
          <div style={styles.detailsLabel}>
            <FaUser style={{ marginRight: "8px" }} />
            Prénom
          </div>
          <div style={styles.detailsValue}>{user.firstName}</div>
        </div>
        <div style={styles.detailsItem}>
          <div style={styles.detailsLabel}>
            <FaUser style={{ marginRight: "8px" }} />
            Nom
          </div>
          <div style={styles.detailsValue}>{user.lastName}</div>
        </div>
        <div style={styles.detailsItem}>
          <div style={styles.detailsLabel}>
            <FaEnvelope style={{ marginRight: "8px" }} />
            Email
          </div>
          <div style={styles.detailsValue}>{user.email}</div>
        </div>
        <div style={styles.detailsItem}>
          <div style={styles.detailsLabel}>
            <FaPhone style={{ marginRight: "8px" }} />
            Téléphone
          </div>
          <div style={styles.detailsValue}>
            {user.phoneNumber || "Non renseigné"}
          </div>
        </div>
        {user.lastLogin && (
          <div style={styles.detailsItem}>
            <div style={styles.detailsLabel}>
              <FaCalendarAlt style={{ marginRight: "8px" }} />
              Dernière connexion
            </div>
            <div style={styles.detailsValue}>{formatDate(user.lastLogin)}</div>
          </div>
        )}
        <div style={styles.detailsItem}>
          <div style={styles.detailsLabel}>
            <FaCheck style={{ marginRight: "8px" }} />
            Statut
          </div>
          <div style={styles.detailsValue}>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: user.active ? "#4caf50" : "#f44336",
              }}
            >
              {user.active ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>
        {user.provider && (
          <div style={styles.detailsItem}>
            <div style={styles.detailsLabel}>
              <FaUserShield style={{ marginRight: "8px" }} />
              Méthode d’authentification
            </div>
            <div style={styles.detailsValue}>{user.provider}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfileCard;
