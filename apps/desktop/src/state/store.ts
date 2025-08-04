import { create } from 'zustand';

interface TimerState {
  focusDuration: number;
  breakDuration: number;
  secondsLeft: number;
  mode: 'focus' | 'break';
  running: boolean;
  focusMusic: string;
  breakMusic: string;
  background: string;
  totalFocusSeconds: number;
  cyclesCompleted: number;
  loading: boolean;
  error: string | null;

  // actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  resetCycles: () => void;
  setSecondsLeft: (value: number) => void;
  setMode: (mode: 'focus' | 'break') => void;
  setFocusDuration: (sec: number) => void;
  setBreakDuration: (sec: number) => void;
  setFocusMusic: (src: string) => void;
  setBreakMusic: (src: string) => void;
  setBackground: (src: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  incrementCycles: () => void;
  incrementFocusSeconds: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,
  secondsLeft: 25 * 60,
  mode: 'focus',
  running: false,
  focusMusic: '',
  breakMusic: '',
  background: '',
  totalFocusSeconds: 0,
  cyclesCompleted: 0,
  loading: false,
  error: null,

  start: () => set({ running: true }),
  pause: () => set({ running: false }),
  reset: () => {
    const { mode, focusDuration, breakDuration } = get();
    set({
      running: false,
      secondsLeft: mode === 'focus' ? focusDuration : breakDuration,
    });
  },
  setSecondsLeft: (value) => set({ secondsLeft: value }),
  setMode: (mode) => {
    const duration = mode === 'focus' ? get().focusDuration : get().breakDuration;
    set({ mode, secondsLeft: duration, running: true });
  },
  resetCycles: () => set({ cyclesCompleted: 0 }),
  setFocusDuration: (sec) => set({ focusDuration: sec }),
  setBreakDuration: (sec) => set({ breakDuration: sec }),
  setFocusMusic: (src) => set({ focusMusic: src }),
  setBreakMusic: (src) => set({ breakMusic: src }),
  setBackground: (src) => set({ background: src }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  incrementCycles: () => set((state) => ({ cyclesCompleted: state.cyclesCompleted + 1 })),
  incrementFocusSeconds: () => set((state) => ({ totalFocusSeconds: state.totalFocusSeconds + 1 })),
}));
