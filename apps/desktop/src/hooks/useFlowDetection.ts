// apps/desktop/src/hooks/useFlowDetection.ts
import { useActivityStatus } from './useActivityStatus';
import { useEyeDetectorStatus } from './useEyeDetectorStatus';
import { useMemo, useRef } from 'react';

export function useFlowDetection() {
  const rawData = useActivityStatus();
  const eyesOnScreen = useEyeDetectorStatus();

  const prevKeystrokeCount = useRef<number>(0);
  const prevMouseDistance = useRef<number>(0);

  const isTyping = useMemo(() => {
    if (!rawData) return false;
    const delta = rawData.keystroke_count - prevKeystrokeCount.current;
    prevKeystrokeCount.current = rawData.keystroke_count;
    return delta > 5; // Threshold for typing activity
  }, [rawData?.keystroke_count]);

  const mouseActive = useMemo(() => {
    if (!rawData) return false;
    const delta = rawData.mouse_distance - prevMouseDistance.current;
    prevMouseDistance.current = rawData.mouse_distance;
    return delta > 50; // Threshold for mouse movement
  }, [rawData?.mouse_distance]);

  const isInFlow = useMemo(() => {
    return (isTyping || mouseActive) && eyesOnScreen;
  }, [isTyping, mouseActive, eyesOnScreen]);

  return { isInFlow };
}
