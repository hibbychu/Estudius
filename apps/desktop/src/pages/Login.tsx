import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear previous error

    try {
      const res = await fetch("http://localhost:8005/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Server sent invalid response.");
        return;
      }

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      if (!data.access_token) {
        setError("No token received.");
        return;
      }

      const user = data.user || { name: email, avatar: "/assets/icons/user.png" };
      localStorage.setItem("token", data.access_token);
      login(user, data.access_token);
      navigate("/");
    } catch (error) {
      setError("Network error");
    }
  };

  return (
    <main className="p-8 w-[448px] mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition duration-200"
        >
          Continue
        </button>
      </form>

      {/* 🧩 Error message here */}
      {error && (
        <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
      )}

      <p className="mt-4 text-center text-gray-500 text-sm">
        Don't have an account?{" "}
        <Link to="/SignUp" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </main>
  );
}
