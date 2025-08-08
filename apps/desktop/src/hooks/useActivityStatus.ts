// apps/desktop/src/hooks/useActivityStatus.ts
import { useEffect, useState } from "react";

export function useActivityStatus(pollMs = 10000) {
  const [activityData, setActivityData] = useState<{
    last_mouse_distance: number;
    last_keystroke_count: number;
    keystroke_count: number;
    mouse_distance: number;
    last_log: string;
  } | null>(null);

  useEffect(() => {
    let alive = true;

    async function poll() {
      try {
        const resp = await fetch("http://localhost:8003/activity_monitor/status");
        const json = await resp.json();
        if (alive) setActivityData(json);
      } catch {
        if (alive) setActivityData(null);
      }
    }

    poll();
    const interval = setInterval(poll, pollMs);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [pollMs]);

  return activityData;
}
