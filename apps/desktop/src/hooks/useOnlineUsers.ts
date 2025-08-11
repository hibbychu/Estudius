import { useEffect, useState } from "react";
import { useFlowHistory } from "./useFlowHistory"; // Import this

type OnlineUser = {
  name: string;
  avatar: string;
  isInFlow?: boolean;
  eyesOnScreen?: boolean;
  keystrokeCount?: number;
  mouseDistance?: number;
};

export const useOnlineUsers = (user: OnlineUser | null) => {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const flowHistory = useFlowHistory(10000); // every 10s
  const latestSnapshot = flowHistory[flowHistory.length - 1];

  useEffect(() => {
    if (!user) return;

    const backendIP = import.meta.env.VITE_BACKEND_IP;
    if (!backendIP) {
      console.error("Backend IP is not defined in .env");
    }
    const ws = new WebSocket(`ws://${backendIP}:8002/ws`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "init", name: user.name, avatar: user.avatar }));
    };

    ws.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith("ONLINE_USERS:")) {
        const usersJSON = message.replace("ONLINE_USERS:", "");
        const usersArray = JSON.parse(usersJSON);
        setUsers(usersArray);
      }
    };

    const sendFlowData = () => {
      if (latestSnapshot) {
        ws.send(
          JSON.stringify({
            type: "update",
            flowData: latestSnapshot,
          })
        );
      }
    };

    const interval = setInterval(sendFlowData, 10000);

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = (e) => console.log("WebSocket closed", e);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, [user, latestSnapshot]);

  return users;
};
