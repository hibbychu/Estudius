import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/globals.css";
import Home from "./pages/Home";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { BACKGROUND_LIST } from "./components/Timer";
import { useTimerStore } from "./state/store";

function App() {
  const { background } = useTimerStore();
  const [backgroundColor, setBackgroundColor] = useState<string>("");

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
      ) : BACKGROUND_LIST.find((b) => b.src === background)?.type === "video" ? (
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
          <nav className="bg-white p-4 flex justify-evenly shadow">
            {[
              { to: "/", label: "Home" },
              { to: "/insights", label: "Insights" },
              { to: "/settings", label: "Settings" },
              { to: "/login", label: "Login" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `transition-colors duration-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                    isActive
                      ? "bg-white text-blue-600 font-semibold shadow"
                      : "text-gray-950 hover:bg-blue-600 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
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
              <Route path="/Settings" element={<Settings />} />
              <Route path="/Onboarding" element={<Onboarding />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Login" element={<Login />} />
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
