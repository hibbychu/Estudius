import React from 'react';

export default function Onboarding() {
  return (
    <main className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-4 text-center text-gray-900">
        Get Started with Estudius
      </h1>
      <p className="mb-6 text-gray-600 text-center">
        Let’s set up your preferences and personalize your experience.
      </p>
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition">
        Start Setup
      </button>
    </main>
  );
}
