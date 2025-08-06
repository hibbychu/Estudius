import React, { useEffect, useRef, useState } from "react";
import { useTimerStore } from "../state/store";
import { useEyeDetectorStatus } from "../hooks/useEyeDetectorStatus";

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
  { name: "Anime Girl Video", type: "video", src: "/backgrounds/Anime Girl.mp4" },
  { name: "Cafe Video", type: "video", src: "/backgrounds/Cafe.mp4" },
  { name: "Custom URL", src: "__custom__" },
];

type Mode = "focus" | "break";

const Timer: React.FC = () => {
  // Optional: Allow user to enable/disable the feature
  const [requireEyesToFocus, setRequireEyesToFocus] = useState<boolean>(true);

  // Replace this with your real "eyes detected" bridge
  const eyesOnScreen = useEyeDetectorStatus();

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

  // --- TIMER TICK EFFECT gated by eye detection ---
  useEffect(() => {
    // Core: only tick if EITHER (feature is off) OR (feature on + eyes detected)
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

  // --- UI ---
  return (
    <div className="flex flex-col max-w-md mx-auto my-2 border border-gray-100 bg-white rounded-xl shadow p-8 space-y-6">
      {loading && <p className="text-blue-500 font-semibold">Loading...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Eyes detection status and toggle */}
      <div className="flex items-center space-x-2 mb-2">
        <input
          id="eye-toggle"
          type="checkbox"
          checked={requireEyesToFocus}
          onChange={() => setRequireEyesToFocus((e) => !e)}
          className="mr-2"
        />
        <label htmlFor="eye-toggle" className="text-sm font-medium">
          Only count focus time if eyes detected
        </label>
        {requireEyesToFocus && (
          <span
            className={eyesOnScreen ? "text-green-600" : "text-gray-500"}
            style={{ fontSize: "1.2em" }}
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

      {/* Timer Info and Cycles */}
      <div className="flex justify-between w-full items-center text-lg font-semibold mb-2">
        <span>
          Total Focus: {Math.floor(totalFocusSeconds / 60)}m{" "}
          {totalFocusSeconds % 60}s
        </span>
        <span>Cycles: {cyclesCompleted}</span>
        <button
          onClick={resetCycles}
          className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
        className="w-full accent-blue-500 h-2 my-2"
      />

      {/* Controls */}
      <div className="space-x-3 mb-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={running ? pause : start}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      {/* Customization */}
      <div className="w-full flex flex-col space-y-4 mt-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Focus Length</label>
          <input
            type="range"
            min={15 * 60}
            max={60 * 60}
            step={60}
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            className="accent-blue-500 flex-1"
          />
          <span className="w-8 text-right">
            {Math.floor(focusDuration / 60)}m
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Break Length</label>
          <input
            type="range"
            min={3 * 60}
            max={30 * 60}
            step={60}
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="accent-green-500 flex-1"
          />
          <span className="w-8 text-right">
            {Math.floor(breakDuration / 60)}m
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Focus Music</label>
          <select
            value={focusMusic}
            onChange={(e) => setFocusMusic(e.target.value)}
            className="flex-1 p-1 rounded border border-blue-200"
          >
            {MUSIC_LIST.map((m) => (
              <option key={m.src} value={m.src}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Break Music</label>
          <select
            value={breakMusic}
            onChange={(e) => setBreakMusic(e.target.value)}
            className="flex-1 p-1 rounded border border-green-200"
          >
            {BREAK_MUSIC_LIST.map((m) => (
              <option key={m.src} value={m.src}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Background</label>
          <div className="flex-1">
            <select
              value={background}
              onChange={(e) => {
                const value = e.target.value;
                setBackground(value);
                if (value !== "__custom__") setCustomBackgroundURL(""); // Clear if not custom
              }}
              className="w-full p-1 rounded border border-purple-200"
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
                className="mt-2 w-full border rounded p-1"
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
