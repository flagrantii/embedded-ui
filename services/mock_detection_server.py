from flask import Flask, Response, render_template, jsonify
import cv2
import numpy as np
from sklearn.cluster import KMeans
import json
import time
from flask_cors import CORS
import torch
import yt_dlp

app = Flask(__name__, template_folder='templates')
CORS(app)

# Load YOLO model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
VEHICLE_CLASSES = ['car', 'truck', 'bus', 'motorcycle']

# YouTube stream URL
STREAM_URL = "https://www.youtube.com/watch?v=1EiC9bvVGnk"

def get_dominant_color(roi):
    small_roi = cv2.resize(roi, (50, 50))
    pixels = small_roi.reshape(-1, 3)
    
    mask = (pixels.mean(axis=1) > 30) & (pixels.mean(axis=1) < 225)
    filtered_pixels = pixels[mask]
    
    if len(filtered_pixels) == 0:
        return "Unknown", 0.0
    
    kmeans = KMeans(n_clusters=1)
    kmeans.fit(filtered_pixels)
    center = kmeans.cluster_centers_[0]
    
    color_ranges = {
        'Red': ([150, 0, 0], [255, 60, 60], 0.3),
        'Blue': ([0, 0, 150], [60, 60, 255], 0.3),
        'White': ([180, 180, 180], [255, 255, 255], 0.8),
        'Black': ([0, 0, 0], [50, 50, 50], 0.15),
        'Silver': ([140, 140, 140], [180, 180, 180], 0.7),
        'Gray': ([90, 90, 90], [140, 140, 140], 0.5),
    }
    
    best_match = "Unknown"
    best_confidence = 0.0
    
    for color_name, (lower, upper, threshold) in color_ranges.items():
        if all(l <= c <= u for c, l, u in zip(center, lower, upper)):
            confidence = 1.0 - (np.abs(center - np.mean([lower, upper], axis=0)).mean() / 255)
            if confidence > threshold and confidence > best_confidence:
                best_match = color_name
                best_confidence = confidence
    
    return best_match, float(best_confidence)

def generate_frames():
    ydl_opts = {
        'format': 'best[ext=mp4]',
        'quiet': True,
        'no_warnings': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(STREAM_URL, download=False)
        url = info['url']
        cap = cv2.VideoCapture(url)
        
        while True:
            success, frame = cap.read()
            if not success:
                cap = cv2.VideoCapture(url)
                continue
                
            # Resize frame
            frame = cv2.resize(frame, (800, 600))
            
            # Run detection
            results = model(frame)
            detections = []
            
            for *box, conf, cls in results.xyxy[0]:
                if results.names[int(cls)] in VEHICLE_CLASSES and conf > 0.5:
                    x1, y1, x2, y2 = map(int, box)
                    roi = frame[y1:y2, x1:x2]
                    
                    if roi.size > 0:
                        color, color_conf = get_dominant_color(roi)
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        label = f"{results.names[int(cls)]} - {color}"
                        cv2.putText(frame, label, (x1, y1 - 10), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                        
                        detections.append({
                            "color": color,
                            "confidence": float(conf),
                            "bbox": [x1, y1, x2-x1, y2-y1]
                        })
            
            # Encode frame
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            
            # Create detection data
            detection_data = {
                "type": "detection",
                "payload": {
                    "count": len(detections),
                    "detections": detections
                }
            }
            
            # Yield both frame and detection data
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
                   b'Content-Type: application/json\r\n\r\n' + 
                   json.dumps(detection_data).encode() + b'\r\n')
            
            time.sleep(0.033)  # ~30 FPS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    print("Starting detection server...")
    app.run(host='0.0.0.0', port=5000, debug=True)