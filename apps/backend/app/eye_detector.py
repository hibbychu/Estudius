import threading
import cv2
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EyePresenceDetector:
    def __init__(self,
                 face_cascade_path: Optional[str] = None,
                 eye_cascade_path: Optional[str] = None):
        if face_cascade_path is None:
            face_cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        if eye_cascade_path is None:
            # More tolerant to head tilt and glasses
            eye_cascade_path = cv2.data.haarcascades + "haarcascade_eye_tree_eyeglasses.xml"

        self.face_cascade = cv2.CascadeClassifier(face_cascade_path)
        self.eye_cascade = cv2.CascadeClassifier(eye_cascade_path)

    def detect_eyes_or_tilted_face(self, frame) -> bool:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y + h, x:x + w]

            # Loosened eye detection settings
            eyes = self.eye_cascade.detectMultiScale(
                roi_gray, scaleFactor=1.05, minNeighbors=3, minSize=(15, 15)
            )
            if len(eyes) >= 1:
                return True  # Eyes found normally

            # Optional fallback: Face is present and looking downward (but no eyes)
            face_height = h
            face_ratio = face_height / frame.shape[0]
            if face_ratio > 0.25:  # Big enough face = close to screen, even if eyes missed
                return True

        return False  # No usable signal

status = {'eyes_on_screen': False}

def webcam_worker(detector: EyePresenceDetector):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot open webcam.")
        return
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        eyes_on_screen = detector.detect_eyes_or_tilted_face(frame)
        status['eyes_on_screen'] = eyes_on_screen
        # (Optionally display/annotate if you want; can remove imshow)
        # if cv2.waitKey(1) & 0xFF == ord("q"):
        #     break
    cap.release()
    cv2.destroyAllWindows()

@app.get("/eyes")
def get_eyes_status():
    return JSONResponse({"eyes_on_screen": status['eyes_on_screen']})

if __name__ == "__main__":
    detector = EyePresenceDetector()
    # Start webcam detection in background thread
    t = threading.Thread(target=webcam_worker, args=(detector,), daemon=True)
    t.start()
    # Run FastAPI server (accessible at http://localhost:8001/eyes)
    uvicorn.run(app, port=8001)