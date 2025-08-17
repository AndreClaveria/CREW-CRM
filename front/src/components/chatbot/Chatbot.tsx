// src/components/chatbot/Chatbot.tsx

"use client";

import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { useChatbot } from "@/hooks/useChatbot";

interface ChatbotProps {
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme?: "light" | "dark";
}

// Styles conventionnels intégrés
const styles = {
  // Container principal
  container: {
    position: "fixed" as const,
    zIndex: 1000,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },

  // Positions
  positionBottomRight: { bottom: "24px", right: "24px" },
  positionBottomLeft: { bottom: "24px", left: "24px" },
  positionTopRight: { top: "24px", right: "24px" },
  positionTopLeft: { top: "24px", left: "24px" },

  // Bouton d'ouverture
  openButton: {
    width: "56px",
    height: "56px",
    backgroundColor: "#0066cc",
    color: "#ffffff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0, 102, 204, 0.3)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    position: "relative" as const,
  },

  // Interface du chat
  chatInterface: {
    width: "380px",
    height: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
    transition: "all 0.3s ease",
  },

  chatInterfaceMinimized: {
    width: "320px",
    height: "64px",
  },

  // Header
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "64px",
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  headerAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#0066cc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  },

  headerSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  headerButton: {
    width: "32px",
    height: "32px",
    background: "transparent",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },

  // Messages
  messagesContainer: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    backgroundColor: "#ffffff",
  },

  welcomeMessage: {
    textAlign: "center" as const,
    padding: "40px 20px",
  },

  welcomeTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px",
  },

  welcomeSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
    marginBottom: "24px",
  },

  // Message de conversation
  messageWrapper: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },

  messageWrapperUser: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse" as const,
  },

  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "14px",
    fontWeight: "500",
  },

  avatarUser: {
    backgroundColor: "#0066cc",
    color: "#ffffff",
  },

  avatarAssistant: {
    backgroundColor: "#f3f4f6",
    color: "#0066cc",
  },

  messageBubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "14px",
    lineHeight: "1.4",
    wordWrap: "break-word" as const,
  },

  messageBubbleUser: {
    backgroundColor: "#0066cc",
    color: "#ffffff",
    borderBottomRightRadius: "6px",
  },

  messageBubbleAssistant: {
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    borderBottomLeftRadius: "6px",
  },

  // Suggestions
  quickSuggestions: {
    marginTop: "16px",
  },

  quickSuggestionsTitle: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: "8px",
  },

  quickSuggestionButton: {
    width: "100%",
    textAlign: "left" as const,
    padding: "12px 16px",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#374151",
    marginBottom: "8px",
  },

  // Input
  inputContainer: {
    borderTop: "1px solid #e5e7eb",
    padding: "16px 20px",
    backgroundColor: "#ffffff",
  },

  inputForm: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
  },

  inputWrapper: {
    flex: 1,
    position: "relative" as const,
  },

  messageInput: {
    width: "100%",
    minHeight: "40px",
    padding: "10px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    boxSizing: "border-box" as const,
  },

  sendButton: {
    width: "40px",
    height: "40px",
    backgroundColor: "#0066cc",
    color: "#ffffff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },

  sendButtonDisabled: {
    backgroundColor: "#d1d5db",
    cursor: "not-allowed",
  },

  // Loading
  loadingIndicator: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },

  loadingContent: {
    backgroundColor: "#f3f4f6",
    borderRadius: "18px",
    borderBottomLeftRadius: "6px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  loadingSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #0066cc",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  // Settings panel
  settingsPanel: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px 20px",
  },

  settingsTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    margin: "0 0 12px 0",
  },

  settingsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "13px",
  },

  settingsValue: {
    fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
    color: "#374151",
    fontSize: "12px",
    backgroundColor: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: "4px",
    maxWidth: "140px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },

  clearButton: {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
  },

  // Quick search
  quickSearchBar: {
    borderTop: "1px solid #e5e7eb",
    padding: "12px 20px",
    backgroundColor: "#f9fafb",
  },

  quickSearchButtons: {
    display: "flex",
    gap: "8px",
  },

  quickSearchButton: {
    flex: 1,
    padding: "8px 12px",
    fontSize: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center" as const,
  },

  // Footer
  inputFooter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "8px",
    fontSize: "11px",
    color: "#9ca3af",
  },

  // Timestamp
  timestamp: {
    fontSize: "11px",
    marginTop: "4px",
    textAlign: "right" as const,
    color: "#9ca3af",
  },

  timestampUser: {
    color: "rgba(255, 255, 255, 0.7)",
  },

  // Notification badge
  notificationBadge: {
    position: "absolute" as const,
    top: "-2px",
    right: "-2px",
    backgroundColor: "#ff4444",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ffffff",
  },

  // Suggested actions
  suggestedActions: {
    marginTop: "12px",
    marginLeft: "44px",
  },

  suggestedActionsTitle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "8px",
  },

  suggestedActionButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    fontSize: "13px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left" as const,
    marginBottom: "6px",
    width: "100%",
  },

  suggestedActionRoute: {
    flex: 1,
    fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
    color: "#0066cc",
    fontSize: "12px",
  },
};

