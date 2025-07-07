"use client";

import React, { useState, use } from "react";
import { useClientDetails } from "@/hooks/useClientDetails";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import ActionButton from "@/components/common/ActionButton";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";
import ClientHeader from "./ClientHeader";
import ClientInfoCard from "./ClientInfoCard";
import ClientConnectionsCard from "./ClientConnectionsCard";
import ClientContactsCard from "./ClientContactsCard";
import ClientOpportunitiesCard from "./ClientOpportunitiesCard";
import DeleteClientModal from "./DeleteClientModal";
import { useNavigation } from "@/utils/navigateBack";
interface ClientDetailsProps {
  params: Promise<{
    clientId: string;
  }>;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ params }) => {
  // Utilisation du hook personnalisé pour gérer la logique des détails du client
  const unwrappedParams = use(params);
  const clientId = unwrappedParams.clientId;

  const { user, isLoading: isAuthLoading } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    client,
    company,
    team,
    assignedUser,
    contacts,
    opportunities,
    isLoading,
    error,
    updateClientDetails,
    deleteClientAndNavigate,
    navigateToCompany,
    navigateToTeam,
    navigateToAssignedUser,
    navigateToContact,
    navigateToOpportunity,
    navigateToContactsManagement,
    navigateToOpportunitiesManagement,
    navigateToMailPage,
  } = useClientDetails(clientId);

  const { navigateBack } = useNavigation();
  // Vérification de l'accès
  const hasAccess = useRoleCheck({
    isLoading: isAuthLoading,
    user,
    requiredRole: [], // Plus besoin de vérifier les rôles
    redirectPath: "/dashboard",
  });

  // Formater la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Formater le montant en euros
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Gérer la suppression du client
  const handleDeleteClient = async () => {
    const success = await deleteClientAndNavigate();
    if (!success) {
      setShowDeleteModal(false);
    }
  };

  if (isAuthLoading || !user || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        Chargement des informations du client...
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

  if (!client) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Client non trouvé</h2>
        <ActionButton onClick={navigateBack} variant="secondary" size="medium">
          Retour à la liste des clients
        </ActionButton>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <ClientHeader
        clientName={client.name}
        clientId={clientId}
        company={company}
        navigateBack={navigateBack}
        onDeleteClick={() => setShowDeleteModal(true)}
      />

      <div style={styles.contentGrid}>
        {/* Panneau gauche - Informations du client et connexions */}
        <div style={styles.leftPanel}>
          <ClientInfoCard client={client} formatDate={formatDate} />

          <ClientConnectionsCard
            company={company}
            team={team}
            assignedUser={assignedUser}
            opportunities={opportunities}
            navigateToCompany={navigateToCompany}
            navigateToTeam={navigateToTeam}
            navigateToAssignedUser={navigateToAssignedUser}
            formatMoney={formatMoney}
          />
        </div>

        {/* Panneau droit - Contacts et opportunités */}
        <div style={styles.rightPanel}>
          <ClientContactsCard
            contacts={contacts}
            navigateToContact={navigateToContact}
            navigateToContactsManagement={navigateToContactsManagement}
            navigateToMailPage={navigateToMailPage}
          />

          <ClientOpportunitiesCard
            opportunities={opportunities}
            navigateToOpportunity={navigateToOpportunity}
            navigateToOpportunitiesManagement={
              navigateToOpportunitiesManagement
            }
            formatMoney={formatMoney}
          />
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <DeleteClientModal
          clientName={client.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteClient}
        />
      )}
    </div>
  );
};

export default ClientDetails;
