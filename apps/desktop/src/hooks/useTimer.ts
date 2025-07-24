import { useState, useEffect } from 'react';

export function useTimer(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);  // NEW: loading state
  const [error, setError] = useState<string | null>(null);  // NEW: error state

  useEffect(() => {
    if (!running) return;

    setLoading(false);   // Assume loading done when running

    if (secondsLeft === 0) {
      setRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, secondsLeft]);

  // Methods to control the timer
  const start = () => {
    setLoading(true);  // Optionally set loading true when starting
    try {
      setRunning(true);
      setError(null);
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
  };

  return { secondsLeft, running, start, pause, reset, loading, error };
}
