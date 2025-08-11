import { useEffect, useState } from "react";
import { useAuthStore } from "../state/authStore";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

export default function Buddy() {
  const user = useAuthStore((state) => state.user);
  const onlineUsers = useOnlineUsers(user); // this will already include you

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <p className="text-red-500">Please log in to see online users.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        People Online (Same Network)
      </h1>
      <ul className="bg-white shadow rounded-lg p-4 space-y-2">
        {onlineUsers.map((u) => (
          <li
            key={u.name}
            className="flex items-center gap-3 p-2 border-b last:border-b-0"
          >
            <img
              src={u.avatar || "/assets/icons/user.png"}
              alt={u.name}
              className="w-8 h-8 rounded-full"
            />
            <span
              className={
                u.name === user.name ? "font-bold text-indigo-600" : ""
              }
            >
              {u.name}
              {u.name === user.name && " (You)"}
            </span>
            {u.isInFlow !== undefined && (
              <div className="text-sm text-gray-500 ml-2">
                {u.isInFlow ? "🧠 Flow" : "😴 Not in Flow"} | 👀 {u.eyesOnScreen ? "Looking" : "Away"} | ⌨️ {u.keystrokeCount} | 🖱️ {u.mouseDistance}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
