import React, { useState, useEffect } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
  updatedAt: string;
}

export default function TaskList() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // Add task
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && task.trim()) {
      e.preventDefault();
      const newTask = { text: task.trim(), completed: false };

      fetch("http://localhost:8005/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((createdTask) => {
          setTaskList((prev) => [...prev, createdTask]);
          setTask(""); // ✅ clears textbox
        })
        .catch(console.error);
    }
  };

  // Delete task
  const deleteTask = (id: string) => {
    fetch(`http://localhost:8005/tasks/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        setTaskList((prev) => prev.filter((t) => t.id !== id));
      })
      .catch(console.error);
  };

  // Toggle completion
  const toggleTaskCompletion = (task: Task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    fetch(`http://localhost:8005/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((updated) =>
        setTaskList((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        )
      )
      .catch(console.error);
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

    const updatedTask = {
      ...taskToUpdate,
      text: trimmedText,
      updatedAt: new Date().toISOString(),
    };

    fetch(`http://localhost:8005/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTaskList((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        cancelEdit();
      })
      .catch(console.error);
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetch("http://localhost:8005/tasks")
      .then((res) => res.json())
      .then((data) => setTaskList(data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col max-w-md mx-auto my-2 bg-white rounded-xl shadow p-8 space-y-6">
      {/* Input */}
      <div>
        <label
          htmlFor="task"
          className="block text-md font-semibold text-gray-950"
        >
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
            <li
              key={task.id}
              className="flex items-center justify-between space-x-4"
            >
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
                    className={`text-gray-800 ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
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
