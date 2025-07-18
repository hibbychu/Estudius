import React from 'react';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const features = [
    {
      icon: "⏰",
      title: "AI-Adaptive Scheduler",
      description: "Learns your focus stamina and optimizes session dynamics.",
    },
    {
      icon: "👁️",
      title: "Flow State Detection",
      description: "Delays breaks when you’re in deep focus—never lose your flow.",
    },
    {
      icon: "📊",
      title: "Focus Analytics",
      description: "Track your productivity, trends, and best times to work.",
    },
    {
      icon: "😊",
      title: "Mood & Energy Check-ins",
      description: "Log how you feel—get smarter, more personalized session tips.",
    },
    {
      icon: "🎯",
      title: "Task Switch Guidance",
      description: "Intelligently suggests what to study next, minimizing context switching.",
    },
    {
      icon: "🛡️",
      title: "Distraction Shield",
      description: "Blocks distractions and provides motivational nudges to keep you focused.",
    },
    {
      icon: "🥇",
      title: "Gamification & Streaks",
      description: "Earn badges and keep streaks for progress—stay motivated every day.",
    },
    {
      icon: "💡",
      title: "Guided Breaks",
      description: "Rest the right way with suggested activities and check-ins.",
    },
  ];

  return (
    <section className="p-8 max-w-4xl mx-auto bg-sky-gradient">
      {/* Hero Section */}
      <div className="bg-blue-100 rounded-xl mb-10 p-8 flex flex-col items-center">
        {/* <img src="/assets/icons/brainwave.png" alt="AI Focus" className="w-20 h-20 mb-4" /> */}
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2 text-center">
          Meet <span className="text-blue-900">Estudius</span>
        </h1>
        <p className="text-lg text-blue-900 max-w-2xl text-center">
          Your AI-powered assistant for smarter, deeper, personalized focus sessions.
        </p>
        <a href="/onboarding">
          <button className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-md font-semibold shadow-lg hover:bg-blue-800 transition">
            Get Started
          </button>
        </a>
      </div>

      {/* Core Features */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-800 text-center">
        Core Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feat) => (
          <FeatureCard
            key={feat.title}
            icon={feat.icon}
            title={feat.title}
            description={feat.description}
          />
        ))}
      </div>

      {/* Why Estudius? Comparison Table */}
      <h2 className="text-xl font-semibold my-8 text-center text-gray-700">
        Why Switch from Traditional Pomodoro?
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto mx-auto border-collapse w-full md:w-3/4 bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-200 text-blue-800">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2 font-semibold">Estudius</th>
              <th className="px-4 py-2 font-semibold">Traditional Pomodoro</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr>
              <td className="px-4 py-2 font-medium">Session Flexibility</td>
              <td className="px-4 py-2">Dynamic, personalized sessions</td>
              <td className="px-4 py-2">Fixed-length sessions</td>
            </tr>
            <tr className="bg-blue-50">
              <td className="px-4 py-2 font-medium">Flow Protection</td>
              <td className="px-4 py-2">Flow-aware break timing</td>
              <td className="px-4 py-2">Breaks on strict timers</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Analytics</td>
              <td className="px-4 py-2">AI productivity insights</td>
              <td className="px-4 py-2">Minimal or none</td>
            </tr>
            <tr className="bg-blue-50">
              <td className="px-4 py-2 font-medium">Motivation</td>
              <td className="px-4 py-2">Gamification, streaks, peer options</td>
              <td className="px-4 py-2">Usually not included</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Wellness</td>
              <td className="px-4 py-2">Mood/energy checks, restorative breaks</td>
              <td className="px-4 py-2">Standard, unpersonalized breaks</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* How It Works Steps */}
      <h2 className="text-2xl font-bold mt-12 mb-5 text-center text-gray-800">
        How It Works
      </h2>
      <ol className="list-decimal pl-6 max-w-xl mx-auto text-gray-700 space-y-3 text-lg">
        <li>Onboard, set your focus style and current mood</li>
        <li>Select your ideal session mode (Sprint, Deep Work, etc.)</li>
        <li>Let AI adapt breaks, shield distractions, and guide your study</li>
        <li>Review insights—celebrate streaks, improve every week</li>
      </ol>

      {/* Call to Action Button */}
      <div className="flex justify-center mt-10">
        <a href="/onboarding">
          <button className="w-full md:w-auto px-8 py-3 bg-green-600 text-white text-lg rounded-lg shadow hover:bg-green-700 transition">
            Start My First Session
          </button>
        </a>
      </div>

      {/* Optional: Motivational Quote */}
      <blockquote className="mt-12 italic text-blue-700 text-center text-lg max-w-lg mx-auto">
        “Success is not the result of spontaneous combustion. You must set yourself on fire.” – Arnold H. Glasow
      </blockquote>
    </section>
  );
}
