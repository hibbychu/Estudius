import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('Initial saved theme:', savedTheme);
    return savedTheme === 'dark';
  });
  const [language, setLanguage] = useState('en');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Handle Dark Mode
  // useEffect(() => {
  //   const root = window.document.documentElement;
  //   if (darkMode) {
  //     root.classList.add('dark');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     root.classList.remove('dark');
  //     localStorage.setItem('theme', 'light');
  //   }
  // }, [darkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      console.log('Enabling dark mode');
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      console.log('Disabling dark mode');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    console.log('Current class list on html:', root.classList.toString());
    console.log('Current localStorage theme:', localStorage.getItem('theme'));
  }, [darkMode]);

  // Load stored theme
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setDarkMode(true);
  }, []);

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Settings</h1>

      {/* Preferences Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Enable Dark Mode</span>
        </label>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="zh">Chinese</option>
            <option value="fr">French</option>
          </select>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Enable All Notifications</span>
        </label>
        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Email Notifications</span>
        </label>
        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Push Notifications</span>
        </label>
      </section>

      {/* Support Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4 space-x-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Support</h2>
        <button className="text-blue-600 hover:underline">Help Center</button>
        <button className="text-blue-600 hover:underline">Contact Support</button>
        <p className="text-gray-500 dark:text-gray-400 text-sm">App Version: 1.0.0</p>
        <div className="flex space-x-4">
          <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </div>
      </section>
    </main>
  );
}

