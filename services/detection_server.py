from flask import Flask, Response, render_template
import cv2
import numpy as np
from sklearn.cluster import KMeans
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_dominant_colors(frame, n_colors=3):
    # Reshape the image to be a list of pixels
    pixels = frame.reshape(-1, 3)
    
    # Cluster the pixel intensities
    clt = KMeans(n_clusters=n_colors)
    clt.fit(pixels)
    
    # Get the colors and their percentages
    colors = []
    for center in clt.cluster_centers_:
        # Convert BGR to RGB
        rgb = center[::-1]
        # Convert to hex
        hex_color = '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))
        
        # Map to common color names
        color_name = get_color_name(rgb)
        confidence = np.sum(clt.labels_ == len(colors)) / len(clt.labels_)
        
        colors.append({
            "color": color_name,
            "confidence": float(confidence),
            "hex": hex_color
        })
    
    return colors

def get_color_name(rgb):
    # Define color ranges and names
    color_ranges = {
        'Red': ([160, 0, 0], [255, 50, 50]),
        'Blue': ([0, 0, 160], [50, 50, 255]),
        'Green': ([0, 160, 0], [50, 255, 50]),
        'White': ([200, 200, 200], [255, 255, 255]),
        'Black': ([0, 0, 0], [50, 50, 50]),
        'Silver': ([160, 160, 160], [200, 200, 200]),
        'Gray': ([100, 100, 100], [160, 160, 160]),
    }
    
    for color_name, (lower, upper) in color_ranges.items():
        if all(l <= v <= u for v, l, u in zip(rgb, lower, upper)):
            return color_name
    
    return 'Unknown'

def detect_vehicles(frame):
    # Load pre-trained car cascade classifier
    car_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_car.xml')
    
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect vehicles
    cars = car_cascade.detectMultiScale(gray, 1.1, 3)
    
    detections = []
    for (x, y, w, h) in cars:
        # Get the region of interest (ROI) for color detection
        roi = frame[y:y+h, x:x+w]
        if roi.size > 0:
            colors = get_dominant_colors(roi)
            detections.append({
                "color": colors[0]["color"],  # Use the most dominant color
                "confidence": colors[0]["confidence"],
                "bbox": [int(x), int(y), int(w), int(h)]
            })
    
    return detections

def generate_frames():
    camera = cv2.VideoCapture(0)  # Use 0 for webcam or RTSP URL for IP camera
    
    while True:
        success, frame = camera.read()
        if not success:
            break
        
        # Detect vehicles and their colors
        detections = detect_vehicles(frame)
        
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
        
        # Yield both frame and detection data
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'
               b'Content-Type: application/json\r\n\r\n' + 
               json.dumps(detection_data).encode() + b'\r\n')

@app.route('/')
def index():
    return render_template('templates/index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 