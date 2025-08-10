import { useEffect, useState } from "react";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

export default function Buddy() {
  const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000));
  const onlineUsers = useOnlineUsers(username);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">People Online (Same Network)</h1>
      <ul className="bg-white shadow rounded-lg p-4 space-y-2">
        {onlineUsers.map((user, index) => (
          <li key={index} className="p-2 border-b last:border-b-0">{user}</li>
        ))}
      </ul>
    </div>
  );
}