// Icônes SVG
const Icons = {
  MessageCircle: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  X: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Send: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22,2 15,22 11,13 2,9 22,2" />
    </svg>
  ),
  Bot: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  User: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
    </svg>
  ),
  Minimize2: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="4,14 10,14 10,20" />
      <polyline points="20,10 14,10 14,4" />
    </svg>
  ),
  HelpCircle: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
  Trash2: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
  Loader2: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

const Chatbot: React.FC<ChatbotProps> = ({
  className = "",
  position = "bottom-right",
  theme = "light",
}) => {
  const {
    messages,
    isLoading,
    isOpen,
    context,
    error,
    quickSuggestions,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages,
    resetSession,
    getContextualHelp,
    searchFeatures,
    handleSuggestedAction,
    setError,
  } = useChatbot();

  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    await sendMessage(inputValue);
    setInputValue("");
  };

  const handleQuickSuggestion = async (suggestion: string) => {
    await sendMessage(suggestion);
  };

  const getPositionStyle = () => {
    switch (position) {
      case "bottom-right":
        return styles.positionBottomRight;
      case "bottom-left":
        return styles.positionBottomLeft;
      case "top-right":
        return styles.positionTopRight;
      case "top-left":
        return styles.positionTopLeft;
      default:
        return styles.positionBottomRight;
    }
  };

  const containerStyle = {
    ...styles.container,
    ...getPositionStyle(),
  };

  const interfaceStyle = {
    ...styles.chatInterface,
    ...(isMinimized ? styles.chatInterfaceMinimized : {}),
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .chatbot-button:hover {
          transform: scale(1.05);
          background-color: #0052a3;
          box-shadow: 0 6px 25px rgba(0, 102, 204, 0.4);
        }
        
        .chatbot-header-button:hover {
          background-color: #f3f4f6;
          color: #374151;
        }
        
        .chatbot-suggestion:hover {
          background-color: #0066cc;
          color: #ffffff;
          border-color: #0066cc;
        }
        
        .chatbot-send:hover:not(:disabled) {
          background-color: #0052a3;
          transform: scale(1.05);
        }
        
        .chatbot-quick-search:hover {
          background-color: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .chatbot-clear:hover {
          background-color: #dc2626;
          color: #ffffff;
        }
        
        .chatbot-input:focus {
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }
        
        .chatbot-action:hover {
          background-color: #f9fafb;
          border-color: #d1d5db;
        }
      `}</style>

      <div style={containerStyle} className={className}>
        {/* Bouton d'ouverture */}
        {!isOpen && (
          <button
            onClick={toggleChat}
            style={styles.openButton}
            className="chatbot-button"
            aria-label="Ouvrir l'assistant"
          >
            <Icons.MessageCircle />
            {quickSuggestions.length > 0 && (
              <div style={styles.notificationBadge}>!</div>
            )}
          </button>
        )}

        {/* Interface du chat */}
        {isOpen && (
          <div style={interfaceStyle}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerContent}>
                <div style={styles.headerAvatar}>
                  <Icons.Bot />
                </div>
                {!isMinimized && (
                  <div>
                    <h3 style={styles.headerTitle}>Assistant CRM</h3>
                    <p style={styles.headerSubtitle}>
                      {context.currentRoute
                        ? `📍 ${context.currentRoute}`
                        : "Navigation intelligente"}
                    </p>
                  </div>
                )}
                {isMinimized && (
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    Assistant CRM
                  </span>
                )}
              </div>

              <div style={styles.headerActions}>
                <button
                  onClick={getContextualHelp}
                  style={styles.headerButton}
                  className="chatbot-header-button"
                  title="Aide contextuelle"
                >
                  <Icons.HelpCircle />
                </button>
                {!isMinimized && (
                  <>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      style={styles.headerButton}
                      className="chatbot-header-button"
                      title="Paramètres"
                    >
                      <Icons.Settings />
                    </button>
                    <button
                      onClick={resetSession}
                      style={styles.headerButton}
                      className="chatbot-header-button"
                      title="Nouvelle conversation"
                    >
                      <Icons.Trash2 />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={styles.headerButton}
                  className="chatbot-header-button"
                  title={isMinimized ? "Agrandir" : "Réduire"}
                >
                  <Icons.Minimize2 />
                </button>
                <button
                  onClick={closeChat}
                  style={styles.headerButton}
                  className="chatbot-header-button"
                  title="Fermer"
                >
                  <Icons.X />
                </button>
              </div>
            </div>

            {/* Panneau des paramètres */}
            {showSettings && !isMinimized && (
              <div style={styles.settingsPanel}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={styles.settingsTitle}>Paramètres</span>
                  <button
                    onClick={() => setShowSettings(false)}
                    style={{ ...styles.headerButton, color: "#6b7280" }}
                  >
                    <Icons.X />
                  </button>
                </div>
                <div style={styles.settingsRow}>
                  <span style={{ color: "#6b7280" }}>Session ID:</span>
                  <span style={styles.settingsValue}>
                    {(context as any).sessionId || "Non défini"}
                  </span>
                </div>
                <div style={styles.settingsRow}>
                  <span style={{ color: "#6b7280" }}>Messages:</span>
                  <span>{messages.length}</span>
                </div>
                <button
                  onClick={clearMessages}
                  style={styles.clearButton}
                  className="chatbot-clear"
                >
                  Effacer l&apos;historique
                </button>
              </div>
            )}

            {/* Messages */}
            {!isMinimized && (
              <div style={styles.messagesContainer}>
                {/* Message de bienvenue */}
                {messages.length === 0 && (
                  <div style={styles.welcomeMessage}>
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "16px",
                        color: "#0066cc",
                      }}
                    >
                      🤖
                    </div>
                    <h4 style={styles.welcomeTitle}>👋 Bonjour !</h4>
                    <p style={styles.welcomeSubtitle}>
                      Je vous aide à naviguer dans votre CRM. Posez-moi vos
                      questions !
                    </p>

                    {quickSuggestions.length > 0 && (
                      <div style={styles.quickSuggestions}>
                        <p style={styles.quickSuggestionsTitle}>
                          Suggestions pour cette page :
                        </p>
                        <div>
                          {quickSuggestions
                            .slice(0, 3)
                            .map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleQuickSuggestion(suggestion)
                                }
                                style={styles.quickSuggestionButton}
                                className="chatbot-suggestion"
                              >
                                {suggestion}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Messages de conversation */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.messageWrapper,
                      ...(message.role === "user"
                        ? styles.messageWrapperUser
                        : {}),
                    }}
                  >
                    {message.role === "assistant" && (
                      <div
                        style={{ ...styles.avatar, ...styles.avatarAssistant }}
                      >
                        <Icons.Bot />
                      </div>
                    )}

                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(message.role === "user"
                          ? styles.messageBubbleUser
                          : styles.messageBubbleAssistant),
                      }}
                    >
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {message.content}
                      </div>

                      {/* Actions suggérées */}
                      {message.role === "assistant" &&
                        message.metadata?.relatedPages &&
                        message.metadata.relatedPages.length > 0 && (
                          <div style={styles.suggestedActions}>
                            <div style={styles.suggestedActionsTitle}>
                              Actions suggérées :
                            </div>
                            <div>
                              {message.metadata.relatedPages
                                .slice(0, 3)
                                .map((route, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestedAction(route)}
                                    style={styles.suggestedActionButton}
                                    className="chatbot-action"
                                  >
                                    <Icons.ChevronRight />
                                    <span style={styles.suggestedActionRoute}>
                                      {route}
                                    </span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}

                      <div
                        style={{
                          ...styles.timestamp,
                          ...(message.role === "user"
                            ? styles.timestampUser
                            : {}),
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div style={{ ...styles.avatar, ...styles.avatarUser }}>
                        <Icons.User />
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicateur de chargement */}
                {isLoading && (
                  <div style={styles.loadingIndicator}>
                    <div
                      style={{ ...styles.avatar, ...styles.avatarAssistant }}
                    >
                      <Icons.Bot />
                    </div>
                    <div style={styles.loadingContent}>
                      <div style={styles.loadingSpinner}></div>
                      <span style={{ fontSize: "14px", color: "#6b7280" }}>
                        Réflexion en cours...
                      </span>
                    </div>
                  </div>
                )}

                {/* Message d'erreur */}
                {error && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          backgroundColor: "#dc2626",
                          borderRadius: "50%",
                          flexShrink: 0,
                        }}
                      ></div>
                      <span
                        style={{ fontSize: "14px", color: "#dc2626", flex: 1 }}
                      >
                        {error}
                      </span>
                      <button
                        onClick={() => setError(null)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Icons.X />
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Barre de recherche rapide */}
            {!isMinimized && (
              <div style={styles.quickSearchBar}>
                <div style={styles.quickSearchButtons}>
                  <button
                    onClick={() => searchFeatures("clients")}
                    style={styles.quickSearchButton}
                    className="chatbot-quick-search"
                    title="Rechercher dans les clients"
                  >
                    🏢 Clients
                  </button>
                  <button
                    onClick={() => searchFeatures("opportunités")}
                    style={styles.quickSearchButton}
                    className="chatbot-quick-search"
                    title="Rechercher dans les opportunités"
                  >
                    💰 Deals
                  </button>
                  <button
                    onClick={() => searchFeatures("pipeline")}
                    style={styles.quickSearchButton}
                    className="chatbot-quick-search"
                    title="Voir le pipeline"
                  >
                    📊 Pipeline
                  </button>
                  <button
                    onClick={() => searchFeatures("mail")}
                    style={styles.quickSearchButton}
                    className="chatbot-quick-search"
                    title="Accéder à la messagerie"
                  >
                    📧 Mail
                  </button>
                </div>
              </div>
            )}

            {/* Zone de saisie */}
            <div style={styles.inputContainer}>
              <form onSubmit={handleSubmit} style={styles.inputForm}>
                <div style={styles.inputWrapper}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      isMinimized
                        ? "Question..."
                        : "Tapez votre question... Ex: 'où sont mes clients ?'"
                    }
                    style={{
                      ...styles.messageInput,
                      ...(isLoading
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}),
                    }}
                    className="chatbot-input"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    ...styles.sendButton,
                    ...(!inputValue.trim() || isLoading
                      ? styles.sendButtonDisabled
                      : {}),
                  }}
                  className="chatbot-send"
                  title="Envoyer le message"
                >
                  {isLoading ? <Icons.Loader2 /> : <Icons.Send />}
                </button>
              </form>

              {/* Footer */}
              {!isMinimized && (
                <div style={styles.inputFooter}>
                  <span>
                    Appuyez sur Entrée pour envoyer • {messages.length} message
                    {messages.length !== 1 ? "s" : ""}
                    {error && " • ⚠ Erreur"}
                    {isLoading && " • ⏳ En cours..."}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
