"use client";
import { useState, useEffect, useCallback } from "react";
import metricsService, {
  MetricsResponse,
  DistributionResponse,
  EndpointPerformanceResponse,
  PerformanceMetrics,
} from "../services/metrics.service";

export type MetricsPeriod = "realtime" | "lastHour" | "last24Hours";

interface UseMetricsState {
  loading: boolean;
  error: string | null;
  data: PerformanceMetrics | null;
  timestamp: string | null;
  period: string | null;
}

interface UseDistributionState {
  loading: boolean;
  error: string | null;
  distribution: Record<string, number> | null;
  timestamp: string | null;
  period: string | null;
}

interface UseEndpointPerformanceState {
  loading: boolean;
  error: string | null;
  performance: Record<
    string,
    {
      count: number;
      averageDuration: number;
      successRate: number;
      totalDuration: number;
    }
  > | null;
  timestamp: string | null;
  period: string | null;
}

export const useMetrics = (period: MetricsPeriod = "last24Hours") => {
  const [state, setState] = useState<UseMetricsState>({
    loading: false,
    error: null,
    data: null,
    timestamp: null,
    period: null,
  });

  const fetchMetrics = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let response: MetricsResponse;

      switch (period) {
        case "realtime":
          response = await metricsService.getRealTimeMetrics();
          break;
        case "lastHour":
          response = await metricsService.getLastHourMetrics();
          break;
        case "last24Hours":
        default:
          response = await metricsService.getLast24HoursMetrics();
          break;
      }

      setState({
        loading: false,
        error: null,
        data: response.data,
        timestamp: response.data.timestamp,
        period: response.data.period,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: null,
        timestamp: null,
        period: null,
      });
    }
  }, [period]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const refetch = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    ...state,
    refetch,
  };
};

export const useCustomPeriodMetrics = () => {
  const [state, setState] = useState<UseMetricsState>({
    loading: false,
    error: null,
    data: null,
    timestamp: null,
    period: null,
  });

  const fetchCustomMetrics = useCallback(async (start: Date, end: Date) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await metricsService.getCustomPeriodMetrics(start, end);

      setState({
        loading: false,
        error: null,
        data: response.data,
        timestamp: response.data.timestamp,
        period: response.data.period,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: null,
        timestamp: null,
        period: null,
      });
    }
  }, []);

  return {
    ...state,
    fetchCustomMetrics,
  };
};

export const useRequestDistribution = (
  period: MetricsPeriod = "last24Hours"
) => {
  const [state, setState] = useState<UseDistributionState>({
    loading: false,
    error: null,
    distribution: null,
    timestamp: null,
    period: null,
  });

  const fetchDistribution = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await metricsService.getRequestDistribution(period);

      setState({
        loading: false,
        error: null,
        distribution: response.data.distribution,
        timestamp: response.data.timestamp,
        period: response.data.period,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        distribution: null,
        timestamp: null,
        period: null,
      });
    }
  }, [period]);

  useEffect(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  const refetch = useCallback(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  return {
    ...state,
    refetch,
  };
};

export const useStatusDistribution = (
  period: MetricsPeriod = "last24Hours"
) => {
  const [state, setState] = useState<UseDistributionState>({
    loading: false,
    error: null,
    distribution: null,
    timestamp: null,
    period: null,
  });

  const fetchDistribution = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await metricsService.getStatusDistribution(period);

      setState({
        loading: false,
        error: null,
        distribution: response.data.distribution,
        timestamp: response.data.timestamp,
        period: response.data.period,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        distribution: null,
        timestamp: null,
        period: null,
      });
    }
  }, [period]);

  useEffect(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  const refetch = useCallback(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  return {
    ...state,
    refetch,
  };
};

export const useEndpointPerformance = (
  period: MetricsPeriod = "last24Hours"
) => {
  const [state, setState] = useState<UseEndpointPerformanceState>({
    loading: false,
    error: null,
    performance: null,
    timestamp: null,
    period: null,
  });

  const fetchPerformance = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await metricsService.getEndpointPerformance(period);

      setState({
        loading: false,
        error: null,
        performance: response.data.performance,
        timestamp: response.data.timestamp,
        period: response.data.period,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        performance: null,
        timestamp: null,
        period: null,
      });
    }
  }, [period]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  const refetch = useCallback(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return {
    ...state,
    refetch,
  };
};

// Hook pour les métriques en temps réel avec auto-refresh
export const useRealTimeMetrics = (refreshInterval: number = 5000) => {
  const [state, setState] = useState<UseMetricsState>({
    loading: false,
    error: null,
    data: null,
    timestamp: null,
    period: null,
  });

  const fetchRealTimeMetrics = useCallback(async () => {
    try {
      const response = await metricsService.getRealTimeMetrics();

      setState({
        loading: false,
        error: null,
        data: response.data,
        timestamp: response.data.timestamp,
        period: response.data.period,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      }));
    }
  }, []);

  useEffect(() => {
    fetchRealTimeMetrics();

    const interval = setInterval(fetchRealTimeMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchRealTimeMetrics, refreshInterval]);

  return state;
};
