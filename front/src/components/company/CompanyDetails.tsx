"use client";

import React from "react";
import { companyDetailsStyles as styles } from "@/styles/pages/dashboard/admin/companyDetailStyles";
import CompanyHeader from "./CompanyHeader";
import CompanyInfoCard from "./CompanyInfoCard";
import CompanyManagerCard from "./CompanyManagerCard";
import CompanyTeamsCard from "./CompanyTeamsCard";
import CompanyClientsTable from "./CompanyClientsTable";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import ActionButton from "@/components/common/ActionButton";
import { useNavigation } from "@/utils/navigateBack";
import { use } from "react";

interface CompanyDetailsProps {
  params: Promise<{
    companyId: string;
  }>;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ params }) => {
  const unwrappedParams = use(params);
  const { companyId } = unwrappedParams;

  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    company,
    manager,
    teams,
    clients,
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    paginatedClients,
    updateCompanyDetails,
    navigateToTeam,
    navigateToClient,
    navigateToManager,
    navigateToTeamsManagement,
    navigateToClientsManagement,
  } = useCompanyDetails(companyId);

  const { navigateBack } = useNavigation();
  // Vérification de l'accès
  const hasAccess = useRoleCheck({
    isLoading: isAuthLoading,
    user,
    requiredRole: [], // Plus besoin de vérifier les rôles
    redirectPath: "/dashboard",
  });

  if (isAuthLoading || !user || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Chargement des informations de l&apos;entreprise...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Entreprise non trouvée</h2>
        <ActionButton onClick={navigateBack} variant="secondary" size="medium">
          Retour à la liste des entreprises
        </ActionButton>
      </div>
    );
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div style={styles.container}>
      <CompanyHeader companyId={companyId} navigateBack={navigateBack} />

      <div style={styles.contentGrid}>
        {/* Panneau gauche - Informations de l'entreprise */}
        <div style={styles.leftPanel}>
          <CompanyInfoCard company={company} formatDate={formatDate} />

          <CompanyManagerCard
            manager={manager}
            navigateToManager={navigateToManager}
          />

          <CompanyTeamsCard
            teams={teams}
            navigateToTeam={navigateToTeam}
            navigateToTeamsManagement={navigateToTeamsManagement}
          />
        </div>

        {/* Panneau droit - Clients */}
        <div style={styles.rightPanel}>
          <CompanyClientsTable
            clients={clients}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            navigateToClient={navigateToClient}
            navigateToClientsManagement={navigateToClientsManagement}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
