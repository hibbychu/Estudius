import { useEffect, useState } from 'react';
import { useFlowDetection } from './useFlowDetection';
import { useEyeDetectorStatus } from './useEyeDetectorStatus';
import { useActivityStatus } from './useActivityStatus';

type FlowSnapshot = {
  timestamp: number;
  isInFlow: boolean;
  eyesOnScreen: boolean;
  keystrokeCount: number;
  mouseDistance: number;
};

export function useFlowHistory(intervalMs = 10000) {
  const [history, setHistory] = useState<FlowSnapshot[]>([]);

  const { isInFlow } = useFlowDetection();
  const eyesOnScreen = useEyeDetectorStatus();
  const activityData = useActivityStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!activityData) return;

      const snapshot: FlowSnapshot = {
        timestamp: Date.now(),
        isInFlow,
        eyesOnScreen,
        keystrokeCount: activityData.keystroke_count ?? 0,
        mouseDistance: activityData.mouse_distance ?? 0,
      };

      setHistory((prev) => [...prev.slice(-99), snapshot]); // Keep last 100
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isInFlow, eyesOnScreen, activityData, intervalMs]);

  return history;
}
