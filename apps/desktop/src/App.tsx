import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './styles/tailwind.css';
import './styles/globals.css';
import Home from './pages/Home';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-sky-gradient">
        {/* Navigation Bar */}
        <nav className="bg-white text-white p-4 flex justify-evenly">
          {[
            { to: '/', label: 'Home' },
            { to: '/insights', label: 'Insights' },
            { to: '/settings', label: 'Settings' },
            { to: '/onboarding', label: 'Onboarding' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `transition-colors duration-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                  isActive
                    ? 'bg-white text-blue-600 font-semibold shadow'
                    : 'text-gray-950 hover:bg-blue-600 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Page Content */}
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboarding/signup" element={<SignUp />} />
            <Route path="/onboarding/login" element={<Login />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-blue-600 text-white p-4 text-center text-sm">
          © {new Date().getFullYear()} Estudius. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;