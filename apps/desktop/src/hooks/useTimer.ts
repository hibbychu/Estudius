// apps/desktop/src/hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';
import { useFlowDetection } from './useFlowDetection';
import { logFlowDelay } from '../utils/apiClient'; // Optional, if you want to log it

export function useTimer(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isInFlow } = useFlowDetection();
  const hasFlowDelayApplied = useRef(false); // Prevent multiple delays

  useEffect(() => {
    if (!running) return;

    setLoading(false); // Assume loading done

    if (secondsLeft === 0) {
      setRunning(false);
      return;
    }

    if (secondsLeft <= 10 && isInFlow && !hasFlowDelayApplied.current) {
      setSecondsLeft((prev) => prev + 300); // Extend by 5 mins
      hasFlowDelayApplied.current = true;
      logFlowDelay?.(); // Optional: backend logging
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, secondsLeft, isInFlow]);

  const start = () => {
    setLoading(true);
    try {
      setRunning(true);
      setError(null);
      hasFlowDelayApplied.current = false; // Reset delay flag on start
    } catch (e) {
      setError("Failed to start timer");
    } finally {
      setLoading(false);
    }
  };

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(initialSeconds);
    hasFlowDelayApplied.current = false;
  };

  return { secondsLeft, running, start, pause, reset, loading, error };
}
