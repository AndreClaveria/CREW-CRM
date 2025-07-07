// services/health.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_METRICS || "http://localhost:3004/api/";

export interface ServiceStatus {
  name: string;
  status: "up" | "down";
  lastChecked: string;
  details?: any;
  responseTime?: number; // Temps de réponse en ms
}

export interface HealthResponse {
  success: boolean;
  data: {
    services: ServiceStatus[];
    timestamp: string;
  };
}

const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère l'état de tous les services
 */
export const getAllServicesStatus = async (
  forceRefresh = false
): Promise<ServiceStatus[]> => {
  try {
    const response = await fetch(`${API_URL}health/all`, {
      method: "GET",
      headers: {
        ...headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des statuts"
      );
    }

    const result = await response.json();
    return result.data.services;
  } catch (error: any) {
    console.error("getAllServicesStatus error:", error);
    throw error;
  }
};

/**
 * Récupère l'état d'un service spécifique
 */
export const getServiceStatus = async (
  serviceName: string
): Promise<ServiceStatus> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}health/service/${serviceName}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la récupération du statut du service"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error(`getServiceStatus error for service ${serviceName}:`, error);
    throw error;
  }
};

/**
 * Demande une vérification manuelle des services
 */
export const triggerManualCheck = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}health/check`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors du déclenchement de la vérification manuelle"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("triggerManualCheck error:", error);
    throw error;
  }
};

/**
 * Hook personnalisé pour utiliser les statuts des services avec des fonctionnalités améliorées
 */
export const useServicesHealth = (refreshInterval = 30000) => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Utiliser useCallback pour mémoriser la fonction entre les rendus
  const fetchServices = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      const data = await getAllServicesStatus(forceRefresh);
      setServices(data);
      setLastUpdated(new Date().toLocaleString());
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
      setRefreshCount((prev) => prev + 1);
    }
  }, []);

  // Déclencher une vérification manuelle et forcer un rafraîchissement
  const refreshServices = useCallback(async () => {
    try {
      await triggerManualCheck();
      await fetchServices(true);
    } catch (err: any) {
      setError(err.message || "Erreur lors du rafraîchissement des services");
    }
  }, [fetchServices]);

  // Effet pour gérer l'intervalle de rafraîchissement automatique
  useEffect(() => {
    // Rafraîchissement initial
    fetchServices();

    // Configurer l'intervalle de rafraîchissement
    const interval = setInterval(() => {
      fetchServices();
    }, refreshInterval);

    // Nettoyer l'intervalle à la destruction du composant
    return () => clearInterval(interval);
  }, [fetchServices, refreshInterval]);

  // Statistiques et métriques utiles
  const stats = {
    downServicesCount: services.filter((s) => s.status === "down").length,
    isAllOperational:
      services.length > 0 && services.every((s) => s.status === "up"),
    refreshCount,
    responseTime:
      services.reduce((avg, service) => avg + (service.responseTime || 0), 0) /
      (services.length || 1),
  };

  return {
    services,
    loading,
    error,
    lastUpdated,
    refreshServices,
    stats,
  };
};

// N'oubliez pas d'ajouter l'import en haut du fichier
import { useState, useEffect, useCallback } from "react";
