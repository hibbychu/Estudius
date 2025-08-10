import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/globals.css";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Buddy from "./pages/Buddy";
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import { BACKGROUND_LIST } from "./components/Timer";
import { useTimerStore } from "./state/store";
import { useAuthStore } from "./state/authStore";
import AvatarDropdown from "./components/AvatarDropdown";

function App() {
  const { background } = useTimerStore();
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  const { isLoggedIn, user, logout } = useAuthStore();

  console.log("Is logged in?", isLoggedIn);
  console.log("User object:", user);
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background Layer */}
        {/* Background */}
        {backgroundColor ? (
          <div
            className="absolute top-0 left-0 w-full h-full z-0"
            style={{ backgroundColor }}
          />
        ) : BACKGROUND_LIST.find((b) => b.src === background)?.type ===
          "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src={background} type="video/mp4" />
          </video>
        ) : background ? (
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${background})` }}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-white z-0" />
        )}

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navigation Bar */}
          <nav className="bg-white dark:bg-gray-850">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                {/* Left side links */}
                <div className="flex space-x-4">
                  {[
                    { to: "/", label: "Home" },
                    { to: "/insights", label: "Insights" },
                    { to: "/buddy", label: "Buddy" },
                  ].map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/"}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                          isActive
                            ? "bg-gray-900 text-white hover:text-indigo-200"
                            : "text-gray-500 hover:bg-gray-700 hover:text-white"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>

                {/* Right side - auth area */}
                <div className="flex items-center space-x-4">
                  {isLoggedIn ? (
                    <div className="relative">
                      <AvatarDropdown user={user} logout={logout} />
                    </div>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-700 hover:text-white"
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/signup"
                        className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white"
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <main className="flex-grow p-8 max-w-7xl mx-auto w-ful">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/insights"
                element={
                  <PrivateRoute>
                    <Insights />
                  </PrivateRoute>
                }
              />
              <Route
                path="/buddy"
                element={
                  <PrivateRoute>
                    <Buddy />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              {/* <Route path="/Onboarding" element={<Onboarding />} /> */}
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Login" element={<Login />} />
              <Route
                path="/Profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-blue-600 text-white p-4 text-center text-sm">
            © {new Date().getFullYear()} Estudius. All rights reserved.
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
//   return (
//     <HashRouter>
//       <div className="min-h-screen flex flex-col bg-sky-gradient">
//         {/* Navigation Bar */}
//         <nav className="bg-white text-white p-4 flex justify-evenly">
//           {[
//             { to: "/", label: "Home" },
//             { to: "/insights", label: "Insights" },
//             { to: "/settings", label: "Settings" },
//             { to: "/onboarding", label: "Onboarding" },
//           ].map(({ to, label }) => (
//             <NavLink
//               key={to}
//               to={to}
//               end={to === "/"}
//               className={({ isActive }) =>
//                 `transition-colors duration-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
//                   isActive
//                     ? "bg-white text-blue-600 font-semibold shadow"
//                     : "text-gray-950 hover:bg-blue-600 hover:text-white"
//                 }`
//               }
//             >
//               {label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Page Content */}
//         <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             {/* <Route path="/insights" element={<Insights />} /> */}
//             <Route
//               path="/insights"
//               element={
//                 <PrivateRoute>
//                   <Insights />
//                 </PrivateRoute>
//               }
//             />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/onboarding" element={<Onboarding />} />
//             <Route path="/onboarding/signup" element={<SignUp />} />
//             <Route path="/onboarding/login" element={<Login />} />
//           </Routes>
//         </main>

//         {/* Footer */}
//         <footer className="bg-blue-600 text-white p-4 text-center text-sm">
//           © {new Date().getFullYear()} Estudius. All rights reserved.
//         </footer>
//       </div>
//     </HashRouter>
//   );
// }

// export default App;
