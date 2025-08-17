const API_URL =
  process.env.NEXT_PUBLIC_API_URL_METRICS || "http://localhost:3004/api/";

export interface RequestMetrics {
  timestamp: Date;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  responseSize: number;
  userAgent?: string;
  ip?: string;
}

export interface MongoMetrics {
  timestamp: Date;
  operation: string;
  collection: string;
  duration: number;
  success: boolean;
  error?: string;
}

export interface BandwidthMetrics {
  timestamp: Date;
  bytesIn: number;
  bytesOut: number;
  requestsPerSecond: number;
}

export interface PerformanceMetrics {
  requests: RequestMetrics[];
  mongo: MongoMetrics[];
  bandwidth: BandwidthMetrics[];
  summary: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    totalMongoOperations: number;
    successfulMongoOperations: number;
    failedMongoOperations: number;
    averageMongoTime: number;
    totalBandwidthIn: number;
    totalBandwidthOut: number;
    averageRequestsPerSecond: number;
  };
}

export interface MetricsResponse {
  success: boolean;
  data: PerformanceMetrics & {
    timestamp: string;
    period: string;
    timeRange?: {
      start: string;
      end: string;
    };
  };
}

export interface DistributionResponse {
  success: boolean;
  data: {
    distribution: Record<string, number>;
    timestamp: string;
    period: string;
    timeRange: {
      start: string;
      end: string;
    };
  };
}

export interface EndpointPerformanceResponse {
  success: boolean;
  data: {
    performance: Record<
      string,
      {
        count: number;
        averageDuration: number;
        successRate: number;
        totalDuration: number;
      }
    >;
    timestamp: string;
    period: string;
    timeRange: {
      start: string;
      end: string;
    };
  };
}

class MetricsService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Récupère les métriques en temps réel
   */
  async getRealTimeMetrics(): Promise<MetricsResponse> {
    try {
      const response = await fetch(`${API_URL}metrics/realtime`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des métriques temps réel:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère les métriques de la dernière heure
   */
  async getLastHourMetrics(): Promise<MetricsResponse> {
    try {
      const response = await fetch(`${API_URL}metrics/last-hour`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des métriques de la dernière heure:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère les métriques des dernières 24 heures
   */
  async getLast24HoursMetrics(): Promise<MetricsResponse> {
    try {
      const response = await fetch(`${API_URL}metrics/last-24-hours`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des métriques des dernières 24h:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère les métriques pour une période personnalisée
   */
  async getCustomPeriodMetrics(
    start: Date,
    end: Date
  ): Promise<MetricsResponse> {
    try {
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
      });

      const response = await fetch(`${API_URL}metrics/custom?${params}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des métriques personnalisées:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère la distribution des requêtes par endpoint
   */
  async getRequestDistribution(
    period: "realtime" | "lastHour" | "last24Hours" = "last24Hours"
  ): Promise<DistributionResponse> {
    try {
      const params = new URLSearchParams({ period });
      const response = await fetch(
        `${API_URL}metrics/distribution/requests?${params}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la distribution des requêtes:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère la distribution des codes de statut
   */
  async getStatusDistribution(
    period: "realtime" | "lastHour" | "last24Hours" = "last24Hours"
  ): Promise<DistributionResponse> {
    try {
      const params = new URLSearchParams({ period });
      const response = await fetch(
        `${API_URL}metrics/distribution/status?${params}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la distribution des statuts:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère les performances par endpoint
   */
  async getEndpointPerformance(
    period: "realtime" | "lastHour" | "last24Hours" = "last24Hours"
  ): Promise<EndpointPerformanceResponse> {
    try {
      const params = new URLSearchParams({ period });
      const response = await fetch(
        `${API_URL}metrics/performance/endpoints?${params}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des performances par endpoint:",
        error
      );
      throw error;
    }
  }

  /**
   * Formate les bytes en unités lisibles
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Formate la durée en millisecondes
   */
  formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms.toFixed(2)}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)}s`;
    } else {
      return `${(ms / 60000).toFixed(2)}min`;
    }
  }

  /**
   * Formate le pourcentage
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  /**
   * Formate le nombre de requêtes par seconde
   */
  formatRequestsPerSecond(rps: number): string {
    return `${rps.toFixed(2)} req/s`;
  }
}

export default new MetricsService();
