// services/ai.service.ts - INTERFACES MISES À JOUR

const AI_API_URL =
  process.env.NEXT_PUBLIC_API_URL_IA || "http://localhost:3005/api/";

// ✅ Interface complète correspondant exactement à votre API
export interface AIAnalysisResult {
  // Données de base (existantes)
  score: number; // Score de 0 à 100
  recommendation?: string; // Recommandation d'action simple
  reasoning?: string; // Raisonnement de l'IA
  priority:
    | "disqualified"
    | "low"
    | "medium"
    | "high"
    | "critical"
    | "basse"
    | "moyenne"
    | "haute";
  nextAction?: string; // Prochaine action recommandée
  timeframe?: string; // Délai recommandé

  // ✅ Nouvelles données complètes de votre API
  category?: string; // Catégorie du client (ex: "révision")
  timestamp?: string; // Timestamp de l'analyse

  // Arrays détaillés
  strengths?: string[]; // Forces du client
  weaknesses?: string[]; // Faiblesses du client

  // Recommandations détaillées
  recommendations?: {
    immediate?: string; // Actions immédiates
    shortTerm?: string; // Court terme
    longTerm?: string; // Long terme
  };

  // Évaluation des risques
  riskAssessment?: {
    level?: string; // "high", "medium", "low"
    factors?: string[]; // Facteurs de risque
    mitigation?: string; // Stratégie d'atténuation
  };

  // Plan d'action détaillé
  nextSteps?: {
    action?: string; // Action à mener
    timeframe?: string; // Délai pour l'action
    responsible?: string; // Responsable
    success_metrics?: string; // Métriques de succès
  };
}

// ✅ Interface pour la réponse complète de l'API
export interface AIAnalysisResponse {
  success: boolean;
  clientId: string;
  analysis: AIAnalysisResult;
  timestamp: string;
}

export interface AIHealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  message: string;
  timestamp: Date;
  services?: {
    [key: string]: "up" | "down";
  };
}

// Interface pour les erreurs de l'API IA
export interface AIError {
  error: string;
  message: string;
  clientId?: string;
  timestamp: Date;
}

const headers = {
  "Content-Type": "application/json",
};

/**
 * Vérification de l'état de santé du service IA
 */
export const checkAIHealth = async (): Promise<AIHealthStatus> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    console.log(`🔍 Vérification santé du service IA: ${AI_API_URL}/health`);

    const response = await fetch(`http://localhost:3005/health`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la vérification du service IA"
      );
    }

    const data = await response.json();
    console.log("✅ Service IA disponible:", data);

    return {
      status: data.status || "healthy",
      message: data.message || "Service IA opérationnel",
      timestamp: new Date(data.timestamp || Date.now()),
      services: data.services,
    };
  } catch (error: any) {
    console.error("❌ Erreur lors de la vérification du service IA:", error);

    return {
      status: "unhealthy",
      message: error.message || "Service IA indisponible",
      timestamp: new Date(),
    };
  }
};

/**
 * ✅ Analyser un client spécifique avec l'IA - MISE À JOUR
 */
