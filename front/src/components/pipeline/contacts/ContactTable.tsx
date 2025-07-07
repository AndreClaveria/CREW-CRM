import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleContactStatus from "@/components/pipeline/contacts/ToggleContactStatus";
import DeleteContactModal from "@/components/pipeline/contacts/DeleteContactModal";
import { Contact, deleteContact } from "@/services/contact.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useContactAssignedUsers } from "@/hooks/useContactAssignedUsers";
import { FaTrashAlt } from "react-icons/fa";

interface ContactTableProps {
  contacts: Contact[];
  companyId: string;
  isLoading: boolean;
  isAdmin?: boolean;
  onStatusChange?: (contactId: string, newStatus: boolean) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  companyId,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const { getAssignedUserName, loading: loadingUsers } =
    useContactAssignedUsers(contacts);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    try {
      setDeletingId(contactToDelete._id);
      await deleteContact(contactToDelete._id);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      alert("Une erreur est survenue lors de la suppression du contact");
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const columns: TableColumn<Contact>[] = [
    {
      header: "Nom",
      accessor: (contact) => `${contact.firstName}`,
      align: "left",
    },
    {
      header: "Prénom",
      accessor: (contact) => `${contact.lastName}`,
      align: "left",
    },
    {
      header: "Email",
      accessor: (contact) => contact.email || "Non renseigné",
      align: "left",
    },
    {
      header: "Mobile",
      accessor: (contact) => contact.mobile || "Non renseigné",
      align: "left",
    },
    {
      header: "Assigné à",
      accessor: getAssignedUserName,
      align: "left",
    },
    {
      header: "Statut",
      accessor: (contact) => <StatusBadge isActive={contact.isActive} />,
      align: "center",
    },
    {
      header: "Actions",
      accessor: (contact) => {
        const isAdminOrManager =
          user?.role === "admin" || user?.role === "manager";

        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() =>
                router.push(
                  `/dashboard/pipeline/contacts/edit/${companyId}/${contact._id}`
                )
              }
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            {isAdminOrManager && onStatusChange && (
              <ToggleContactStatus
                contactId={contact._id}
                isActive={contact.isActive}
                onStatusChange={(newStatus) =>
                  onStatusChange(contact._id, newStatus)
                }
              />
            )}
            <ActionButton
              onClick={() => handleDeleteClick(contact)}
              variant="danger"
              size="medium"
              disabled={deletingId === contact._id}
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
  const handleRowClick = (contact: Contact) => {
    router.push(`/dashboard/pipeline/contacts/${companyId}/${contact._id}`);
  };

  return (
    <>
      <Table
        data={contacts}
        columns={columns}
        keyField="_id"
        isLoading={isLoading || loadingUsers}
        emptyMessage="Aucun contact trouvé pour cette entreprise"
        styleProps={customTableStyles}
        pagination={true}
        defaultItemsPerPage={10}
        paginationActiveColor="#E9C46A"
        paginationTextColor="#E9C46A"
        onRowClick={handleRowClick}
      />
      {showDeleteModal && contactToDelete && (
        <DeleteContactModal
          contactName={`${contactToDelete.firstName} ${contactToDelete.lastName}`}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default ContactTable;
