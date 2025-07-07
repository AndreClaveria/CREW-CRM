import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import ActionButton from "@/components/common/ActionButton";
import DeleteClientModal from "@/components/pipeline/clients/DeleteClientModal";
import { Client, deleteClient } from "@/services/client.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAssignedUsers } from "@/hooks/useAssignedUsers";
import { useAuth } from "@/contexts/AuthContext";
import { FaTrashAlt } from "react-icons/fa";

interface ClientTableProps {
  clients: Client[];
  companyId: string;
  isLoading: boolean;
  onStatusChange?: (clientId: string, newStatus: boolean) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  companyId,
  isLoading,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { loading: loadingUsers, getAssignedUserName } = useAssignedUsers({
    clients,
  });

  const generatePath = (action: string, clientId: string, step?: number) => {
    switch (action) {
      case "edit":
        return `/dashboard/pipeline/clients/edit/${companyId}/${clientId}${
          step ? `?step=${step}` : ""
        }`;
      case "contacts":
        return `/dashboard/pipeline/clients/${clientId}/contacts`;
      case "opportunity":
        return `/dashboard/pipeline/clients/opportunity/${clientId}`;
      default:
        return `/dashboard/pipeline/clients/${clientId}`;
    }
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      setDeletingId(clientToDelete._id);
      await deleteClient(clientToDelete._id);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      alert("Une erreur est survenue lors de la suppression du client");
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setClientToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const columns: TableColumn<Client>[] = [
    {
      header: "Nom",
      accessor: "name",
      align: "left",
    },
    {
      header: "Secteur",
      accessor: (client) => client.sector || "Non renseigné",
      align: "left",
    },
    {
      header: "Email",
      accessor: (client) => client.email || "Non renseigné",
      align: "left",
    },
    {
      header: "Assigné à",
      accessor: getAssignedUserName,
      align: "left",
    },
    {
      header: "Actions",
      accessor: (client) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() => router.push(generatePath("edit", client._id))}
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            <ActionButton
              onClick={() => router.push(generatePath("edit", client._id, 3))}
              variant="secondary"
              size="medium"
            >
              Attribuer
            </ActionButton>
            <ActionButton
              onClick={() =>
                router.push(generatePath("opportunity", client._id))
              }
              variant="primary"
              size="medium"
              customColor="#A3B18A"
            >
              Opportunités
            </ActionButton>
            <ActionButton
              onClick={() => handleDeleteClick(client)}
              variant="danger"
              size="medium"
              disabled={deletingId === client._id}
            >
              <FaTrashAlt style={{ margin: "1px" }} />
            </ActionButton>
          </div>
        );
      },
      align: "center",
      isAction: true,
    },
  ];

  const customTableStyles = {
    ...tableStyleProps,
    variant: "striped" as const,
    headerStyle: "light" as const,
    rounded: true,
    maxWidth: "1200px",
  };

  // Handler pour la navigation vers la page de détail
  const handleRowClick = (client: Client) => {
    router.push(`/dashboard/pipeline/clients/${client._id}`);
  };

  return (
    <>
      <Table
        data={clients}
        columns={columns}
        keyField="_id"
        isLoading={isLoading || loadingUsers}
        emptyMessage="Aucun client trouvé pour cette entreprise"
        styleProps={customTableStyles}
        pagination={true}
        defaultItemsPerPage={10}
        paginationActiveColor="#A3B18A"
        paginationTextColor="#A3B18A"
        onRowClick={handleRowClick}
      />
      {showDeleteModal && clientToDelete && (
        <DeleteClientModal
          clientName={clientToDelete.name}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default ClientTable;
