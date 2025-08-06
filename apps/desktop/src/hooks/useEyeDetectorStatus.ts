// apps/desktop/src/hooks/useEyeDetectorStatus.ts
import { useEffect, useState } from "react";

export function useEyeDetectorStatus(pollMs = 1000) {
  const [eyesOnScreen, setEyesOnScreen] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    async function poll() {
      console.log("Polling /eyes...polling...")
      try {
        const resp = await fetch('http://localhost:8001/eyes');
        const json = await resp.json();
        console.log("Eye status JSON:", json);  // <--- add this line
        if (alive) setEyesOnScreen(!!json.eyes_on_screen);
      } catch {
        // Service down? Mark as "no detection"
        if (alive) setEyesOnScreen(false);
      }
    }
    const interval = setInterval(poll, pollMs);
    poll(); // initial
    return () => {
      alive = false;
      clearInterval(interval);
    }
  }, [pollMs]);

  return eyesOnScreen;
}
