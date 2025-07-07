"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useEmail } from "@/hooks/useMail";

import ActionButton from "@/components/common/ActionButton";
import StatusBadge from "@/components/common/StatusBadge";
import {
  FaArrowLeft,
  FaReply,
  FaForward,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaBuilding,
} from "react-icons/fa";

interface EmailViewPageProps {}

const EmailViewPage: React.FC<EmailViewPageProps> = () => {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: isLoadingAuth } = useAuth();

  const userId = params?.userId as string;
  const emailId = params?.emailId as string;

  const hasAccess = useRoleCheck({
    isLoading: isLoadingAuth,
    user,
    requiredRole: ["user"],
    redirectPath: "/dashboard",
  });

  const {
    email,
    conversation,
    isLoading,
    error,
    loadEmail,
    loadConversation,
    markAsRead,
    deleteEmailById,
  } = useEmail({ emailId });

  const [showFullBody, setShowFullBody] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  // Load email initially
  useEffect(() => {
    if (emailId && hasAccess && !emailLoaded) {
      console.log("📧 Chargement initial de l'email:", emailId);
      loadEmail(emailId);
      setEmailLoaded(true);
    }
  }, [emailId, hasAccess, emailLoaded, loadEmail]);

  // Mark as read when email is loaded
  useEffect(() => {
    if (email && !email.isRead && emailLoaded) {
      console.log("📖 Marquage comme lu:", emailId);
      markAsRead(emailId, true);
    }
  }, [email?.isRead, emailLoaded, emailId, markAsRead]);

  if (isLoadingAuth || !hasAccess) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #E9C46A",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p>Chargement de l'email...</p>
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#d32f2f", marginBottom: "16px" }}>Erreur</h2>
        <p style={{ marginBottom: "24px" }}>{error || "Email introuvable"}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <ActionButton
            onClick={() => router.back()}
            variant="secondary"
            size="medium"
          >
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Retour
          </ActionButton>
          <ActionButton
            onClick={() => window.location.reload()}
            variant="primary"
            size="medium"
          >
            Réessayer
          </ActionButton>
        </div>
      </div>
    );
  }

  const handleReply = () => {
    router.push(`/dashboard/pipeline/emails/reply/${userId}/${emailId}`);
  };

  const handleForward = () => {
    router.push(`/dashboard/pipeline/emails/forward/${userId}/${emailId}`);
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet email ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteEmailById(emailId);
      if (success) {
        router.push("/mail");
      } else {
        alert("Erreur lors de la suppression de l'email");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'email");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowConversation = async () => {
    if (!showConversation) {
      // Show conversation - load it if not already loaded
      setShowConversation(true);
      if (!conversation && emailId) {
        setIsLoadingConversation(true);
        try {
          console.log("🔄 Chargement de la conversation pour:", emailId);
          await loadConversation(emailId);
        } catch (error) {
          console.error("Erreur lors du chargement de la conversation:", error);
        } finally {
          setIsLoadingConversation(false);
        }
      }
    } else {
      // Hide conversation
      setShowConversation(false);
    }
  };

  const handleToggleRead = async () => {
    if (!email) return;
    await markAsRead(emailId, !email.isRead);
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "Date inconnue";

    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    if (!email) return <StatusBadge isActive={false} />;

    switch (email.status) {
      case "sent":
        return <StatusBadge isActive={true} />;
      case "pending":
        return <StatusBadge isActive={false} />;
      case "failed":
        return <StatusBadge isActive={false} />;
      default:
        return <StatusBadge isActive={true} />;
    }
  };

  const getFromUserInfo = (): string => {
    if (!email) return "Utilisateur inconnu";

    if (email.userInfo) {
      if (email.userInfo.firstName && email.userInfo.lastName) {
        return `${email.userInfo.firstName} ${email.userInfo.lastName}`;
      }
      return email.userInfo.email || `User ${email.fromUserId}`;
    }
    return `User ${email.fromUserId}`;
  };

  const getToContactInfo = (): string => {
    if (!email) return "Destinataire inconnu";

    if (email.toEmail) {
      return email.toEmail;
    }
    return `Contact ${email.toContactId}`;
  };

  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header avec navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ActionButton
            onClick={() => router.back()}
            variant="secondary"
            size="small"
          >
            <FaArrowLeft />
          </ActionButton>
          <h1
            style={{
              fontSize: "32px",
              margin: 0,
              color: "#333333",
              fontFamily: "var(--font-first)",
            }}
          >
            Détail de l'email
          </h1>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px" }}>
          <ActionButton
            onClick={handleToggleRead}
            variant="secondary"
            size="small"
            customTextColor={email?.isRead ? "#666" : "#E9C46A"}
          >
            {email?.isRead ? <FaEyeSlash /> : <FaEye />}
          </ActionButton>

          {email?.status !== "pending" && (
            <>
              <ActionButton
                onClick={handleReply}
                variant="secondary"
                size="small"
              >
                <FaReply />
              </ActionButton>

              <ActionButton
                onClick={handleForward}
                variant="secondary"
                size="small"
              >
                <FaForward />
              </ActionButton>
            </>
          )}

          <ActionButton
            onClick={handleDelete}
            variant="danger"
            size="small"
            disabled={isDeleting}
          >
            <FaTrashAlt />
          </ActionButton>
        </div>
      </div>

      {/* Informations de l'email */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "24px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          {/* Colonne gauche */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <FaUser style={{ color: "#666" }} />
                <strong>De :</strong>
              </div>
              <p style={{ margin: 0, paddingLeft: "24px" }}>
                {getFromUserInfo()}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <FaEnvelope style={{ color: "#666" }} />
                <strong>À :</strong>
              </div>
              <p style={{ margin: 0, paddingLeft: "24px" }}>
                {getToContactInfo()}
              </p>
            </div>

            {email?.metadata?.companyInfo && (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <FaBuilding style={{ color: "#666" }} />
                  <strong>Entreprise :</strong>
                </div>
                <p style={{ margin: 0, paddingLeft: "24px" }}>
                  {email.metadata.companyInfo.name}
                </p>
              </div>
            )}
          </div>

          {/* Colonne droite */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <FaCalendarAlt style={{ color: "#666" }} />
                <strong>Date d'envoi :</strong>
              </div>
              <p style={{ margin: 0, paddingLeft: "24px" }}>
                {formatDate(email?.sentAt || email?.createdAt)}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "4px" }}>
                <strong>Statut :</strong>
              </div>
              <div style={{ paddingLeft: "24px" }}>{getStatusBadge()}</div>
            </div>

            {email?.trackingId && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ marginBottom: "4px" }}>
                  <strong>ID de suivi :</strong>
                </div>
                <p
                  style={{
                    margin: 0,
                    paddingLeft: "24px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {email.trackingId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sujet */}
        <div>
          <strong style={{ fontSize: "18px" }}>Sujet :</strong>
          <h2
            style={{
              margin: "8px 0 0 0",
              fontSize: "24px",
              fontWeight: email?.isRead ? "normal" : "bold",
            }}
          >
            {email?.subject || "Sans sujet"}
          </h2>
        </div>
      </div>

      {/* Corps de l'email */}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0 }}>Message</h3>
          {email?.body && email.body.length > 500 && (
            <ActionButton
              onClick={() => setShowFullBody(!showFullBody)}
              variant="secondary"
              size="small"
            >
              {showFullBody ? "Réduire" : "Voir tout"}
            </ActionButton>
          )}
        </div>

        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#333",
          }}
        >
          {email?.htmlBody ? (
            <div
              dangerouslySetInnerHTML={{
                __html: showFullBody
                  ? email.htmlBody
                  : email.htmlBody.substring(0, 500) +
                    (email.htmlBody.length > 500 ? "..." : ""),
              }}
            />
          ) : (
            <div style={{ whiteSpace: "pre-wrap" }}>
              {showFullBody
                ? email?.body
                : email?.body?.substring(0, 500) +
                  (email?.body && email.body.length > 500 ? "..." : "")}
            </div>
          )}
        </div>
      </div>

      {/* Réponses / Conversation */}
      {email?.hasReply && email.replyCount && email.replyCount > 0 && (
        <div
          style={{
            backgroundColor: "#f0f7ff",
            border: "1px solid #b3d9ff",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#0066cc" }}>
            💬 Conversation
          </h4>
          <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#666" }}>
            Cet email a reçu {email.replyCount} réponse
            {email.replyCount > 1 ? "s" : ""}
            {email.lastReplyAt &&
              ` • Dernière réponse le ${formatDate(email.lastReplyAt)}`}
          </p>

          <ActionButton
            onClick={handleShowConversation}
            variant="secondary"
            size="small"
            disabled={isLoadingConversation}
          >
            {isLoadingConversation
              ? "Chargement..."
              : showConversation
              ? "Masquer la conversation"
              : "Voir la conversation complète"}
          </ActionButton>

          {/* Affichage de la conversation */}
          {showConversation && (
            <div style={{ marginTop: "16px" }}>
              {isLoadingConversation ? (
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid #E9C46A",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto 8px",
                    }}
                  ></div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    Chargement de la conversation...
                  </p>
                </div>
              ) : conversation ? (
                <div
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    padding: "16px",
                  }}
                >
                  <h5 style={{ margin: "0 0 12px 0", color: "#333" }}>
                    Conversation complète (
                    {conversation.summary?.totalMessages ||
                      conversation.conversation?.length ||
                      0}{" "}
                    messages)
                  </h5>

                  {conversation.conversation &&
                  conversation.conversation.length > 0 ? (
                    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {conversation.conversation.map((msg, index) => (
                        <div
                          key={msg._id || index}
                          style={{
                            padding: "12px",
                            margin: "8px 0",
                            backgroundColor: msg.isReply
                              ? "#f8f9fa"
                              : "#e3f2fd",
                            borderLeft: `4px solid ${
                              msg.isReply ? "#28a745" : "#2196f3"
                            }`,
                            borderRadius: "4px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "4px",
                              fontWeight: "bold",
                            }}
                          >
                            {msg.isReply ? "📩 Réponse" : "📧 Email original"} •{" "}
                            {formatDate(msg.sentAt || msg.createdAt)}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              marginBottom: "4px",
                            }}
                          >
                            {msg.subject || "Sans sujet"}
                          </div>
                          <div style={{ fontSize: "13px", color: "#555" }}>
                            {msg.body?.substring(0, 200)}
                            {msg.body && msg.body.length > 200 ? "..." : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      Aucune conversation disponible
                    </p>
                  )}

                  {/* Summary information if available */}
                  {conversation.summary && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      <strong>Résumé:</strong>{" "}
                      {conversation.summary.totalMessages} messages total
                      {conversation.summary.lastActivity &&
                        ` • Dernière activité: ${formatDate(
                          conversation.summary.lastActivity
                        )}`}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Impossible de charger la conversation
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Métadonnées techniques (admin seulement) */}
      {isAdminOrManager && email?.metadata && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0" }}>Métadonnées techniques</h4>
          <div style={{ fontSize: "12px", fontFamily: "monospace" }}>
            <div>
              <strong>Provider:</strong> {email?.emailProvider || "N/A"}
            </div>
            <div>
              <strong>Message ID:</strong> {email?.messageId || "N/A"}
            </div>
            {email.metadata?.brevoMessageId && (
              <div>
                <strong>Brevo Message ID:</strong>{" "}
                {email.metadata.brevoMessageId}
              </div>
            )}
            <div>
              <strong>Template:</strong> {email.metadata?.template || "N/A"}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default EmailViewPage;
