import React, { useEffect, useRef, useState } from "react";

// Dummy data for music. Replace src with your own mp3s in /public/music/
const MUSIC_LIST = [
  { name: "Fire Crackling", src: "/music/focus/fire.mp3" },
  { name: "rain", src: "/music/focus/rain.mp3" },
  { name: "light-rain", src: "/music/focus/light-rain.mp3" },
];
const BREAK_MUSIC_LIST = [
  { name: "Silent", src: "" },
  { name: "rain", src: "/music/focus/rain.mp3" },
  { name: "light-rain", src: "/music/focus/light-rain.mp3" },
];

type Mode = "focus" | "break";

const Timer: React.FC = () => {
  const [focusDuration, setFocusDuration] = useState(25 * 60); // seconds
  const [breakDuration, setBreakDuration] = useState(5 * 60); // seconds
  const [secondsLeft, setSecondsLeft] = useState(focusDuration);
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [focusMusic, setFocusMusic] = useState(MUSIC_LIST[0].src);
  const [breakMusic, setBreakMusic] = useState(BREAK_MUSIC_LIST[0].src);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAudioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  const prevModeRef = useRef<Mode>(mode);

  // Reset timers if durations are changed (during pause only)
  useEffect(() => {
    if (!running) {
      setSecondsLeft(mode === "focus" ? focusDuration : breakDuration);
    }
    // eslint-disable-next-line
  }, [focusDuration, breakDuration, mode]);

  useEffect(() => {
    // only play music at the very *beginning* of focus mode, or if focusMusic changes while in focus mode
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
    }
    // stop music if pausing or entering break mode
    if (!running || mode !== "focus") {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.currentTime = 0;
      }
    }
    prevModeRef.current = mode;
  }, [running, mode, focusMusic]);

  // Timer countdown
  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, secondsLeft]);

  // Handle timer end: play bell, stop music, auto-switch phase
  useEffect(() => {
    if (secondsLeft === 0) {
      if (mode === "focus") {
        // Focus phase ended; play bell, stop music
        if (endAudioRef.current) {
          endAudioRef.current.currentTime = 0;
          endAudioRef.current.play();
        }
        if (musicAudioRef.current) {
          musicAudioRef.current.pause();
          musicAudioRef.current.currentTime = 0;
        }
        setTimeout(() => {
          setMode("break");
          setSecondsLeft(breakDuration);
          setRunning(true); // auto-continue into break
        }, 1500); // 1.5s pause for finish sound
      } else {
        // Break phase ended; no audio, no music
        setTimeout(() => {
          setMode("focus");
          setSecondsLeft(focusDuration);
          setRunning(true); // auto-continue into focus
        }, 700);
      }
    }
    // eslint-disable-next-line
  }, [secondsLeft, mode]);

  const reset = () => {
    setRunning(false);
    setMode("focus");
    setSecondsLeft(focusDuration);
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
    }
  };

  // Format time MM:SS
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  // Handle user scrubbing bar
  const maxTime = mode === "focus" ? focusDuration : breakDuration;
  const handleSeek = (v: number) => setSecondsLeft(v);

  return (
    <div className="flex flex-col max-w-md mx-auto items-center bg-white rounded-xl shadow p-8 space-y-6">
      <div className="flex flex-col items-center w-full">
        <span
          className={`uppercase tracking-wide text-sm font-semibold ${mode === "focus" ? "text-blue-500" : "text-green-500"}`}>
          {mode === "focus" ? "Focus" : "Break"} Session
        </span>
        <div className="text-5xl font-mono mb-4 text-blue-600 tracking-wider">{minutes}:{seconds}</div>
        {/* PROGRESS BAR */}
        <input
          type="range"
          min={0}
          max={maxTime}
          step={1}
          value={secondsLeft}
          onChange={e => handleSeek(Number(e.target.value))}
          className="w-full accent-blue-500 h-2 my-2"
        />
      </div>

      {/* CONTROLS */}
      <div className="space-x-3 mb-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setRunning(!running)}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          onClick={reset}
        >
          Reset
        </button>
      </div>

      {/* CUSTOMIZATION */}
      <div className="w-full flex flex-col space-y-4 mt-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Focus Length</label>
          <input
            type="range"
            min={15 * 60} // 15 min
            max={60 * 60} // 60 min
            step={60}
            value={focusDuration}
            onChange={e => setFocusDuration(Number(e.target.value))}
            className="accent-blue-500 flex-1"
          />
          <span className="w-8 text-right">{Math.floor(focusDuration / 60)}m</span>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Break Length</label>
          <input
            type="range"
            min={3 * 60} // 3 min
            max={30 * 60} // 30 min
            step={60}
            value={breakDuration}
            onChange={e => setBreakDuration(Number(e.target.value))}
            className="accent-green-500 flex-1"
          />
          <span className="w-8 text-right">{Math.floor(breakDuration / 60)}m</span>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Focus Music</label>
          <select
            value={focusMusic}
            onChange={e => setFocusMusic(e.target.value)}
            className="flex-1 p-1 rounded border border-blue-200">
            {MUSIC_LIST.map(m => (
              <option key={m.src} value={m.src}>{m.name}</option>
            ))}
          </select>
        </div>
        {/* We don't play break music by instruction, so commentary out the break music select */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium w-28">Break Music</label>
          <select
            value={breakMusic}
            onChange={e => setBreakMusic(e.target.value)}
            className="flex-1 p-1 rounded border border-green-200">
            {BREAK_MUSIC_LIST.map(m => (
              <option key={m.src} value={m.src}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AUDIO */}
      <audio ref={startAudioRef} src="/sounds/start.mp3" preload="auto" />
      <audio ref={endAudioRef} src="/sounds/end.mp3" preload="auto" />
      <audio ref={musicAudioRef} loop preload="auto" />
    </div>
  );
};

export default Timer;
