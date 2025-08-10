import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AvatarDropdown({ user, logout }: { user: any; logout: () => void }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={user?.avatar || "/assets/icons/user.png"}
        alt={user?.name || "User avatar"}
        className="w-6 h-6 rounded-full border-2 border-gray-400 hover:border-indigo-500 cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
          <button
            onClick={() => {
              navigate("/Profile");
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left bg-white text-gray-700 hover:bg-indigo-600 hover:text-white rounded-md"
          >
            Profile
          </button>
          <button
            onClick={() => {
              navigate("/Settings");
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left bg-white text-gray-700 hover:bg-indigo-600 hover:text-white rounded-md"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left bg-white text-gray-700 hover:bg-indigo-600 hover:text-white rounded-md"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default AvatarDropdown;
