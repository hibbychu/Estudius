import { useEffect, useState } from "react";

type OnlineUser = { name: string; avatar: string };

export const useOnlineUsers = (user: OnlineUser | null) => {
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = 8002; // Your FastAPI backend port

    const ws = new WebSocket(`${protocol}://${host}:${port}/ws`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ name: user.name, avatar: user.avatar }));
    };

    ws.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith("ONLINE_USERS:")) {
        const usersJSON = message.replace("ONLINE_USERS:", "");
        const usersArray = JSON.parse(usersJSON);
        setUsers(usersArray);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = (e) => console.log("WebSocket closed", e);

    return () => {
      ws.close();
    };
  }, [user]);

  return users;
};
