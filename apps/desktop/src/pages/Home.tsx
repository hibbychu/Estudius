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
    </section >
  );
}
