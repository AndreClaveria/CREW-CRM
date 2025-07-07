/* src/styles/chatbot.styles.ts */

export const chatbotStyles = {
  // Container principal
  chatbotContainer: {
    position: "fixed",
    zIndex: "1000",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },

  // Positions
  positionBottomRight: {
    bottom: "24px",
    right: "24px",
  },

  positionBottomLeft: {
    bottom: "24px",
    left: "24px",
  },

  positionTopRight: {
    top: "24px",
    right: "24px",
  },

  positionTopLeft: {
    top: "24px",
    left: "24px",
  },

  // Bouton d'ouverture - Style moderne et épuré
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
    position: "relative",
  },

  openButtonHover: {
    transform: "scale(1.05)",
    backgroundColor: "#0052a3",
    boxShadow: "0 6px 25px rgba(0, 102, 204, 0.4)",
  },

  // Badge de notification
  notificationBadge: {
    position: "absolute",
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

  // Interface du chat - Design conventionnel
  chatInterface: {
    width: "380px",
    height: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "all 0.3s ease",
    position: "relative",
  },

  chatInterfaceMinimized: {
    width: "320px",
    height: "64px",
  },

  chatInterfaceExpanded: {
    height: "600px",
  },

  // Header - Style épuré
  chatHeader: {
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

  headerButtonHover: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },

  // Panneau des paramètres
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

  settingsLabel: {
    color: "#6b7280",
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
    whiteSpace: "nowrap",
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

  clearButtonHover: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
  },

  // Zone des messages
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "#ffffff",
  },

  // Message de bienvenue
  welcomeMessage: {
    textAlign: "center",
    padding: "40px 20px",
  },

  welcomeIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    color: "#0066cc",
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

  // Suggestions rapides
  quickSuggestions: {
    marginTop: "16px",
  },

  quickSuggestionsTitle: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: "8px",
  },

  quickSuggestionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  quickSuggestionButton: {
    width: "100%",
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#374151",
  },

  quickSuggestionButtonHover: {
    backgroundColor: "#0066cc",
    color: "#ffffff",
    borderColor: "#0066cc",
  },

  // Messages de conversation
  messageWrapper: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },

  messageWrapperUser: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },

  messageWrapperAssistant: {
    justifyContent: "flex-start",
  },

  // Avatars
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

  // Bulles de message
  messageBubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "14px",
    lineHeight: "1.4",
    wordWrap: "break-word",
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

  messageContent: {
    whiteSpace: "pre-wrap",
  },

  // Actions suggérées
  suggestedActions: {
    marginTop: "12px",
    marginLeft: "44px", // Aligné avec les messages
  },

  suggestedActionsTitle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "8px",
  },

  suggestedActionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
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
    textAlign: "left",
  },

  suggestedActionButtonHover: {
    backgroundColor: "#f9fafb",
    borderColor: "#d1d5db",
  },

  suggestedActionIcon: {
    fontSize: "12px",
    color: "#0066cc",
  },

  suggestedActionRoute: {
    flex: 1,
    fontFamily: "Monaco, 'Cascadia Code', 'Roboto Mono', monospace",
    color: "#0066cc",
    fontSize: "12px",
  },

  // Timestamp
  messageTimestamp: {
    fontSize: "11px",
    marginTop: "4px",
    textAlign: "right",
  },

  timestampUser: {
    color: "rgba(255, 255, 255, 0.7)",
  },

  timestampAssistant: {
    color: "#9ca3af",
  },

  // Indicateur de chargement
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

  loadingText: {
    fontSize: "14px",
    color: "#6b7280",
  },

  loadingSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #0066cc",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  // Message d'erreur
  errorMessage: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "16px",
  },

  errorContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  errorIcon: {
    width: "16px",
    height: "16px",
    color: "#dc2626",
    flexShrink: 0,
  },

  errorText: {
    fontSize: "14px",
    color: "#dc2626",
    flex: 1,
  },

  // Zone de saisie
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
    position: "relative",
  },

  messageInput: {
    width: "100%",
    minHeight: "40px",
    maxHeight: "120px",
    padding: "10px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
    resize: "none",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
  },

  messageInputFocus: {
    borderColor: "#0066cc",
    boxShadow: "0 0 0 3px rgba(0, 102, 204, 0.1)",
  },

  messageInputDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: "#f9fafb",
  },

  // Bouton d'envoi
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

  sendButtonHover: {
    backgroundColor: "#0052a3",
    transform: "scale(1.05)",
  },

  sendButtonDisabled: {
    backgroundColor: "#d1d5db",
    cursor: "not-allowed",
    transform: "none",
  },

  // Informations en bas
  inputFooter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "8px",
    fontSize: "11px",
    color: "#9ca3af",
  },

  inputHint: {
    fontSize: "11px",
    color: "#9ca3af",
  },

  // Animations
  keyframes: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,

  // Responsive
  responsive: `
    @media (max-width: 480px) {
      .chatbot-interface {
        width: calc(100vw - 32px);
        height: calc(100vh - 100px);
        max-height: 600px;
        margin: 16px;
      }
      
      .chatbot-interface-minimized {
        width: calc(100vw - 32px);
        height: 64px;
      }

      .chatbot-container {
        bottom: 16px;
        right: 16px;
      }
    }
  `,
};
