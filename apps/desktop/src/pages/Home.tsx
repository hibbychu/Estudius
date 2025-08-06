import React from 'react';
import FeatureCard from '../components/FeatureCard';
import Timer from "../components/Timer";
import TaskList from '../components/TaskList';
import { useState } from 'react';

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
    <section className="max-w-4xl mx-auto bg-sky-gradient">
      {/* Hero Section */}
      <Timer initialSeconds={1500} /> {/* 25-minute Pomodoro */}

      <TaskList/>
      {/* Core Features */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-800 text-center dark:text-white">
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
      <h2 className="text-xl font-semibold my-8 text-center text-gray-700 dark:text-white">
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
      <h2 className="text-2xl font-bold mt-12 mb-5 text-center text-gray-800 dark:text-white">
        How It Works
      </h2>
      <ol className="list-decimal pl-6 max-w-xl mx-auto text-gray-700 space-y-3 text-lg dark:text-white">
        <li>Onboard, set your focus style and current mood</li>
        <li>Select your ideal session mode (Sprint, Deep Work, etc.)</li>
        <li>Let AI adapt breaks, shield distractions, and guide your study</li>
        <li>Review insights—celebrate streaks, improve every week</li>
      </ol>
    </section >
  );
}
