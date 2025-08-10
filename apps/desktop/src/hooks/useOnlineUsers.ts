import { useEffect, useState } from "react";

type OnlineUser = { name: string; avatar: string };

export const useOnlineUsers = (user: OnlineUser | null) => {
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket("ws://192.168.1.52:8002/ws");

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
