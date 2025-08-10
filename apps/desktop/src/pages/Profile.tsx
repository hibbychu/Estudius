import React, { useState, useEffect } from "react";

export default function Profile() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    // TODO: Upload file to server or update authStore with new avatar URL
  };

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Profile</h1>

      {/* Account Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4 space-x-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Account
        </h2>

        {/* Profile picture preview */}
        <div className="flex items-center space-x-4">
          <img
            src={preview || "/assets/icons/user.png"}
            alt="Profile preview"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
          <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Change Profile Picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <button className="text-blue-600 hover:underline">
          Change Password
        </button>
        <button className="text-blue-600 hover:underline">Update Email</button>
        <button className="text-red-600 hover:underline">Delete Account</button>
      </section>
    </main>
  );
}
