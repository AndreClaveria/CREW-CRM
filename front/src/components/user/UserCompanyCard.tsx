import React from "react";
import { userDetailsStyles as styles } from "@/styles/pages/dashboard/admin/userDetailsStyles";
import { FaBuilding, FaExclamationTriangle } from "react-icons/fa";

interface UserCompanyCardProps {
  user: any;
  managedCompany: any;
  navigateToCompany: (companyId: string) => void;
}

const UserCompanyCard: React.FC<UserCompanyCardProps> = ({
  user,
  managedCompany,
  navigateToCompany,
}) => {
  return (
    <>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaBuilding style={styles.sectionIcon} />
          Entreprise
        </h2>
      </div>
      <div style={styles.card}>
        {managedCompany ? (
          <div
            style={styles.companyCard}
            onClick={() => navigateToCompany(managedCompany._id)}
          >
            <div style={styles.companyLogo}>
              <FaBuilding size={24} />
            </div>
            <div style={styles.companyInfo}>
              <div style={styles.companyName}>{managedCompany.name}</div>
              <div style={styles.companyDetails}>
                {managedCompany.industry || "Secteur non spécifié"} •{" "}
                {user.role === "manager" ? "Manager" : "Administrateur"}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.noDataCard}>
            <FaExclamationTriangle style={styles.noDataIcon} />
            <div style={styles.noDataText}>
              {user.role === "manager"
                ? "Cet utilisateur n'a pas encore créé d'entreprise."
                : "Cet utilisateur n'est pas manager d'une entreprise."}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserCompanyCard;
