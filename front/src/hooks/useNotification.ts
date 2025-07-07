// hooks/useNotification.ts
import { useState, useCallback } from "react";

export const useNotification = (successTimeout = 3000) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    setSuccess(null);
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      setSuccess(message);
      setError(null);
      if (successTimeout > 0) {
        setTimeout(() => setSuccess(null), successTimeout);
      }
    },
    [successTimeout]
  );

  const clearNotifications = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    error,
    success,
    showError,
    showSuccess,
    clearNotifications,
  };
};
