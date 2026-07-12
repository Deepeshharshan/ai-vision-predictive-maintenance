import random
from typing import Dict, Any
from datetime import datetime, timezone

def generate_machine_telemetry(machine_id: str) -> Dict[str, Any]:
    """Simulates realistic machine telemetry data using basic noise functions"""
    # Base values
    base_temp = 65.0
    base_vib = 4.0
    base_voltage = 220.0
    base_pressure = 110.0

    # Add random walk noise
    temp = base_temp + random.uniform(-15.0, 25.0)
    vib = base_vib + random.uniform(-1.5, 6.0)
    voltage = base_voltage + random.uniform(-5.0, 15.0)
    pressure = base_pressure + random.uniform(-10.0, 40.0)
    
    # Determine status based on thresholds
    status = "running"
    if temp > 85.0 or vib > 9.0:
        status = "critical"
    elif temp > 75.0 or vib > 7.0:
        status = "warning"
        
    # Simulate a small chance of going offline
    if random.random() < 0.05:
        status = "offline"

    return {
        "deviceId": machine_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metrics": {
            "temperature": round(temp, 2),
            "vibration": round(vib, 2),
            "voltage": round(voltage, 2),
            "pressure": round(pressure, 2),
        },
        "status": status
    }
