import random
from typing import Dict, Any, List
from datetime import datetime, timezone

DEFECT_CLASSES = ["Surface Scratch", "Misalignment", "Missing Bolt", "Paint Defect", "Crack"]

def simulate_ai_detection() -> List[Dict[str, Any]]:
    """Simulates YOLOv8 output for defects"""
    detections = []
    
    # 20% chance to detect something in this frame
    if random.random() < 0.2:
        num_detections = random.randint(1, 3)
        for _ in range(num_detections):
            detections.append({
                "label": random.choice(DEFECT_CLASSES),
                "confidence": round(random.uniform(0.75, 0.99), 2),
                "box": [
                    round(random.uniform(0, 500), 2), # x
                    round(random.uniform(0, 500), 2), # y
                    round(random.uniform(20, 100), 2), # w
                    round(random.uniform(20, 100), 2)  # h
                ]
            })
    return detections

def generate_camera_status(camera_id: str) -> Dict[str, Any]:
    """Simulates camera frames and AI pipeline output"""
    return {
        "cameraId": camera_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "health": round(random.uniform(90.0, 100.0), 2),
        "detections": simulate_ai_detection(),
        "fps": random.randint(28, 32)
    }
