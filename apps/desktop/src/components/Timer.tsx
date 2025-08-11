import React, { useEffect, useRef, useState } from "react";
import { useTimerStore } from "../state/store";
import { useEyeDetectorStatus } from "../hooks/useEyeDetectorStatus";
import { useActivityStatus } from "../hooks/useActivityStatus";
import { useFlowDetection } from "../hooks/useFlowDetection";
import { useFlowHistory } from "../hooks/useFlowHistory"; // or wherever you defined it

// Music lists
const MUSIC_LIST = [
  { name: "Silence", src: "" },
  { name: "Fire Crackling", src: "/music/focus/fire.mp3" },
  { name: "Rain", src: "/music/focus/rain.mp3" },
  { name: "Light-Rain", src: "/music/focus/light-rain.mp3" },
  { name: "Highway", src: "/music/focus/highway.mp3" },
  { name: "Water", src: "/music/focus/water.mp3" },
];
const BREAK_MUSIC_LIST = [{ name: "Silent", src: "" }];

export const BACKGROUND_LIST = [
  { name: "Default", src: "" },
  {
    name: "Anime Girl Video",
    type: "video",
    src: "/backgrounds/Anime Girl.mp4",
  },
  { name: "Cafe Video", type: "video", src: "/backgrounds/Cafe.mp4" },
  { name: "Custom URL", src: "__custom__" },
];

type Mode = "focus" | "break";

