import React from "react";
import { useRouter } from "next/navigation";
import { companyDetailsStyles as styles } from "@/styles/pages/dashboard/admin/companyDetailStyles";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyHeaderProps {
  companyId: string;
  navigateBack: () => void;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyId,
  navigateBack,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleEdit = () => {
    router.push(`/dashboard/companies/edit/${companyId}`);
  };

  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.pageTitle}>
          <FaArrowLeft style={{ cursor: "pointer" }} onClick={navigateBack} />
          Détails de l&apos;entreprise
        </h1>
        <div style={styles.pageSubtitle}>
          Gestion et informations de l&apos;entreprise
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <ActionButton onClick={handleEdit} variant="secondary" size="medium">
          <FaEdit style={{ marginRight: "8px" }} />
          Modifier
        </ActionButton>
      </div>
    </div>
  );
};

export default CompanyHeader;
