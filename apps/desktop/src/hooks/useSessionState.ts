import { useState } from "react";
import * as sessionApi from "../api/session";

export function useSessionState() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startSession(taskId: string) {
    setLoading(true); setError(null);
    try {
      const data = await sessionApi.startSession(taskId);
      setSession(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { session, loading, error, startSession };
}
