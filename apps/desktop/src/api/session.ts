// src/api/session.ts
import api from "./axios";
export async function startSession(taskId: string) {
  const res = await api.post("/session/start", { task_id: taskId });
  return res.data;
}
