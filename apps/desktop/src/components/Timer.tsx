import React, { useEffect, useRef } from "react";
import { useTimerStore } from '../state/store';

// Dummy music data
const MUSIC_LIST = [
  { name: "Silence", src: "" },
  { name: "Fire Crackling", src: "/music/focus/fire.mp3" },
  { name: "Rain", src: "/music/focus/rain.mp3" },
  { name: "Light-Rain", src: "/music/focus/light-rain.mp3" },
  { name: "Highway", src: "/music/focus/highway.mp3" },
  { name: "Water", src: "/music/focus/water.mp3" },
];
const BREAK_MUSIC_LIST = [
  { name: "Silent", src: "" },
];

type Mode = "focus" | "break";

const Timer: React.FC = () => {
  // Zustand store
  const {
    focusDuration,
    breakDuration,
    secondsLeft,
    mode,
    running,
    focusMusic,
    breakMusic,
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
    start,
    pause,
    reset,
    incrementFocusSeconds,
    incrementCycles,
  } = useTimerStore();

  const { resetCycles } = useTimerStore();

  // Audio refs
  const startAudioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  const prevModeRef = useRef<Mode>(mode);
  const prevRunningRef = useRef(running);

  // Timer countdown & total focus time counter
  useEffect(() => {
    if (!running || secondsLeft === 0) return;

    const interval = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);
      if (mode === "focus") {
        incrementFocusSeconds();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, secondsLeft, mode, setSecondsLeft, incrementFocusSeconds]);

  // Phase transitions and cycle count
  useEffect(() => {
    if (secondsLeft === 0) {
      if (mode === "focus") {
        // Play end bell
        if (endAudioRef.current) {
          endAudioRef.current.currentTime = 0;
          endAudioRef.current.play();
        }
        // Stop music
        if (musicAudioRef.current) {
          musicAudioRef.current.pause();
          musicAudioRef.current.currentTime = 0;
        }
        setTimeout(() => {
          // Break ended -> pomodoro cycle completed
          incrementCycles();
          setMode("break");
          setSecondsLeft(breakDuration);
          start(); // auto-start break
        }, 1500);
      } else {
        setTimeout(() => {
          setMode("focus");
          setSecondsLeft(focusDuration);
          start(); // auto-start focus
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

  // Play start sound at focus session start only
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

  // Manage focus music playback
  useEffect(() => {
    if (
      running &&
      mode === "focus" &&
      (prevModeRef.current !== "focus" || focusMusic !== musicAudioRef.current?.src)
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

  // Reset timer handler
  const onReset = () => {
    reset();
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
    }
  };

  // Format MM:SS
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  const maxTime = mode === "focus" ? focusDuration : breakDuration;

  return (
    <div className="flex flex-col max-w-md mx-auto my-2 border border-gray-100 bg-white rounded-xl shadow p-8 space-y-6">
      {loading && <p className="text-blue-500 font-semibold">Loading...</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && (
        <>
          {/* Timer Info */}
          <div className="flex justify-between w-full text-lg font-semibold mb-2">
            <span>
              Total Focus: {Math.floor(totalFocusSeconds / 60)}m {totalFocusSeconds % 60}s
            </span>
            <span>Cycles: {cyclesCompleted}</span>
          </div>
            <button
              onClick={resetCycles}
              className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              title="Reset Pomodoro Cycles"
            >
              Reset Cycles
            </button>
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
              <span className="w-8 text-right">{Math.floor(focusDuration / 60)}m</span>
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
              <span className="w-8 text-right">{Math.floor(breakDuration / 60)}m</span>
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
          </div>
        </>
      )}

      {/* Audio elements */}
      <audio ref={startAudioRef} src="/sounds/start.mp3" preload="auto" />
      <audio ref={endAudioRef} src="/sounds/end.mp3" preload="auto" />
      <audio ref={musicAudioRef} loop preload="auto" />
    </div>
  );
};

export default Timer;
