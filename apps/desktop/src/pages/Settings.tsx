import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDarkMode(true);
    }
  }, []);

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 font-medium">Enable Notifications</span>
        </label>

        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 font-medium">Enable Dark Mode</span>
        </label>
      </div>
    </main>
  );
}
