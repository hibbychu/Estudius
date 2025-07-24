import React from 'react';
import FeatureCard from '../components/FeatureCard';
import Timer from "../components/Timer";
import { useState } from 'react';

export default function Home() {

  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<{ text: string; completed: boolean }[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && task.trim()) {
      e.preventDefault();
      setTaskList([...taskList, { text: task.trim(), completed: false }]);
      setTask('');
    }
  };

  const deleteTask = (index: number) => {
    const updatedTasks = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTasks);
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = [...taskList];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTaskList(updatedTasks);
  };

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
      <div className="flex flex-col max-w-md mx-auto my-2 bg-white rounded-xl shadow p-8 space-y-6">
        <div>
          <label htmlFor="task" className="block text-md font-semibold text-gray-950">Tasks</label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
              <input
                id="task"
                type="text"
                name="task"
                placeholder="Enter your task..."
                className="block w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        {/* Display the task list as checkboxes */}
        {taskList.length > 0 && (
          <ul className="space-y-2">
            {taskList.map((task, idx) => (
              <li key={idx} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`task-${idx}`}
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(idx)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`task-${idx}`}
                    className={`text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}
                  >
                    {task.text}
                  </label>
                </div>

                <button
                  onClick={() => deleteTask(idx)}
                  className="text-sm text-red-500 hover:text-red-700 bg-white"
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
