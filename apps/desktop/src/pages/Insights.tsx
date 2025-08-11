import React, { useState, useEffect } from "react";
import { useFlowHistory } from "../hooks/useFlowHistory";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  date: string;
  focusMinutes: number;
  sessions: number;
}

interface InsightsData {
  streak: string;
  range: string;
  totalFocusTimeMin: number;
  totalSessions: number;
  bestHour: string | null;
  trend: TrendData[];
}
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
  updatedAt: string;
}

export default function Insights() {
  const [selectedRange, setSelectedRange] = useState<
    "day" | "week" | "month" | "year"
  >("week");
  const [insights, setInsights] = useState<InsightsData | null>(null);

  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());

  // Calculate start and end dates based on selectedRange
  useEffect(() => {
    const now = new Date();
    let rangeStart = new Date();
    let rangeEnd = new Date();

    if (selectedRange === "day") {
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (selectedRange === "week") {
      const firstDay = now.getDate() - now.getDay();
      rangeStart = new Date(now.setDate(firstDay));
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 6);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (selectedRange === "month") {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
      rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      rangeEnd.setHours(23, 59, 59, 999);
    } else if (selectedRange === "year") {
      rangeStart = new Date(now.getFullYear(), 0, 1);
      rangeEnd = new Date(now.getFullYear(), 11, 31);
      rangeEnd.setHours(23, 59, 59, 999);
    }

    setStart(rangeStart);
    setEnd(rangeEnd);
  }, [selectedRange]);

  const [taskList, setTaskList] = useState<Task[]>([]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const flowHistory = useFlowHistory(10000);

  // Filter flow history by selected date range
  const filteredFlowHistory = flowHistory.filter((s) => {
    const snapDate = new Date(s.timestamp);
    return snapDate >= start && snapDate <= end;
  });

  // Flow metrics from filtered snapshots
  const totalSnapshots = filteredFlowHistory.length;
  const flowSnapshots = filteredFlowHistory.filter((s) => s.isInFlow).length;
  const flowPercentage =
    totalSnapshots > 0 ? Math.round((flowSnapshots / totalSnapshots) * 100) : 0;

  const avgKeystrokes =
    totalSnapshots > 0
      ? Math.round(
          filteredFlowHistory.reduce(
            (sum, s) => sum + (s.keystrokeCount || 0),
            0
          ) / totalSnapshots
        )
      : 0;

  const avgMouseDistance =
    totalSnapshots > 0
      ? (
          filteredFlowHistory.reduce((sum, s) => sum + s.mouseDistance, 0) /
          totalSnapshots
        ).toFixed(2)
      : 0;

  const eyesOnScreenPct =
    totalSnapshots > 0
      ? Math.round(
          (filteredFlowHistory.reduce(
            (sum, s) => sum + (s.eyesOnScreen ? 1 : 0),
            0
          ) /
            totalSnapshots) *
            100
        )
      : 0;

  useEffect(() => {
    // Fetch tasks
    fetch("http://localhost:8005/tasks")
      .then((res) => res.json())
      .then((data: Task[]) => {
        setTaskList(data);

        // Calculate completed tasks within selected range
        const completedInRange = data.filter(
          (task) =>
            task.completed &&
            task.completedAt &&
            new Date(task.completedAt) >= start &&
            new Date(task.completedAt) <= end
        ).length;

        setCompletedTasksCount(completedInRange);
      })
      .catch(console.error);
  }, [selectedRange]);

  useEffect(() => {
    fetch("http://localhost:8005/insights/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ range: selectedRange }), // sending range in request body
    })
      .then((res) => res.json())
      .then((data) => setInsights(data));
  }, [selectedRange]);

  if (!insights) return <p>Loading insights...</p>;

  console.log("data:", insights);

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Insights
      </h1>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-8">
        {["day", "week", "month", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range as any)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedRange === range
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Focus Time */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Total Focus Time
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {Math.floor(insights.totalFocusTimeMin / 60)} hrs{" "}
            {insights.totalFocusTimeMin % 60} mins
          </p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">This {insights.range}</p> */}
        </div>

        {/* Pomodoro Streak */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Streak
          </h2>
          <p className="text-3xl font-bold text-green-500">{insights.streak}</p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">
            {start.toLocaleDateString()} – {end.toLocaleDateString()}
          </p> */}
        </div>

        {/* Tasks Completed */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Tasks Completed
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {completedTasksCount}
          </p>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400">
            {start.toLocaleDateString()} – {end.toLocaleDateString()}
          </p> */}
        </div>

        {/* Flow State % */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Flow State
          </h2>
          <p className="text-3xl font-bold text-purple-500">
            {flowPercentage}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Time spent in flow
          </p>
        </div>

        {/* Eyes on Screen */}
        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Eyes on Screen
          </h2>
          <p className="text-3xl font-bold text-green-500">
            {eyesOnScreenPct}%
          </p>
        </div> */}

        {/* Avg Keystrokes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Avg Keystrokes / 10s
          </h2>
          <p className="text-3xl font-bold text-blue-600">{avgKeystrokes}</p>
        </div>

        {/* Avg Mouse Distance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Avg Mouse Distance / 10s
          </h2>
          <p className="text-3xl font-bold text-blue-600">{avgMouseDistance}</p>
        </div>
      </div>

      {/* Focus Analytics Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Focus Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track your productivity, trends, and discover your optimal work times.
        </p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-64 hover:shadow-lg transition-shadow">
          {insights.trend && insights.trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalFocusTimeMin"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              Loading productivity data...
            </div>
          )}
        </div>
      </section>

      {/* AI-Adaptive Scheduler */}
      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            AI-Adaptive Scheduler
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learns your focus stamina and optimizes session lengths, break
            times, and intensity based on your past performance.
          </p>
        </div>

        {/* Mood & Energy Check-ins */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Mood & Energy Check-ins
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Log how you feel daily and receive smarter, more personalized tips
            for your sessions.
          </p>
        </div>
      </section>
    </main>
  );
}
