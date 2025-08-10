import { useEffect, useState } from "react";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

type OnlineUser = {
  name: string;
  avatar: string;
};

export default function Buddy() {
  const [user, setUser] = useState<OnlineUser>({
    name: "User" + Math.floor(Math.random() * 1000),
    avatar: "/assets/icons/user.png",
  });

  const onlineUsers = useOnlineUsers(user);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">People Online (Same Network)</h1>
      <ul className="bg-white shadow rounded-lg p-4 space-y-2">
        {onlineUsers.map((u, index) => (
          <li key={index} className="flex items-center gap-3 p-2 border-b last:border-b-0">
            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
            <span>{u.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
