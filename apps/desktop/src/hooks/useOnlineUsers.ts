import { useEffect, useState } from "react";

export function useOnlineUsers(username: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001"); // optionally use websocket wrapper if you implement it

    socket.onopen = () => {
      socket.send(username);
    };

    socket.onmessage = (event) => {
      const data = event.data;
      if (data.startsWith("ONLINE_USERS:")) {
        const users = data.replace("ONLINE_USERS:", "").split(",");
        setOnlineUsers(users);
      }
    };

    return () => {
      socket.close();
    };
  }, [username]);

  return onlineUsers;
}
