import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleEmailStatus from "@/components/email/ToggleEmailStatus";
import DeleteEmailModal from "@/components/email/DeleteEmailModal";
import { Email, deleteEmail, getEmailsByUser } from "@/services/email.service";
import { EmailListResponse } from "@/services/email.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";
import { FaTrashAlt, FaReply, FaForward, FaEye } from "react-icons/fa";

// ✅ INTERFACE MISE À JOUR SELON VOTRE STRUCTURE API
interface EmailFromAPI extends Email {
  toEmail?: string;
  emailProvider?: string;
  trackingId?: string;
  isReply?: boolean;
  hasReply?: boolean;
  replyCount?: number;
  lastReplyAt?: string;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}
interface Contact {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// User interface for reference
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface EmailTableProps {
  userId: string;
  onStatusChange?: (emailId: string, newStatus: boolean) => void;
  onMarkAsRead?: (emailId: string, isRead: boolean) => void;
  // Optional: Pass contacts as a lookup map
  contacts?: Record<string, Contact>;
  // Optional: Pass users as a lookup map
  users?: Record<string, User>;
  // Optional: Pass filters for email retrieval
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  };
}

const EmailTable: React.FC<EmailTableProps> = ({
  userId,
  onStatusChange,
  onMarkAsRead,
  contacts = {},
  users = {},
  filters = {},
}) => {
  const router = useRouter();
  const { user } = useAuth();

  // State management - ASSURER QUE emails EST TOUJOURS UN TABLEAU
  const [emails, setEmails] = useState<EmailFromAPI[]>([]); // ✅ Type mis à jour
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<
    EmailListResponse["pagination"] | null
  >(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ MÉMORISER LES FILTRES POUR ÉVITER LES RECRÉATIONS D'OBJETS
  const memoizedFilters = useMemo(
    () => filters,
    [
      filters.status,
      filters.dateFrom,
      filters.dateTo,
      filters.page,
      filters.limit,
    ]
  );

  // ✅ MÉMORISER LA FONCTION fetchEmails POUR ÉVITER LES RE-CRÉATIONS
  const fetchEmails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("📧 Récupération des emails pour userId:", userId);

      const response = await getEmailsByUser(userId, memoizedFilters);

      console.log("📨 Réponse API:", response);

      if (response.success && response.data) {
        // ✅ GÉRER LA STRUCTURE SPÉCIFIQUE DE VOTRE API
        let emailsData = [];

        if (response.data.emails && Array.isArray(response.data.emails)) {
          // Cas principal: data contient un champ emails qui est un tableau
          emailsData = response.data.emails;
          console.log("✅ Emails extraits de data.emails:", emailsData.length);
        } else if (Array.isArray(response.data)) {
          // Cas 2: data est directement un tableau
          emailsData = response.data;
          console.log(
            "✅ Emails extraits de data directement:",
            emailsData.length
          );
        } else {
          // Cas 3: structure inconnue, log pour déboguer
          console.warn("⚠️ Structure de données inconnue:", response.data);
          console.log(
            "🔍 Clés disponibles dans data:",
            Object.keys(response.data)
          );
          emailsData = [];
        }

        console.log("📋 Structure du premier email:", emailsData[0]);

        setEmails(emailsData);
        setPagination(response.pagination || null);
      } else {
        console.warn("⚠️ Réponse sans données:", response);
        setError(
          response.message || "Erreur lors de la récupération des emails"
        );
        setEmails([]); // ✅ S'assurer que c'est un tableau vide
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de la récupération des emails:", error);
      setError("Une erreur est survenue lors de la récupération des emails");
      setEmails([]); // ✅ S'assurer que c'est un tableau vide
    } finally {
      setIsLoading(false);
    }
  }, [userId, memoizedFilters]); // ✅ DÉPENDANCES MÉMORISÉES

  // Fetch emails on component mount and when dependencies change
  useEffect(() => {
    if (userId) {
      console.log("🔄 useEffect déclenché avec userId:", userId);
      fetchEmails();
    } else {
      console.warn("⚠️ userId manquant");
      setEmails([]); // ✅ S'assurer que c'est un tableau vide
      setIsLoading(false);
    }
  }, [userId, fetchEmails]); // ✅ DÉPENDANCES CORRECTES

  const handleDeleteClick = (email: Email) => {
    setEmailToDelete(email);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!emailToDelete) return;

    try {
      setDeletingId(emailToDelete._id);
      const response = await deleteEmail(emailToDelete._id);

      if (response.success) {
        // Refresh the email list instead of reloading the page
        await fetchEmails();
      } else {
        alert(
          response.message ||
            "Une erreur est survenue lors de la suppression de l'email"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'email:", error);
      alert("Une erreur est survenue lors de la suppression de l'email");
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setEmailToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEmailToDelete(null);
  };

  const handleReply = (email: Email) => {
    router.push(`/dashboard/pipeline/emails/reply/${userId}/${email._id}`);
  };

  const handleForward = (email: Email) => {
    router.push(`/dashboard/pipeline/emails/forward/${userId}/${email._id}`);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Date inconnue";

    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFromUserInfo = (email: Email) => {
    // ✅ UTILISER userInfo SI DISPONIBLE (comme dans votre API)
    if (email.userInfo) {
      if (email.userInfo.firstName && email.userInfo.lastName) {
        return `${email.userInfo.firstName} ${email.userInfo.lastName}`;
      }
      return email.userInfo.email || `User ${email.fromUserId}`;
    }

    // Fallback sur le système de lookup existant
    const fromUser = users[email.fromUserId];
    if (fromUser) {
      if (fromUser.firstName && fromUser.lastName) {
        return `${fromUser.firstName} ${fromUser.lastName}`;
      }
      return fromUser.email || `User ${email.fromUserId}`;
    }
    return `User ${email.fromUserId}`;
  };

  const getToContactInfo = (email: Email) => {
    // ✅ UTILISER toEmail SI DISPONIBLE (comme dans votre API)
    if (email.toEmail) {
      return email.toEmail;
    }

    // Fallback sur le système de lookup existant
    const contact = contacts[email.toContactId];
    if (contact) {
      if (contact.firstName && contact.lastName) {
        return `${contact.firstName} ${contact.lastName}`;
      }
      return contact.email || `Contact ${email.toContactId}`;
    }
    return `Contact ${email.toContactId}`;
  };

  const getEmailStatusBadge = (email: Email) => {
    switch (email.status) {
      case "sent":
        return <StatusBadge isActive={true} />;
      case "pending":
        return <StatusBadge isActive={false} />;
      case "failed":
        return <StatusBadge isActive={false} />;
      case "read":
        return <StatusBadge isActive={true} />;
      case "unread":
        return <StatusBadge isActive={false} />;
      default:
        return <StatusBadge isActive={true} />;
    }
  };

  const handleMarkAsRead = async (emailId: string, isRead: boolean) => {
    if (onMarkAsRead) {
      onMarkAsRead(emailId, isRead);
    }

    // Update local state optimistically
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email._id === emailId ? { ...email, isRead } : email
      )
    );
  };

  const columns: TableColumn<EmailFromAPI>[] = [
    {
      header: "De",
      accessor: (email) => getFromUserInfo(email),
      align: "left",
    },
    {
      header: "À",
      accessor: (email) => getToContactInfo(email),
      align: "left",
    },
    {
      header: "Sujet",
      accessor: (email) => {
        const subject = email.subject || "Sans sujet";
        return (
          <div
            style={{
              fontWeight: email.isRead ? "normal" : "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {!email.isRead && (
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#E9C46A",
                }}
              />
            )}
            {subject.length > 50 ? `${subject.substring(0, 50)}...` : subject}
          </div>
        );
      },
      align: "left",
    },
    {
      header: "Date d'envoi",
      accessor: (email) => {
        // Use sentAt if available, otherwise fall back to createdAt
        const dateToShow = email.sentAt || email.createdAt || email.updatedAt;
        return formatDate(dateToShow);
      },
      align: "left",
    },
    {
      header: "Statut",
      accessor: getEmailStatusBadge,
      align: "center",
    },
    {
      header: "Actions",
      accessor: (email) => {
        const isAdminOrManager =
          user?.role === "admin" || user?.role === "manager";

        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <ActionButton
              onClick={() =>
                router.push(`/dashboard/mail/${userId}/${email._id}`)
              }
              variant="secondary"
              size="small"
            >
              <FaEye style={{ margin: "1px" }} />
            </ActionButton>

            {email.status !== "pending" && (
              <>
                <ActionButton
                  onClick={() => handleReply(email)}
                  variant="secondary"
                  size="small"
                >
                  <FaReply style={{ margin: "1px" }} />
                </ActionButton>

                <ActionButton
                  onClick={() => handleForward(email)}
                  variant="secondary"
                  size="small"
                >
                  <FaForward style={{ margin: "1px" }} />
                </ActionButton>
              </>
            )}

            {isAdminOrManager && onStatusChange && (
              <ToggleEmailStatus
                emailId={email._id}
                isActive={email.status === "sent"}
                onStatusChange={(newStatus) =>
                  onStatusChange(email._id, newStatus)
                }
              />
            )}

            {onMarkAsRead && (
              <ActionButton
                onClick={() => handleMarkAsRead(email._id, !email.isRead)}
                variant="secondary"
                size="small"
                customTextColor={email.isRead ? "#666" : "#E9C46A"}
              >
                {email.isRead ? "Non lu" : "Lu"}
              </ActionButton>
            )}

            <ActionButton
              onClick={() => handleDeleteClick(email)}
              variant="danger"
              size="small"
              disabled={deletingId === email._id}
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
    maxWidth: "1400px",
  };

  // Handler pour la navigation vers la page de détail
  const handleRowClick = (email: Email) => {
    router.push(`/dashboard/mail/${userId}/${email._id}`);

    // Marquer comme lu au clic si la fonction est disponible
    if (!email.isRead && onMarkAsRead) {
      handleMarkAsRead(email._id, true);
    }
  };

  // Show error state
  if (error && !isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#f44336" }}>
        <p>{error}</p>
        <ActionButton onClick={fetchEmails} variant="primary" size="small">
          Réessayer
        </ActionButton>
      </div>
    );
  }

  // ✅ VÉRIFICATION SUPPLÉMENTAIRE AVANT DE PASSER À Table
  console.log("🔍 État avant rendu Table:", {
    emails: emails,
    isArray: Array.isArray(emails),
    length: emails?.length,
    isLoading,
  });

  return (
    <>
      <Table
        data={Array.isArray(emails) ? emails : []} // ✅ PROTECTION SUPPLÉMENTAIRE
        columns={columns}
        keyField="_id"
        isLoading={isLoading}
        emptyMessage="Aucun email trouvé pour cet utilisateur"
        styleProps={customTableStyles}
        pagination={true}
        defaultItemsPerPage={10}
        paginationActiveColor="#E9C46A"
        paginationTextColor="#E9C46A"
        onRowClick={handleRowClick}
      />
      {showDeleteModal && emailToDelete && (
        <DeleteEmailModal
          emailSubject={emailToDelete.subject || "Sans sujet"}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default EmailTable;
