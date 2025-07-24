// src/api/checkin.ts
import api from "./axios";
export async function sendCheckin(data: any) {
  return (await api.post("/checkin", data)).data;
}