export const analyzeClient = async (
  clientId: string
): Promise<AIAnalysisResult> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    if (!clientId) {
      throw new Error("ID du client requis pour l'analyse");
    }

    console.log(`🤖 Début de l'analyse IA pour le client: ${clientId}`);

    // ✅ URL cohérente
    const analyzeUrl = `${AI_API_URL}ai/analyze/${clientId}`;
    console.log(`📡 URL d'analyse: ${analyzeUrl}`);

    const response = await fetch(analyzeUrl, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur réponse API IA:", errorData);
      throw new Error(
        errorData.message || `Erreur lors de l'analyse du client ${clientId}`
      );
    }

    const data = await response.json();
    console.log("🎯 Résultat de l'analyse IA brut:", data);

    // ✅ Gérer le format de réponse de votre API
    let analysisResult: AIAnalysisResult;

    if (data.success && data.analysis) {
      // Format: { success: true, analysis: AIAnalysisResult, clientId, timestamp }
      analysisResult = {
        ...data.analysis,
        timestamp: data.timestamp, // Ajouter le timestamp de la réponse
      };
    } else if (data.score !== undefined) {
      // Format direct: AIAnalysisResult
      analysisResult = data as AIAnalysisResult;
    } else {
      throw new Error("Format de réponse invalide du service IA");
    }

    // Validation des données requises
    if (typeof analysisResult.score !== "number") {
      throw new Error("Score manquant dans la réponse IA");
    }

    console.log("✅ Analyse IA terminée:", {
      score: analysisResult.score,
      category: analysisResult.category,
      priority: analysisResult.priority,
      strengthsCount: analysisResult.strengths?.length || 0,
      weaknessesCount: analysisResult.weaknesses?.length || 0,
      hasRecommendations: !!analysisResult.recommendations,
      hasRiskAssessment: !!analysisResult.riskAssessment,
      hasNextSteps: !!analysisResult.nextSteps,
    });

    // ✅ Retourner les données complètes avec fallbacks pour compatibilité
    return {
      score: analysisResult.score,
      category: analysisResult.category,
      priority: analysisResult.priority || "medium",
      reasoning: analysisResult.reasoning || "Raisonnement non fourni",
      timestamp: analysisResult.timestamp,

      // Données détaillées (nouvelles)
      strengths: analysisResult.strengths || [],
      weaknesses: analysisResult.weaknesses || [],
      recommendations: analysisResult.recommendations,
      riskAssessment: analysisResult.riskAssessment,
      nextSteps: analysisResult.nextSteps,

      // Fallbacks pour compatibilité avec l'ancien format
      recommendation:
        analysisResult.recommendation ||
        analysisResult.recommendations?.immediate ||
        "Aucune recommandation disponible",
      nextAction:
        analysisResult.nextAction ||
        analysisResult.nextSteps?.action ||
        "Contacter le client",
      timeframe:
        analysisResult.timeframe ||
        analysisResult.nextSteps?.timeframe ||
        "Cette semaine",
    };
  } catch (error: any) {
    console.error(
      `❌ Erreur lors de l'analyse IA du client ${clientId}:`,
      error
    );
    throw new Error(error.message || "Erreur lors de l'analyse IA du client");
  }
};

/**
 * Analyser plusieurs clients en lot (optionnel pour futures fonctionnalités)
 */
export const analyzeBatchClients = async (
  clientIds: string[]
): Promise<AIAnalysisResult[]> => {
  try {
    console.log(`🔄 Analyse en lot de ${clientIds.length} clients`);
    const results: AIAnalysisResult[] = [];

    // Analyser chaque client individuellement pour éviter de surcharger l'API
    for (const clientId of clientIds) {
      try {
        const result = await analyzeClient(clientId);
        results.push(result);

        // Petite pause entre chaque analyse pour éviter le rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(
          `✅ Client ${clientId} analysé (${results.length}/${clientIds.length})`
        );
      } catch (error) {
        console.warn(
          `⚠️ Échec de l'analyse pour le client ${clientId}:`,
          error
        );
        // Continuer avec les autres clients même si un échoue
      }
    }

    console.log(
      `🎯 Analyse en lot terminée: ${results.length}/${clientIds.length} réussies`
    );
    return results;
  } catch (error: any) {
    console.error("❌ Erreur lors de l'analyse en lot:", error);
    throw new Error(
      error.message || "Erreur lors de l'analyse en lot des clients"
    );
  }
};

/**
 * Fonction utilitaire pour formater le score IA (seuils stricts)
 */
export const formatAIScore = (score: number): string => {
  if (score >= 90) return "🔥 Exceptionnel";
  if (score >= 80) return "🟢 Excellent";
  if (score >= 70) return "🟡 Bon";
  if (score >= 50) return "🟠 Moyen";
  if (score >= 30) return "🔴 Faible";
  return "💀 Disqualifié";
};

/**
 * ✅ Fonction utilitaire pour formater la priorité - MISE À JOUR
 */
