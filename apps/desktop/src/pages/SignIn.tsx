import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      const resp = await fetch('http://localhost:8005/login', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });
      if (!resp.ok) throw new Error((await resp.json()).detail || "Failed to log in");
      const { access_token } = await resp.json();
      saveToken(access_token);
      navigate('/');
    } catch (error: any) {
      setErr(error.message || "Failed");
    }
  };
  // ...render like SignUp form
}



// // Whenever you want to call protected endpoints:

// import { getToken } from '../utils/auth';

// async function fetchProtectedData() {
//   const token = getToken();
//   const resp = await fetch('http://localhost:8005/protected', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   // ...handle response
// }