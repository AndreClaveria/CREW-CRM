// components/ai/AIAnalysis.tsx
import React, { useState } from "react";
import { useClientAI } from "@/hooks/useAi";
import {
  formatAIScore,
  formatPriority,
  formatTimeframe,
  getScoreColor,
  getPriorityColor,
} from "@/services/ai.service";
import ActionButton from "@/components/common/ActionButton";

interface AIAnalysisProps {
  clientId: string;
  clientName: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ clientId, clientName }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const {
    analysis,
    isAnalyzing,
    error,
    runAnalysis,
    clearError,
    lastAnalysisDate,
  } = useClientAI(clientId, false);

  const handleAnalyze = async () => {
    clearError();
    await runAnalysis(clientId);
  };

  const isAnalysisRecent =
    lastAnalysisDate &&
    Date.now() - lastAnalysisDate.getTime() < 24 * 60 * 60 * 1000;

  const getScoreColorExtended = (score: number) => {
    if (score >= 80) return "#4CAF50";
    if (score >= 60) return "#FF9800";
    if (score >= 40) return "#FFC107";
    return "#F44336";
  };

  const getPriorityColorExtended = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "haute":
      case "high":
        return "#F44336";
      case "moyenne":
      case "medium":
        return "#FF9800";
      case "basse":
      case "low":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
      case "élevé":
        return "#F44336";
      case "medium":
      case "moyen":
        return "#FF9800";
      case "low":
      case "faible":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ marginTop: "30px" }}>
      {/* Header avec bouton d'analyse */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            color: "#333",
            margin: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          🤖 Analyse IA
          {isAnalysisRecent && (
            <span
              style={{
                fontSize: "12px",
                backgroundColor: "#e8f5e8",
                color: "#2e7d2e",
                padding: "2px 6px",
                borderRadius: "4px",
                marginLeft: "10px",
              }}
            >
              Récente
            </span>
          )}
        </h3>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {lastAnalysisDate && (
            <span style={{ fontSize: "12px", color: "#666" }}>
              Dernière analyse: {lastAnalysisDate.toLocaleDateString()} à{" "}
              {lastAnalysisDate.toLocaleTimeString()}
            </span>
          )}

          <ActionButton
            onClick={handleAnalyze}
            variant="primary"
            size="medium"
            customColor="#8B5CF6"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span style={{ marginRight: "8px" }}>🔄</span>
                Analyse en cours...
              </>
            ) : (
              <>
                <span style={{ marginRight: "8px" }}>🤖</span>
                {analysis ? "Ré-analyser" : "Analyser avec IA"}
              </>
            )}
          </ActionButton>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "20px", marginRight: "10px" }}>❌</span>
            <strong style={{ color: "#d32f2f" }}>
              Erreur d&apos;analyse IA
            </strong>
          </div>
          <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>{error}</p>
          <ActionButton onClick={clearError} variant="secondary" size="small">
            Masquer
          </ActionButton>
        </div>
      )}

      {/* Chargement */}
      {isAnalyzing && (
        <div
          style={{
            backgroundColor: "#f3e5f5",
            border: "2px solid #8B5CF6",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontSize: "40px" }}>🤖</span>
          </div>
          <h4 style={{ color: "#8B5CF6", margin: "0 0 10px 0" }}>
            Analyse IA en cours...
          </h4>
          <p style={{ color: "#666", margin: 0 }}>
            L&apos;IA analyse les données de <strong>{clientName}</strong>
          </p>
          <div
            style={{
              marginTop: "15px",
              height: "4px",
              backgroundColor: "#e0e0e0",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "#8B5CF6",
                borderRadius: "2px",
                animation: "loading 2s ease-in-out infinite",
              }}
            />
          </div>
          <style>
            {`
              @keyframes loading {
                0% { width: 0%; margin-left: 0%; }
                50% { width: 50%; margin-left: 25%; }
                100% { width: 0%; margin-left: 100%; }
              }
            `}
          </style>
        </div>
      )}

      {/* Résultats de l'analyse COMPLETS */}
      {analysis && !isAnalyzing && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            border: "2px solid #8B5CF6",
            borderRadius: "12px",
            padding: "25px",
          }}
        >
          {/* HEADER AVEC SCORE ET INFOS GÉNÉRALES */}
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "20px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            {/* Score Circle */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: getScoreColorExtended(analysis.score),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {analysis.score}
            </div>

            {/* Infos principales */}
            <div>
              <h5
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "18px",
                  color: "#212529",
                }}
              >
                Analyse de {clientName}
              </h5>
              <p style={{ margin: "0 0 5px 0", color: "#6c757d" }}>
                <strong>Catégorie:</strong>{" "}
                <span
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    color: "#495057",
                  }}
                >
                  {analysis.category || "Non définie"}
                </span>
              </p>
              {analysis.timestamp && (
                <p style={{ margin: 0, color: "#6c757d" }}>
                  <strong>Analysé le:</strong>{" "}
                  {formatTimestamp(analysis.timestamp)}
                </p>
              )}
            </div>

            {/* Priority Badge */}
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: getPriorityColorExtended(analysis.priority),
                color: "white",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Priorité {formatPriority(analysis.priority)}
            </div>
          </div>

          {/* RAISONNEMENT */}
          {analysis.reasoning && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ margin: "0 0 12px 0", color: "#495057" }}>
                🧠 Raisonnement de l&apos;IA
              </h5>
              <p
                style={{
                  margin: 0,
                  lineHeight: "1.6",
                  color: "#212529",
                  fontStyle: "italic",
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "6px",
                  borderLeft: "4px solid #007bff",
                }}
              >
                {analysis.reasoning}
              </p>
            </div>
          )}

          {/* FORCES ET FAIBLESSES */}
          {(analysis.strengths || analysis.weaknesses) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              {/* Forces */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <h5
                    style={{
                      margin: "0 0 15px 0",
                      color: "#28a745",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    ✅ Forces ({analysis.strengths.length})
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {analysis.strengths.map((strength, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: "8px",
                          color: "#212529",
                          lineHeight: "1.4",
                        }}
                      >
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Faiblesses */}
              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <h5
                    style={{
                      margin: "0 0 15px 0",
                      color: "#dc3545",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    ⚠️ Faiblesses ({analysis.weaknesses.length})
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {analysis.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: "8px",
                          color: "#212529",
                          lineHeight: "1.4",
                        }}
                      >
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* RECOMMANDATIONS */}
          {analysis.recommendations && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ margin: "0 0 20px 0", color: "#495057" }}>
                💡 Recommandations Stratégiques
              </h5>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {analysis.recommendations.immediate && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      borderRadius: "6px",
                      borderLeft: "4px solid #ffc107",
                    }}
                  >
                    <strong style={{ color: "#856404" }}>
                      ⚡ Actions Immédiates:
                    </strong>
                    <p style={{ margin: "5px 0 0 0", color: "#212529" }}>
                      {analysis.recommendations.immediate}
                    </p>
                  </div>
                )}

                {analysis.recommendations.shortTerm && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#d1ecf1",
                      borderRadius: "6px",
                      borderLeft: "4px solid #17a2b8",
                    }}
                  >
                    <strong style={{ color: "#0c5460" }}>
                      📅 Court Terme:
                    </strong>
                    <p style={{ margin: "5px 0 0 0", color: "#212529" }}>
                      {analysis.recommendations.shortTerm}
                    </p>
                  </div>
                )}

                {analysis.recommendations.longTerm && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#d4edda",
                      borderRadius: "6px",
                      borderLeft: "4px solid #28a745",
                    }}
                  >
                    <strong style={{ color: "#155724" }}>🎯 Long Terme:</strong>
                    <p style={{ margin: "5px 0 0 0", color: "#212529" }}>
                      {analysis.recommendations.longTerm}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ÉVALUATION DES RISQUES */}
          {analysis.riskAssessment && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                marginBottom: "20px",
              }}
            >
              <h5
                style={{
                  margin: "0 0 15px 0",
                  color: "#495057",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                🛡️ Évaluation des Risques
                {analysis.riskAssessment.level && (
                  <span
                    style={{
                      padding: "4px 12px",
                      backgroundColor: getRiskColor(
                        analysis.riskAssessment.level
                      ),
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Risque {analysis.riskAssessment.level}
                  </span>
                )}
              </h5>

              {analysis.riskAssessment.factors &&
                analysis.riskAssessment.factors.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <strong style={{ color: "#495057" }}>
                      Facteurs de risque:
                    </strong>
                    <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
                      {analysis.riskAssessment.factors.map((factor, index) => (
                        <li
                          key={index}
                          style={{
                            marginBottom: "5px",
                            color: "#212529",
                          }}
                        >
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {analysis.riskAssessment.mitigation && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    borderLeft: "4px solid #6c757d",
                  }}
                >
                  <strong style={{ color: "#495057" }}>
                    🛠️ Stratégie d&apos;Atténuation:
                  </strong>
                  <p style={{ margin: "5px 0 0 0", color: "#212529" }}>
                    {analysis.riskAssessment.mitigation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PROCHAINES ÉTAPES */}
          {analysis.nextSteps && (
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ margin: "0 0 20px 0", color: "#495057" }}>
                🎯 Plan d&apos;Action
              </h5>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  {analysis.nextSteps.action && (
                    <div style={{ marginBottom: "15px" }}>
                      <strong style={{ color: "#495057" }}>
                        📋 Action à mener:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: "#212529",
                          backgroundColor: "#e9ecef",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        {analysis.nextSteps.action}
                      </p>
                    </div>
                  )}

                  {analysis.nextSteps.timeframe && (
                    <div>
                      <strong style={{ color: "#495057" }}>⏰ Délai:</strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: "#212529",
                          fontWeight: "bold",
                        }}
                      >
                        {analysis.nextSteps.timeframe}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  {analysis.nextSteps.responsible && (
                    <div style={{ marginBottom: "15px" }}>
                      <strong style={{ color: "#495057" }}>
                        👤 Responsable:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: "#212529",
                          fontWeight: "bold",
                        }}
                      >
                        {analysis.nextSteps.responsible}
                      </p>
                    </div>
                  )}

                  {analysis.nextSteps.success_metrics && (
                    <div>
                      <strong style={{ color: "#495057" }}>
                        📊 Métriques de succès:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: "#212529",
                          fontSize: "14px",
                          fontStyle: "italic",
                        }}
                      >
                        {analysis.nextSteps.success_metrics}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions rapides (données existantes) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            {analysis.nextAction && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <h5
                  style={{
                    margin: "0 0 8px 0",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  🎯 Prochaine action
                </h5>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#444",
                    fontWeight: "500",
                  }}
                >
                  {analysis.nextAction}
                </p>
              </div>
            )}

            {analysis.timeframe && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <h5
                  style={{
                    margin: "0 0 8px 0",
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  ⏰ Délai recommandé
                </h5>
                <span style={{ fontSize: "14px", color: "#666" }}>
                  {formatTimeframe(analysis.timeframe)}
                </span>
              </div>
            )}
          </div>

          {/* Recommandation simple */}
          {analysis.recommendation && (
            <div
              style={{
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                marginBottom: "15px",
              }}
            >
              <h5
                style={{ margin: "0 0 8px 0", color: "#333", fontSize: "14px" }}
              >
                💡 Recommandation
              </h5>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "1.5",
                }}
              >
                {analysis.recommendation}
              </p>
            </div>
          )}

          {/* Bouton pour afficher/masquer le debug */}

          {/* DONNÉES TECHNIQUES DEBUG */}
        </div>
      )}

      {/* Message si pas encore d'analyse */}
      {!analysis && !isAnalyzing && !error && (
        <div
          style={{
            backgroundColor: "#f5f5f5",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontSize: "48px" }}>🤖</span>
          </div>
          <h4 style={{ color: "#666", margin: "0 0 10px 0" }}>
            Aucune analyse IA disponible
          </h4>
          <p style={{ color: "#888", margin: "0 0 20px 0", fontSize: "14px" }}>
            Cliquez sur Analyser avec IA pour obtenir une analyse intelligente
            de ce client
          </p>
          <p style={{ color: "#aaa", margin: 0, fontSize: "12px" }}>
            L&apos;IA analysera les données du client et fournira des
            recommandations personnalisées
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
