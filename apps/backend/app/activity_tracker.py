# activity_tracker.py
import threading
from pynput import keyboard, mouse
import time
import math

activity_status = {
    'keystroke_count': 0,
    'mouse_distance': 0.0,
    'last_keystroke_count': 0,
    'last_mouse_distance': 0.0,
    'last_mouse_position': None,
    'last_log': ""
}

def on_press(key):
    activity_status['keystroke_count'] += 1

def on_move(x, y):
    last_pos = activity_status['last_mouse_position']
    if last_pos is not None:
        dx = x - last_pos[0]
        dy = y - last_pos[1]
        activity_status['mouse_distance'] += math.hypot(dx, dy)
    activity_status['last_mouse_position'] = (x, y)

def log_activity():
    while True:
        time.sleep(10)
        kc = activity_status['keystroke_count']
        md = activity_status['mouse_distance']
        if kc > 60 or md > 5000:
            status = "High energy/focus activity detected."
        elif kc < 10 and md < 500:
            status = "Low energy/fatigue may be present."
        else:
            status = "Moderate activity."
        log_line = f"[Activity Log] Keystrokes: {kc}, Mouse Distance: {md:.2f}px. Status: {status}"
        print(log_line)
        activity_status['last_log'] = log_line
        activity_status['last_keystroke_count'] = activity_status['keystroke_count']
        activity_status['last_mouse_distance'] = activity_status['mouse_distance']
        # Reset counters
        activity_status['keystroke_count'] = 0
        activity_status['mouse_distance'] = 0.0

def start_activity_monitor():
    keyboard_listener = keyboard.Listener(on_press=on_press)
    mouse_listener = mouse.Listener(on_move=on_move)
    keyboard_listener.start()
    mouse_listener.start()
    log_thread = threading.Thread(target=log_activity, daemon=True)
    log_thread.start()

# Only run this block if executed directly, NOT on import
if __name__ == "__main__":
    print("Starting activity monitor... (CTRL+C to stop)")
    start_activity_monitor()
    # Optional: block forever so script doesn't exit
    threading.Event().wait()
    