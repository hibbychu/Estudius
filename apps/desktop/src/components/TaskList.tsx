import React, { useState, useEffect } from "react";
import { useAuthStore } from "../state/authStore"; // your auth state

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
  updatedAt: string;
  user_email: string;
}

export default function TaskList() {
  const token = useAuthStore((state) => state.token);
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "Unknown error");
    return data;
  };

  // Fetch tasks
  useEffect(() => {
    fetchWithAuth("http://localhost:8005/tasks")
      .then((data: Task[]) => setTaskList(data))
      .catch((err: Error) => setError(err.message));
  }, [token]);

  // Add task
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !task.trim()) return;
    e.preventDefault();
    setError("");
    fetchWithAuth("http://localhost:8005/tasks", {
      method: "POST",
      body: JSON.stringify({ text: task.trim(), completed: false }),
    })
      .then((createdTask: Task) => {
        setTaskList((prev) => [...prev, createdTask]);
        setTask("");
      })
      .catch((err: Error) => setError(err.message));
  };

  // Delete task
  const deleteTask = (id: string) => {
    setError("");
    fetchWithAuth(`http://localhost:8005/tasks/${id}`, { method: "DELETE" })
      .then(() => setTaskList((prev) => prev.filter((t) => t.id !== id)))
      .catch((err: Error) => setError(err.message));
  };

  // Toggle completion
  const toggleTaskCompletion = (task: Task) => {
    setError("");
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };
    fetchWithAuth(`http://localhost:8005/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
    })
      .then((updated: Task) =>
        setTaskList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      )
      .catch((err: Error) => setError(err.message));
  };

  // Edit
  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = (id: string) => {
    const trimmedText = editingText.trim();
    if (!trimmedText) return cancelEdit();

    const taskToUpdate = taskList.find((t) => t.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, text: trimmedText, updatedAt: new Date().toISOString() };

    setError("");
    fetchWithAuth(`http://localhost:8005/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
    })
      .then((updated: Task) => {
        setTaskList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        cancelEdit();
      })
      .catch((err: Error) => setError(err.message));
  };

  if (!token) 
  return (
    <div className="flex justify-center items-center h-40">
      <p className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-lg shadow text-center text-md font-medium">
        Please log in to view your tasks.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col max-w-md mx-auto my-2 bg-white rounded-xl shadow p-8 space-y-6">
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Input */}
      <div>
        <label htmlFor="task" className="block text-md font-semibold text-gray-950">
          Tasks
        </label>
        <div className="mt-2">
          <input
            id="task"
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Task list */}
      {taskList.length > 0 && (
        <ul className="space-y-2">
          {taskList.map((task) => (
            <li key={task.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="border border-gray-300 rounded px-1 py-0.5 text-gray-800"
                    autoFocus
                  />
                ) : (
                  <label
                    className={`text-gray-800 ${task.completed ? "line-through text-gray-400" : ""}`}
                    onDoubleClick={() => startEdit(task.id, task.text)}
                  >
                    {task.text}
                  </label>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(task.id, task.text)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  ✎
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


