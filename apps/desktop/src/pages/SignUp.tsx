import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';
import { Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      // 1. Register user
      let resp = await fetch('http://127.0.0.1:8005/signup', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) throw new Error((await resp.json()).detail || "Failed sign up");

      // 2. Login right after signup for token
      resp = await fetch('http://127.0.0.1:8005/login', {
        method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) throw new Error((await resp.json()).detail || "Failed to log in");

      const { access_token } = await resp.json();
      saveToken(access_token);
      console.log("done and navigating out of sign up");
      navigate('/'); // or wherever you want
    } catch (error: any) {
      setErr(error.message || "Failed");
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Create Your Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <div className="text-red-600">{err}</div>}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition duration-200">
          Continue
        </button>
      </form>
      <p className="mt-4 text-center text-gray-500 text-sm">
        Already have an account? <Link to="/Login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </main>
  );
}