const Timer: React.FC = () => {
  // Eyes detection toggle
  const [requireEyesToFocus, setRequireEyesToFocus] = useState<boolean>(true);
  // Keyboard & mouse activity tracking toggle
  const [trackingEnabled, setTrackingEnabled] = useState<boolean>(false);
  const [trackingStatus, setTrackingStatus] = useState<string>("Unknown");

  // Eye detection status
  const eyesOnScreen = useEyeDetectorStatus();
  const activityStatus = useActivityStatus();
  // Zustand timer state/actions:
  const {
    focusDuration,
    breakDuration,
    secondsLeft,
    mode,
    running,
    focusMusic,
    breakMusic,
    background,
    totalFocusSeconds,
    cyclesCompleted,
    loading,
    error,
    setSecondsLeft,
    setMode,
    setFocusDuration,
    setBreakDuration,
    setFocusMusic,
    setBreakMusic,
    setBackground,
    start,
    pause,
    reset,
    incrementFocusSeconds,
    incrementCycles,
    resetCycles,
  } = useTimerStore();

  // Audio refs & previous state refs
  const startAudioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const prevModeRef = useRef<Mode>(mode);
  const prevRunningRef = useRef(running);

  const { isInFlow } = useFlowDetection();

  // to console log the history of detections
  const history = useFlowHistory(5000); // poll every 5 seconds
  useEffect(() => {
    // console.log("Flow History:", history);
  }, [history]);

  // --- TIMER TICK EFFECT gated by eye detection ---
  useEffect(() => {
    if (!running || secondsLeft === 0) return;
    if (requireEyesToFocus && !eyesOnScreen && mode === "focus") return;

    const interval = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);
      if (mode === "focus") incrementFocusSeconds();
    }, 1000);

    return () => clearInterval(interval);
  }, [
    running,
    secondsLeft,
    mode,
    setSecondsLeft,
    incrementFocusSeconds,
    eyesOnScreen,
    requireEyesToFocus,
  ]);

  // --- PHASE TRANSITIONS ---
  useEffect(() => {
    if (secondsLeft === 0) {
      if (mode === "focus") {
        if (endAudioRef.current) {
          endAudioRef.current.currentTime = 0;
          endAudioRef.current.play();
        }
        if (musicAudioRef.current) {
          musicAudioRef.current.pause();
          musicAudioRef.current.currentTime = 0;
        }
        setTimeout(() => {
          incrementCycles();
          setMode("break");
          setSecondsLeft(breakDuration);
          start();
        }, 1500);
      } else {
        setTimeout(() => {
          setMode("focus");
          setSecondsLeft(focusDuration);
          start();
        }, 700);
      }
    }
  }, [
    secondsLeft,
    mode,
    breakDuration,
    focusDuration,
    setMode,
    setSecondsLeft,
    start,
    incrementCycles,
  ]);

  // Start sound logic
  useEffect(() => {
    if (
      running &&
      mode === "focus" &&
      secondsLeft === focusDuration &&
      (!prevRunningRef.current || prevModeRef.current !== "focus")
    ) {
      if (startAudioRef.current) {
        startAudioRef.current.currentTime = 0;
        startAudioRef.current.play();
      }
    }
    prevModeRef.current = mode;
    prevRunningRef.current = running;
  }, [running, mode, secondsLeft, focusDuration]);

  // Music playback logic
  useEffect(() => {
    if (
      running &&
      mode === "focus" &&
      (prevModeRef.current !== "focus" ||
        focusMusic !== musicAudioRef.current?.src)
    ) {
      if (musicAudioRef.current && focusMusic) {
        musicAudioRef.current.src = focusMusic;
        musicAudioRef.current.currentTime = 0;
        musicAudioRef.current.play();
      }
    } else {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.currentTime = 0;
      }
    }
    prevModeRef.current = mode;
  }, [running, mode, focusMusic]);

  // Reset timer
  const onReset = () => {
    reset();
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
    }
  };

  // Format
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const maxTime = mode === "focus" ? focusDuration : breakDuration;

  const [customBackgroundURL, setCustomBackgroundURL] = useState("");

  // --- Toggle activity tracking and notify backend ---
  const handleToggleActivityTracking = async () => {
    const newValue = !trackingEnabled;
    setTrackingEnabled(newValue);
    try {
      const response = await fetch(`http://localhost:8001/activity_monitor`, {
        method: newValue ? "POST" : "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to ${newValue ? "start" : "stop"} activity monitor`
        );
      }
      setTrackingStatus(newValue ? "Tracking enabled" : "Tracking disabled");
    } catch (error: any) {
      setTrackingStatus(`Error: ${error.message || error}`);
      setTrackingEnabled(!newValue); // revert toggle on failure
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto my-6 border border-gray-100 bg-white rounded-xl shadow p-8 space-y-8">
      {loading && <p className="text-blue-500 font-semibold">Loading...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Eyes detection status and toggle */}
      <div className="flex items-center space-x-3 mb-3">
        <input
          id="eye-toggle"
          type="checkbox"
          checked={requireEyesToFocus}
          onChange={() => setRequireEyesToFocus((e) => !e)}
          className="mr-2"
        />
        <label
          htmlFor="eye-toggle"
          className="text-sm font-semibold text-gray-700 cursor-pointer"
        >
          Only count focus time if eyes detected
        </label>
        {requireEyesToFocus && (
          <span
            className={`${
              eyesOnScreen ? "text-green-600" : "text-gray-400"
            } text-lg select-none`}
          >
            {eyesOnScreen ? "👁️ Eyes detected" : "🙈 Eyes not detected"}
          </span>
        )}
      </div>
      {/* Paused warning if not detected */}
      {requireEyesToFocus && !eyesOnScreen && running && (
        <div className="bg-yellow-100 text-yellow-800 rounded px-2 py-1 mb-2 font-semibold">
          Timer paused: Eyes not detected!
        </div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          background: "#eee",
          padding: "0.5rem",
          borderRadius: "8px",
          zIndex: 999,
        }}
      >
        <strong>Flow State:</strong>{" "}
        {isInFlow ? "🟢 IN FLOW" : "⚪️ not in flow"}
      </div>

      {/* Activity Tracking Toggle */}
      <div className="bg-gray-50 rounded-xl p-4 shadow-inner border border-gray-200 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Activity Monitor Status:</h3>
        {activityStatus ? (
          <>
            <p className="text-gray-600">
              Keystrokes (last 10s window):{" "}
              {activityStatus.last_keystroke_count}
            </p>
            <p className="text-gray-600"> 
              Mouse Distance (px):{" "}
              {activityStatus.last_mouse_distance.toFixed(2)}
            </p>
            <p className="italic text-gray-500">{activityStatus.last_log}</p>
          </>
        ) : (
          <p>Loading activity data...</p>
        )}
      </div>
      {trackingEnabled && (
        <div className="text-green-600 mb-4 font-semibold">{trackingStatus}</div>
      )}

      {/* Timer Info and Cycles */}
      <div className="flex justify-between items-center text-lg font-semibold mb-4 border-b border-gray-200 pb-3">
        <span>
          Total Focus: {Math.floor(totalFocusSeconds / 60)}m{" "}
          {totalFocusSeconds % 60}s
        </span>
        <span>Cycles: {cyclesCompleted}</span>
        <button
          onClick={resetCycles}
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 transition-shadow shadow-md"
          title="Reset Pomodoro Cycles"
        >
          Reset Cycles
        </button>
      </div>
      <span
        className={`uppercase tracking-wide font-semibold ${
          mode === "focus" ? "text-blue-500" : "text-green-500"
        }`}
      >
        {mode === "focus" ? "Focus" : "Break"} Session
      </span>

      <div className="text-5xl font-mono mb-4 text-blue-600 tracking-wider">
        {minutes}:{seconds}
      </div>

      {/* Progress Bar */}
      <input
        type="range"
        min={0}
        max={maxTime}
        step={1}
        value={secondsLeft}
        onChange={(e) => setSecondsLeft(Number(e.target.value))}
        className="w-full accent-blue-600 h-2 rounded-md"
      />

      {/* Controls */}
      <div className="space-x-4 mb-6">
        <button
          className="flex-1 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
          onClick={running ? pause : start}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="flex-1 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      {/* Customization */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold w-28 text-gray-700">Focus Length</label>
          <input
            type="range"
            min={15 * 60}
            max={60 * 60}
            step={60}
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            className="accent-blue-500 flex-1 rounded-md"
          />
          <span className="w-8 text-right font-mono text-gray-700">
            {Math.floor(focusDuration / 60)}m
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold w-28 text-gray-700">Break Length</label>
          <input
            type="range"
            min={3 * 60}
            max={30 * 60}
            step={60}
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="accent-green-500 flex-1"
          />
          <span className="w-8 text-right font-mono text-gray-700">
            {Math.floor(breakDuration / 60)}m
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold w-28 text-gray-700">Focus Music</label>
          <select
            value={focusMusic}
            onChange={(e) => setFocusMusic(e.target.value)}
            className="flex-1 p-2 rounded border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {MUSIC_LIST.map((m) => (
              <option key={m.src} value={m.src}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold w-28 text-gray-700">Break Music</label>
          <select
            value={breakMusic}
            onChange={(e) => setBreakMusic(e.target.value)}
            className="flex-1 p-2 rounded border border-green-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {BREAK_MUSIC_LIST.map((m) => (
              <option key={m.src} value={m.src}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-semibold w-28 text-gray-700">Background</label>
          <div className="flex-1">
            <select
              value={background}
              onChange={(e) => {
                const value = e.target.value;
                setBackground(value);
                if (value !== "__custom__") setCustomBackgroundURL(""); // Clear if not custom
              }}
              className="w-full p-2 rounded border border-purple-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {BACKGROUND_LIST.map((b) => (
                <option key={b.src || b.name} value={b.src}>
                  {b.name}
                </option>
              ))}
            </select>

            {background === "__custom__" && (
              <input
                type="text"
                placeholder="Paste image/video URL"
                className="mt-3 w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={customBackgroundURL}
                onChange={(e) => {
                  const url = e.target.value;
                  setCustomBackgroundURL(url);
                }}
                onBlur={() => {
                  if (customBackgroundURL.trim())
                    setBackground(customBackgroundURL);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Audio elements */}
      <audio ref={startAudioRef} src="/sounds/start.mp3" preload="auto" />
      <audio ref={endAudioRef} src="/sounds/end.mp3" preload="auto" />
      <audio ref={musicAudioRef} loop preload="auto" />
    </div>
  );
};

export default Timer;
