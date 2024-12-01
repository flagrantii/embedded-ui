from flask import Flask, Response, render_template
import cv2
import numpy as np
from sklearn.cluster import KMeans
import json
import time
from flask_cors import CORS
import os
import torch

app = Flask(__name__, template_folder='templates')
CORS(app)

# Load YOLO model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
# Filter for vehicle classes
VEHICLE_CLASSES = ['car', 'truck', 'bus', 'motorcycle']

def get_dominant_color(roi):
    # Resize ROI for faster processing
    small_roi = cv2.resize(roi, (50, 50))
    pixels = small_roi.reshape(-1, 3)
    
    # Exclude very dark and very light colors
    mask = (pixels.mean(axis=1) > 30) & (pixels.mean(axis=1) < 225)
    filtered_pixels = pixels[mask]
    
    if len(filtered_pixels) == 0:
        return "Unknown", 0.0
    
    # Cluster the colors
    kmeans = KMeans(n_clusters=1)
    kmeans.fit(filtered_pixels)
    center = kmeans.cluster_centers_[0]
    
    # Define color ranges with more precise thresholds
    color_ranges = {
        'Red': ([150, 0, 0], [255, 60, 60], 0.3),
        'Blue': ([0, 0, 150], [60, 60, 255], 0.3),
        'White': ([180, 180, 180], [255, 255, 255], 0.8),
        'Black': ([0, 0, 0], [50, 50, 50], 0.15),
        'Silver': ([140, 140, 140], [180, 180, 180], 0.7),
        'Gray': ([90, 90, 90], [140, 140, 140], 0.5),
        'Yellow': ([200, 200, 0], [255, 255, 60], 0.4),
        'Green': ([0, 150, 0], [60, 255, 60], 0.3),
    }
    
    # Find the best matching color
    best_match = "Unknown"
    best_confidence = 0.0
    
    for color_name, (lower, upper, threshold) in color_ranges.items():
        if all(l <= c <= u for c, l, u in zip(center, lower, upper)):
            confidence = 1.0 - (np.abs(center - np.mean([lower, upper], axis=0)).mean() / 255)
            if confidence > threshold and confidence > best_confidence:
                best_match = color_name
                best_confidence = confidence
    
    return best_match, float(best_confidence)

def detect_vehicles(frame):
    # Run YOLO detection
    results = model(frame)
    detections = []
    
    # Process detections
    for *box, conf, cls in results.xyxy[0]:  # xyxy format
        if results.names[int(cls)] in VEHICLE_CLASSES and conf > 0.5:
            x1, y1, x2, y2 = map(int, box)
            
            # Get ROI for color detection
            roi = frame[y1:y2, x1:x2]
            if roi.size > 0:
                color, confidence = get_dominant_color(roi)
                
                detections.append({
                    "color": color,
                    "confidence": float(conf),  # YOLO confidence
                    "color_confidence": confidence,  # Color detection confidence
                    "bbox": [x1, y1, x2-x1, y2-y1],  # [x, y, width, height]
                    "class": results.names[int(cls)]
                })
    
    return detections

def generate_frames():
    video_path = os.path.join(os.path.dirname(__file__), 'test.mp4')
    print(f"Opening video: {video_path}")
    
    video = cv2.VideoCapture(video_path)
    if not video.isOpened():
        raise ValueError("Could not open video file")
    
    frame_count = 0
    
    while True:
        success, frame = video.read()
        if not success:
            video.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        
        frame_count += 1
        if frame_count % 3 != 0:  # Process every 3rd frame
            continue
        
        # Detect vehicles
        detections = detect_vehicles(frame)
        
        # Draw detections
        for det in detections:
            x, y, w, h = det['bbox']
            # Draw bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Draw labels
            label = f"{det['class']} - {det['color']} ({det['confidence']:.2f})"
            cv2.putText(frame, label, (x, y - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Prepare detection data
        detection_data = {
            "type": "detection",
            "payload": {
                "count": len(detections),
                "detections": detections
            }
        }
        
        # Encode frame
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'
               b'Content-Type: application/json\r\n\r\n' + 
               json.dumps(detection_data).encode() + b'\r\n')
        
        time.sleep(0.033)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    print("Starting detection server with YOLO model...")
    app.run(host='0.0.0.0', port=5000, debug=True) 