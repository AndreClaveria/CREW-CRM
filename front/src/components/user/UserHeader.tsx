import React from "react";
import { userDetailsStyles as styles } from "@/styles/pages/dashboard/admin/userDetailsStyles";
import {
  FaArrowLeft,
  FaPencilAlt,
  FaUserTimes,
  FaUserCheck,
} from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface UserHeaderProps {
  user: any;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  toggleUserStatus: () => Promise<void>;
  navigateBack: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  isEditing,
  setIsEditing,
  toggleUserStatus,
  navigateBack,
}) => {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.pageTitle}>
          <FaArrowLeft style={{ cursor: "pointer" }} onClick={navigateBack} />
          Détails de l'utilisateur
        </h1>
        <div style={styles.pageSubtitle}>
          Gestion et informations de l'utilisateur
        </div>
      </div>
      <div style={styles.buttonContainer}>
        {!isEditing ? (
          <>
            <ActionButton
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="medium"
            >
              <FaPencilAlt style={{ marginRight: "8px" }} />
              Modifier
            </ActionButton>
            <ActionButton
              onClick={toggleUserStatus}
              variant={user.active ? "danger" : "success"}
              size="medium"
            >
              {user.active ? (
                <>
                  <FaUserTimes style={{ marginRight: "8px" }} />
                  Désactiver
                </>
              ) : (
                <>
                  <FaUserCheck style={{ marginRight: "8px" }} />
                  Activer
                </>
              )}
            </ActionButton>
          </>
        ) : (
          <ActionButton
            onClick={() => setIsEditing(false)}
            variant="secondary"
            size="medium"
          >
            Annuler
          </ActionButton>
        )}
      </div>
    </div>
  );
};

export default UserHeader;