export const formatPriority = (
  priority: AIAnalysisResult["priority"]
): string => {
  switch (priority) {
    case "critical":
      return "🚨 Critique";
    case "high":
    case "haute":
      return "🔴 Haute";
    case "medium":
    case "moyenne":
      return "🟡 Moyenne";
    case "low":
    case "basse":
      return "🟢 Basse";
    case "disqualified":
      return "❌ Disqualifié";
    default:
      return "⚪ Non définie";
  }
};

/**
 * Obtenir la couleur du score pour l'affichage (seuils stricts)
 */
export const getScoreColor = (score: number): string => {
  if (score >= 90) return "#FF4500"; // Rouge-orange (exceptionnel)
  if (score >= 80) return "#4CAF50"; // Vert (excellent)
  if (score >= 70) return "#2196F3"; // Bleu (bon)
  if (score >= 50) return "#FF9800"; // Orange (moyen)
  if (score >= 30) return "#FFC107"; // Jaune (faible)
  return "#9E9E9E"; // Gris (disqualifié)
};

/**
 * ✅ Obtenir la couleur de la priorité - MISE À JOUR
 */
export const getPriorityColor = (
  priority: AIAnalysisResult["priority"]
): string => {
  switch (priority) {
    case "critical":
      return "#D32F2F"; // Rouge foncé
    case "high":
    case "haute":
      return "#F44336"; // Rouge
    case "medium":
    case "moyenne":
      return "#FF9800"; // Orange
    case "low":
    case "basse":
      return "#4CAF50"; // Vert
    case "disqualified":
      return "#9E9E9E"; // Gris
    default:
      return "#9E9E9E"; // Gris
  }
};

/**
 * Fonction utilitaire pour formater le délai
 */
export const formatTimeframe = (timeframe: string): string => {
  const lowerTimeframe = timeframe.toLowerCase();

  if (
    lowerTimeframe.includes("urgent") ||
    lowerTimeframe.includes("immédiat") ||
    lowerTimeframe.includes("critique")
  ) {
    return "🚨 Urgent";
  }
  if (lowerTimeframe.includes("24h") || lowerTimeframe.includes("24 h")) {
    return "⚡ 24h";
  }
  if (lowerTimeframe.includes("semaine")) {
    return "📅 Cette semaine";
  }
  if (lowerTimeframe.includes("mois")) {
    return "📆 Ce mois";
  }

  return `⏰ ${timeframe}`;
};

/**
 * Test de connectivité avec le service IA
 */
export const testAIConnection = async (): Promise<boolean> => {
  try {
    const healthStatus = await checkAIHealth();
    return healthStatus.status === "healthy";
  } catch (error) {
    console.error("❌ Test de connexion IA échoué:", error);
    return false;
  }
};

/**
 * ✅ NOUVELLE: Fonction pour obtenir l'icône selon le score
 */
export const getScoreIcon = (score: number): string => {
  if (score >= 90) return "🔥";
  if (score >= 80) return "🚀";
  if (score >= 70) return "✅";
  if (score >= 50) return "⚠️";
  if (score >= 30) return "❌";
  return "💀";
};

/**
 * ✅ NOUVELLE: Fonction pour obtenir l'action recommandée selon le score
 */
export const getRecommendedAction = (score: number): string => {
  if (score >= 90) return "Action immédiate CEO";
  if (score >= 80) return "Contact commercial urgent";
  if (score >= 70) return "Programmer RDV";
  if (score >= 50) return "Qualification approfondie";
  if (score >= 30) return "Nurturing automatique";
  return "Archiver";
};

/**
 * ✅ NOUVELLE: Vérifier si un client doit être re-analysé
 */
export const shouldReanalyze = (
  lastAnalysis: Date,
  clientData: any
): boolean => {
  if (!lastAnalysis) return true;

  const daysSinceAnalysis = Math.floor(
    (Date.now() - lastAnalysis.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Re-analyser si :
  // - Plus de 7 jours depuis la dernière analyse
  // - Nouvelles interactions depuis
  // - Budget modifié
  return (
    daysSinceAnalysis > 7 ||
    (clientData.lastContactDate &&
      new Date(clientData.lastContactDate) > lastAnalysis)
  );
};
