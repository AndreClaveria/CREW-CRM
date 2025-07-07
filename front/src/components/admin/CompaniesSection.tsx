import React from "react";
import { adminDashboardStyles as styles } from "@/styles/pages/dashboard/admin/adminDashboardStyles";
import { FaBuilding, FaCog } from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";
import CompaniesTable from "@/components/admin/company/CompaniesTable";

interface CompaniesSectionProps {
  companies: any[];
  navigateToCompanyDetails: (companyId: string) => void;
  navigateToCompanyManagement: () => void;
}

const CompaniesSection: React.FC<CompaniesSectionProps> = ({
  companies,
  navigateToCompanyDetails,
  navigateToCompanyManagement,
}) => {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaBuilding style={styles.sectionIcon} />
          Entreprises
        </h2>
        <ActionButton
          onClick={navigateToCompanyManagement}
          variant="primary"
          size="small"
        >
          <FaCog style={{ marginRight: "8px" }} />
          Gérer les entreprises
        </ActionButton>
      </div>

      <div style={styles.dataCard}>
        <CompaniesTable
          companies={companies}
          maxDisplayed={3}
          navigateToCompanyDetails={navigateToCompanyDetails}
          navigateToCompanyManagement={navigateToCompanyManagement}
          showViewMore={true}
        />
      </div>
    </div>
  );
};

export default CompaniesSection;
