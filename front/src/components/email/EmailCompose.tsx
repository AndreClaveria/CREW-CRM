// components/email/EmailComposeModal.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useEmail } from "@/hooks/useMail";
import { useContact } from "@/hooks/useContact";
import { Contact } from "@/types/contact.types";
import ActionButton from "@/components/common/ActionButton";
import {
  FaTimes,
  FaMinusSquare,
  FaExpandArrowsAlt,
  FaPaperPlane,
  FaPaperclip,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  companyId?: string;
  replyTo?: {
    emailId: string;
    subject: string;
    fromEmail: string;
    toEmail: string;
  };
  forwardEmail?: {
    emailId: string;
    subject: string;
    body: string;
    fromEmail: string;
  };
}

interface EmailFormData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  htmlBody: string;
}

const EmailComposeModal: React.FC<EmailComposeModalProps> = ({
  isOpen,
  onClose,
  userId,
  companyId,
  replyTo,
  forwardEmail,
}) => {
  const { sendNewEmail, isSending, error, resetError } = useEmail();
  const {
    contacts,
    loading: contactsLoading,
    error: contactsError,
  } = useContact({
    companyId,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [isRichText, setIsRichText] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState("");

  const [formData, setFormData] = useState<EmailFormData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    htmlBody: "",
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const richTextRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize form data based on reply or forward
  useEffect(() => {
    if (replyTo) {
      setFormData((prev) => ({
        ...prev,
        to: replyTo.fromEmail,
        subject: replyTo.subject.startsWith("Re:")
          ? replyTo.subject
          : `Re: ${replyTo.subject}`,
      }));
    } else if (forwardEmail) {
      setFormData((prev) => ({
        ...prev,
        subject: forwardEmail.subject.startsWith("Fwd:")
          ? forwardEmail.subject
          : `Fwd: ${forwardEmail.subject}`,
        body: `\n\n--- Message transféré ---\n${forwardEmail.body}`,
      }));
    }
  }, [replyTo, forwardEmail]);

  // Reset error when modal opens
  useEffect(() => {
    if (isOpen) {
      resetError();
    }
  }, [isOpen, resetError]);

  // Close contact dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contactDropdownRef.current &&
        !contactDropdownRef.current.contains(event.target as Node)
      ) {
        setShowContactDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      // Combine firstName and lastName for name search
      `${contact.firstName || ""} ${contact.lastName || ""}`
        .toLowerCase()
        .includes(contactSearchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(contactSearchTerm.toLowerCase())
  );

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleInputChange = (field: keyof EmailFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "body") {
      setTimeout(adjustTextareaHeight, 0);
    }
  };

  const handleRichTextChange = () => {
    if (richTextRef.current) {
      const content = richTextRef.current.innerHTML;
      setFormData((prev) => ({
        ...prev,
        htmlBody: content,
        body: richTextRef.current?.textContent || "",
      }));
    }
  };

  const handleContactSelect = (contact: any) => {
    const emailToAdd = contact.email || "";
    if (emailToAdd) {
      setFormData((prev) => ({
        ...prev,
        to: prev.to ? `${prev.to}, ${emailToAdd}` : emailToAdd,
      }));
    }
    setShowContactDropdown(false);
    setContactSearchTerm("");
  };
  // ✅ FONCTION CORRIGÉE - handleSend avec gestion des contacts via le hook
  // ✅ FONCTION CORRIGÉE - handleSend avec gestion des contacts via le hook
  const handleSend = async () => {
    if (!formData.to.trim() || !formData.subject.trim()) {
      alert("Veuillez remplir au minimum le destinataire et l'objet");
      return;
    }

    // Vérification que companyId est fourni
    if (!companyId) {
      alert("Erreur : ID de l'entreprise requis pour envoyer un email");
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = formData.to.split(",").map((email) => email.trim());
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        alert(`Format d'email invalide: ${email}`);
        return;
      }
    }

    try {
      const primaryEmail = emails[0];

      console.log(`🔍 Recherche du contact pour: ${primaryEmail}`);
      console.log(`📋 Contacts disponibles:`, contacts);

      let contactId: string; // ✅ Explicitly type as string
      let toEmail: string;
      const existingContact = contacts.find(
        (c) => c.email && c.email.toLowerCase() === primaryEmail.toLowerCase()
      );

      if (existingContact) {
        // ✅ Ensure _id exists and is string
        contactId = existingContact._id;
        toEmail = existingContact.email || primaryEmail; // ✅ Fallback to primaryEmail
        console.log(`✅ Contact trouvé:`, existingContact);
      } else {
        // Create temporary ID
        contactId = `temp_${primaryEmail
          .replace("@", "_")
          .replace(".", "_")}_${Date.now()}`;
        toEmail = primaryEmail;
        console.warn(
          `⚠️ Aucun contact trouvé pour ${primaryEmail}, utilisation d'un ID temporaire: ${contactId}`
        );
      }

      // ✅ Rest of your email sending logic remains the same
      const emailData = {
        fromUserId: userId,
        fromCompanyId: companyId,
        toContactId: contactId,
        toEmail: toEmail,
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        // Champs optionnels
        ...(formData.cc.trim() && {
          ccEmails: formData.cc.split(",").map((email) => email.trim()),
        }),
        ...(formData.bcc.trim() && {
          bccEmails: formData.bcc.split(",").map((email) => email.trim()),
        }),
        ...(isRichText &&
          formData.htmlBody && {
            htmlBody: formData.htmlBody,
          }),
        ...(replyTo?.emailId && { replyToEmailId: replyTo.emailId }),
        ...(forwardEmail?.emailId && {
          forwardFromEmailId: forwardEmail.emailId,
        }),
      };

      console.log("📧 Données email complètes à envoyer:", emailData);

      const result = await sendNewEmail(emailData);
      if (result) {
        setFormData({
          to: "",
          cc: "",
          bcc: "",
          subject: "",
          body: "",
          htmlBody: "",
        });
        onClose();
        alert("Email envoyé avec succès!");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi:", error);
    }
  };

  const handleClose = () => {
    if (formData.to || formData.subject || formData.body) {
      if (
        confirm(
          "Voulez-vous vraiment fermer? Les modifications non sauvegardées seront perdues."
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    richTextRef.current?.focus();
  };

  if (!isOpen) return null;

  const modalStyles = {
    position: "fixed" as const,
    bottom: isMinimized ? "0" : "20px",
    right: "20px",
    width: isMaximized ? "90vw" : isMinimized ? "300px" : "600px",
    height: isMaximized ? "90vh" : isMinimized ? "50px" : "70vh",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: isMinimized ? "8px 8px 0 0" : "8px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  return (
    <>
      {/* Overlay for maximized mode */}
      {isMaximized && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
          onClick={() => setIsMaximized(false)}
        />
      )}

      <div style={modalStyles}>
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: isMinimized ? "none" : "1px solid #eee",
            backgroundColor: "#f8f9fa",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: isMinimized ? "pointer" : "default",
          }}
          onClick={isMinimized ? () => setIsMinimized(false) : undefined}
        >
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "500" }}>
            {replyTo
              ? "Répondre"
              : forwardEmail
              ? "Transférer"
              : "Nouveau message"}
          </h3>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#666",
              }}
            >
              <FaMinusSquare size={14} />
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#666",
              }}
            >
              <FaExpandArrowsAlt size={14} />
            </button>

            <button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#666",
              }}
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Form Content */}
            <div style={{ padding: "16px", flex: 1, overflow: "auto" }}>
              {/* To Field with Contact Dropdown */}
              <div style={{ marginBottom: "12px", position: "relative" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <label
                    style={{
                      minWidth: "40px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    À:
                  </label>
                  <input
                    type="email"
                    value={formData.to}
                    onChange={(e) => handleInputChange("to", e.target.value)}
                    placeholder="destinataire@example.com"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: "14px",
                      padding: "4px",
                    }}
                  />
                  <button
                    onClick={() => setShowContactDropdown(!showContactDropdown)}
                    style={{
                      background: "none",
                      border: "1px solid #ddd",
                      color: "#666",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    disabled={contactsLoading}
                  >
                    <FaUser size={12} />
                    Contacts
                    <FaChevronDown size={10} />
                  </button>
                  <button
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Cc/Bcc
                  </button>
                </div>

                {/* Contact Dropdown */}
                {showContactDropdown && (
                  <div
                    ref={contactDropdownRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "48px",
                      right: "0",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 1001,
                      maxHeight: "200px",
                      overflow: "auto",
                    }}
                  >
                    {/* Search input */}
                    <div style={{ padding: "8px" }}>
                      <input
                        type="text"
                        placeholder="Rechercher un contact..."
                        value={contactSearchTerm}
                        onChange={(e) => setContactSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          border: "1px solid #ddd",
                          borderRadius: "3px",
                          fontSize: "12px",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Contact list */}
                    {contactsLoading ? (
                      <div
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Chargement...
                      </div>
                    ) : contactsError ? (
                      <div
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          color: "#d32f2f",
                          fontSize: "12px",
                        }}
                      >
                        Erreur lors du chargement des contacts
                      </div>
                    ) : filteredContacts.length === 0 ? (
                      <div
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        Aucun contact trouvé
                      </div>
                    ) : (
                      filteredContacts.map((contact) => (
                        <div
                          key={contact._id}
                          onClick={() => handleContactSelect(contact)}
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: "12px",
                            borderBottom: "1px solid #f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f5f5f5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          <FaUser size={10} color="#666" />
                          <div>
                            <div style={{ fontWeight: "500", color: "#333" }}>
                              {/* ✅ Use firstName and lastName instead of name */}
                              {contact.firstName || ""} {contact.lastName || ""}{" "}
                              {!contact.firstName &&
                                !contact.lastName &&
                                "Sans nom"}
                            </div>
                            <div style={{ color: "#666", fontSize: "11px" }}>
                              {contact.email || "Pas d'email"}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* CC/BCC Fields */}
              {showCcBcc && (
                <>
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          minWidth: "40px",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        Cc:
                      </label>
                      <input
                        type="email"
                        value={formData.cc}
                        onChange={(e) =>
                          handleInputChange("cc", e.target.value)
                        }
                        placeholder="cc@example.com"
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          padding: "4px",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <label
                        style={{
                          minWidth: "40px",
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        Bcc:
                      </label>
                      <input
                        type="email"
                        value={formData.bcc}
                        onChange={(e) =>
                          handleInputChange("bcc", e.target.value)
                        }
                        placeholder="bcc@example.com"
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          padding: "4px",
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Subject Field */}
              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Objet"
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid #eee",
                    outline: "none",
                    fontSize: "14px",
                    padding: "8px 0",
                  }}
                />
              </div>

              {/* Rich Text Toolbar */}
              {isRichText && (
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    marginBottom: "8px",
                  }}
                >
                  <button
                    onClick={() => executeCommand("bold")}
                    style={{
                      background: "none",
                      border: "1px solid #ddd",
                      padding: "4px 8px",
                      cursor: "pointer",
                      borderRadius: "3px",
                    }}
                  >
                    <FaBold size={12} />
                  </button>
                  <button
                    onClick={() => executeCommand("italic")}
                    style={{
                      background: "none",
                      border: "1px solid #ddd",
                      padding: "4px 8px",
                      cursor: "pointer",
                      borderRadius: "3px",
                    }}
                  >
                    <FaItalic size={12} />
                  </button>
                  <button
                    onClick={() => executeCommand("underline")}
                    style={{
                      background: "none",
                      border: "1px solid #ddd",
                      padding: "4px 8px",
                      cursor: "pointer",
                      borderRadius: "3px",
                    }}
                  >
                    <FaUnderline size={12} />
                  </button>
                  <button
                    onClick={() => executeCommand("insertUnorderedList")}
                    style={{
                      background: "none",
                      border: "1px solid #ddd",
                      padding: "4px 8px",
                      cursor: "pointer",
                      borderRadius: "3px",
                    }}
                  >
                    <FaListUl size={12} />
                  </button>
                </div>
              )}

              {/* Message Body */}
              <div style={{ flex: 1, marginBottom: "16px" }}>
                {isRichText ? (
                  <div
                    ref={richTextRef}
                    contentEditable
                    onInput={handleRichTextChange}
                    style={{
                      minHeight: "200px",
                      border: "1px solid #eee",
                      padding: "12px",
                      borderRadius: "4px",
                      outline: "none",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                    dangerouslySetInnerHTML={{ __html: formData.htmlBody }}
                  />
                ) : (
                  <textarea
                    ref={textAreaRef}
                    value={formData.body}
                    onChange={(e) => handleInputChange("body", e.target.value)}
                    placeholder="Composez votre message..."
                    style={{
                      width: "100%",
                      minHeight: "200px",
                      border: "1px solid #eee",
                      borderRadius: "4px",
                      padding: "12px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div
                  style={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    marginBottom: "12px",
                    padding: "8px",
                    backgroundColor: "#ffebee",
                    border: "1px solid #ffcdd2",
                    borderRadius: "4px",
                  }}
                >
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #eee",
                backgroundColor: "#fafafa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <ActionButton
                  onClick={handleSend}
                  variant="primary"
                  size="small"
                  disabled={
                    isSending || !formData.to.trim() || !formData.subject.trim()
                  }
                  customColor="#E9C46A"
                >
                  {isSending ? (
                    "Envoi..."
                  ) : (
                    <>
                      <FaPaperPlane style={{ marginRight: "4px" }} size={12} />
                      Envoyer
                    </>
                  )}
                </ActionButton>

                <button
                  onClick={() => setIsRichText(!isRichText)}
                  style={{
                    background: "none",
                    border: "1px solid #ddd",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {isRichText ? "Texte simple" : "Texte riche"}
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#666",
                  }}
                >
                  <FaPaperclip size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EmailComposeModal;
