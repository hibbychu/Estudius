import React, { useState, useEffect } from 'react';

interface TrendData {
  date: string;
  focusMinutes: number;
  sessions: number;
}

interface InsightsData {
  range: string;
  totalFocusTimeMin: number;
  totalSessions: number;
  bestHour: string | null;
  trend: TrendData[];
}

export default function Insights() {
  const [selectedRange, setSelectedRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [insights, setInsights] = useState<InsightsData | null>(null);

  // const getDateRange = (range: 'day' | 'week' | 'month' | 'year') => {
  //   const now = new Date();
  //   let start: Date;

  //   switch (range) {
  //     case 'day':
  //       start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //       break;
  //     case 'week': {
  //       const firstDayOfWeek = now.getDate() - now.getDay(); // Sunday as first day
  //       start = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
  //       break;
  //     }
  //     case 'month':
  //       start = new Date(now.getFullYear(), now.getMonth(), 1);
  //       break;
  //     case 'year':
  //       start = new Date(now.getFullYear(), 0, 1);
  //       break;
  //   }
  //   return { start, end: now };
  // };

  // const { start, end } = getDateRange(selectedRange);

  useEffect(() => {
    fetch("http://localhost:8001/insights/summary") //
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("📥 Raw data from API:", data);
        setInsights(data);
      })
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  if (!insights) return <p>Loading insights...</p>;

  console.log("data:", insights)

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Insights</h1>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-8">
        {['day', 'week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range as any)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Focus Time */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Total Focus Time</h2>
          <p className="text-3xl font-bold text-blue-600">
            {Math.floor(insights.totalFocusTimeMin / 60)} hrs {insights.totalFocusTimeMin % 60} mins
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This {insights.range}</p>
        </div>

        {/* Pomodoro Streak */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Streak</h2>
          <p className="text-3xl font-bold text-green-500">28</p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">
            {start.toLocaleDateString()} – {end.toLocaleDateString()}
          </p> */}
        </div>

        {/* Tasks Completed */}
        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Tasks Completed</h2>
          <p className="text-3xl font-bold text-blue-600">28</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {start.toLocaleDateString()} – {end.toLocaleDateString()}
          </p>
        </div> */}
      </div>

      {/* Focus Analytics Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Focus Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track your productivity, trends, and discover your optimal work times.
        </p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          {/* Placeholder for chart */}
          [Productivity Trends Chart Placeholder]
        </div>
      </section>

      {/* AI-Adaptive Scheduler */}
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">AI-Adaptive Scheduler</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learns your focus stamina and optimizes session lengths, break times, and intensity based on your past performance.
          </p>
        </div>

        {/* Mood & Energy Check-ins */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Mood & Energy Check-ins</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Log how you feel daily and receive smarter, more personalized tips for your sessions.
          </p>
        </div>
      </section>
    </main>
  );
}

