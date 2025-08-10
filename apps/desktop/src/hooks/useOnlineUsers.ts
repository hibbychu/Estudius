import { useEffect, useState } from "react";

type OnlineUser = { name: string; avatar: string };

export const useOnlineUsers = (user: OnlineUser | null) => {
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8002/ws");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = (e) => console.log("WebSocket closed", e);

    ws.onmessage = (event) => {
      const received = JSON.parse(event.data);
      if (Array.isArray(received)) {
        const filtered = received.filter((u: OnlineUser) => u.name !== user?.name);
        setUsers(filtered);
      }
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return users;
};
