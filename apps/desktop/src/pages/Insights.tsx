import React from 'react';

export default function Insights() {
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Insights</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Focus Time</h2>
          <p className="text-gray-600">3 hours 24 minutes this week</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Sessions Completed</h2>
          <p className="text-gray-600">12 productive sessions</p>
        </div>
      </div>
    </main>
  );
}
