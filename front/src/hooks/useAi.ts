// hooks/useAI.ts
import { useState, useEffect, useCallback } from "react";
import {
  AIAnalysisResult,
  AIHealthStatus,
  analyzeClient,
  checkAIHealth,
  analyzeBatchClients,
  testAIConnection,
} from "@/services/ai.service";

interface UseAIProps {
  clientId?: string;
  autoAnalyze?: boolean; // Analyser automatiquement au chargement
  healthCheckInterval?: number; // Intervalle de vérification santé (ms)
}

interface UseAIReturn {
  // États principaux
  analysis: AIAnalysisResult | null;
  healthStatus: AIHealthStatus | null;
  isAnalyzing: boolean;
  isCheckingHealth: boolean;
  error: string | null;

  // Actions
  runAnalysis: (clientId: string) => Promise<AIAnalysisResult | null>;
  runBatchAnalysis: (clientIds: string[]) => Promise<AIAnalysisResult[]>;
  checkHealth: () => Promise<AIHealthStatus | null>;
  testConnection: () => Promise<boolean>;
  clearError: () => void;
  clearAnalysis: () => void;

  // États dérivés
  isServiceHealthy: boolean;
  lastAnalysisDate: Date | null;

  // Cache pour les analyses multiples
  analysisCache: Map<string, AIAnalysisResult>;
  getCachedAnalysis: (clientId: string) => AIAnalysisResult | null;
  clearCache: () => void;
}

export const useAI = ({
  clientId,
  autoAnalyze = false,
  healthCheckInterval = 60000, // 1 minute par défaut
}: UseAIProps = {}): UseAIReturn => {
  // États principaux
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [healthStatus, setHealthStatus] = useState<AIHealthStatus | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalysisDate, setLastAnalysisDate] = useState<Date | null>(null);

  // Cache pour stocker les analyses multiples
  const [analysisCache, setAnalysisCache] = useState<
    Map<string, AIAnalysisResult>
  >(new Map());

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fonction pour effacer l'analyse
  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setLastAnalysisDate(null);
  }, []);

  // Fonction pour effacer le cache
  const clearCache = useCallback(() => {
    setAnalysisCache(new Map());
  }, []);

  // Récupérer une analyse depuis le cache
  const getCachedAnalysis = useCallback(
    (clientId: string): AIAnalysisResult | null => {
      return analysisCache.get(clientId) || null;
    },
    [analysisCache]
  );

  // Analyser un client
  const runAnalysis = useCallback(
    async (targetClientId: string): Promise<AIAnalysisResult | null> => {
      if (!targetClientId) {
        setError("ID du client requis pour l'analyse");
        return null;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        console.log(
          `🤖 Lancement de l'analyse IA pour le client: ${targetClientId}`
        );

        const result = await analyzeClient(targetClientId);

        if (result) {
          setAnalysis(result);
          setLastAnalysisDate(new Date());

          // Mettre à jour le cache
          setAnalysisCache((prev) => new Map(prev.set(targetClientId, result)));

          console.log(`✅ Analyse terminée - Score: ${result.score}/100`);
          return result;
        }

        throw new Error("Aucun résultat d'analyse reçu");
      } catch (err: any) {
        console.error(
          `❌ Erreur lors de l'analyse du client ${targetClientId}:`,
          err
        );
        setError(err.message || "Erreur lors de l'analyse IA");
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  // Analyser plusieurs clients en lot
  const runBatchAnalysis = useCallback(
    async (clientIds: string[]): Promise<AIAnalysisResult[]> => {
      if (!clientIds.length) {
        setError("Liste de clients vide");
        return [];
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        console.log(`🔄 Analyse en lot de ${clientIds.length} clients`);

        const results = await analyzeBatchClients(clientIds);

        // Mettre à jour le cache avec tous les résultats
        setAnalysisCache((prev) => {
          const newCache = new Map(prev);
          results.forEach((result, index) => {
            newCache.set(clientIds[index], result);
          });
          return newCache;
        });

        console.log(`✅ Analyse en lot terminée: ${results.length} résultats`);
        return results;
      } catch (err: any) {
        console.error("❌ Erreur lors de l'analyse en lot:", err);
        setError(err.message || "Erreur lors de l'analyse en lot");
        return [];
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  // Vérifier la santé du service IA
  const checkHealth = useCallback(async (): Promise<AIHealthStatus | null> => {
    setIsCheckingHealth(true);

    try {
      console.log("🔍 Vérification de la santé du service IA");

      const status = await checkAIHealth();
      setHealthStatus(status);

      if (status.status === "healthy") {
        console.log("✅ Service IA en bonne santé");
      } else {
        console.warn("⚠️ Service IA dégradé:", status.message);
      }

      return status;
    } catch (err: any) {
      console.error("❌ Erreur lors de la vérification de santé:", err);
      const errorStatus: AIHealthStatus = {
        status: "unhealthy",
        message: err.message || "Service IA indisponible",
        timestamp: new Date(),
      };
      setHealthStatus(errorStatus);
      return errorStatus;
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  // Tester la connexion
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔗 Test de connexion au service IA");
      const isConnected = await testAIConnection();

      if (isConnected) {
        console.log("✅ Connexion IA établie");
      } else {
        console.error("❌ Connexion IA échouée");
      }

      return isConnected;
    } catch (err: any) {
      console.error("❌ Erreur test de connexion:", err);
      return false;
    }
  }, []);

  // État dérivé : service en bonne santé
  const isServiceHealthy = healthStatus?.status === "healthy";

  // Effet : Analyse automatique si clientId fourni et autoAnalyze activé
  useEffect(() => {
    if (clientId && autoAnalyze && !analysis && !isAnalyzing) {
      console.log(`🔄 Analyse automatique activée pour le client: ${clientId}`);
      runAnalysis(clientId);
    }
  }, [clientId, autoAnalyze, analysis, isAnalyzing, runAnalysis]);

  // Effet : Vérification périodique de la santé si interval défini
  useEffect(() => {
    if (healthCheckInterval > 0) {
      // Vérification initiale
      checkHealth();

      // Vérification périodique
      const interval = setInterval(() => {
        checkHealth();
      }, healthCheckInterval);

      return () => clearInterval(interval);
    }
  }, [healthCheckInterval, checkHealth]);

  // Effet : Log des changements d'état pour debug
  useEffect(() => {
    if (analysis) {
      console.log("📊 Nouvelle analyse disponible:", {
        score: analysis.score,
        priority: analysis.priority,
        nextAction: analysis.nextAction,
      });
    }
  }, [analysis]);

  useEffect(() => {
    if (error) {
      console.error("🚨 Erreur dans useAI:", error);
    }
  }, [error]);

  return {
    // États principaux
    analysis,
    healthStatus,
    isAnalyzing,
    isCheckingHealth,
    error,

    // Actions
    runAnalysis,
    runBatchAnalysis,
    checkHealth,
    testConnection,
    clearError,
    clearAnalysis,

    // États dérivés
    isServiceHealthy,
    lastAnalysisDate,

    // Cache
    analysisCache,
    getCachedAnalysis,
    clearCache,
  };
};

// Hook spécialisé pour un client unique
export const useClientAI = (clientId: string, autoAnalyze: boolean = true) => {
  return useAI({ clientId, autoAnalyze });
};

// Hook spécialisé pour surveillance de la santé
export const useAIHealth = (checkInterval: number = 60000) => {
  const { healthStatus, isCheckingHealth, checkHealth, isServiceHealthy } =
    useAI({
      healthCheckInterval: checkInterval,
    });

  return {
    healthStatus,
    isCheckingHealth,
    checkHealth,
    isServiceHealthy,
  };
};
