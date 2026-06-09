from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import time
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Location(BaseModel):
    lat: float
    lng: float

class Shuttle(BaseModel):
    id: str
    name: str
    route_id: str
    location: Location
    status: str
    last_updated: float

class Route(BaseModel):
    id: str
    name: str
    color: str
    path: List[Location]

# Static Data
ROUTES = [
    Route(
        id="route-1",
        name="Main Campus Route",
        color="#FF0000",
        path=[
            Location(lat=5.6506, lng=-0.1962),
            Location(lat=5.6510, lng=-0.1950),
            Location(lat=5.6520, lng=-0.1940),
            Location(lat=5.6530, lng=-0.1930),
            Location(lat=5.6520, lng=-0.1940), # Loop back
            Location(lat=5.6510, lng=-0.1950),
        ]
    ),
    Route(
        id="route-2",
        name="Hostel Route",
        color="#0000FF",
        path=[
            Location(lat=5.6515, lng=-0.1870),
            Location(lat=5.6525, lng=-0.1880),
            Location(lat=5.6535, lng=-0.1890),
            Location(lat=5.6525, lng=-0.1880), # Loop back
        ]
    )
]

SHUTTLE_DEFS = [
    {"id": "shuttle-1", "name": "Campus Express A", "route_id": "route-1", "speed": 0.05, "offset": 0},
    {"id": "shuttle-2", "name": "Hostel Loop B", "route_id": "route-2", "speed": 0.03, "offset": 10},
]

def interpolate(p1, p2, t):
    return Location(
        lat=p1.lat + (p2.lat - p1.lat) * t,
        lng=p1.lng + (p2.lng - p1.lng) * t
    )

def get_simulated_location(route_id: str, speed: float, offset: float):
    route = next(r for r in ROUTES if r.id == route_id)
    path = route.path

    # Calculate position based on current time
    # Full cycle takes 1/speed seconds
    cycle_duration = 60 / speed  # cycle duration in seconds
    current_time = time.time() + offset
    t = (current_time % cycle_duration) / cycle_duration

    # Map t (0..1) to path segments
    num_segments = len(path) - 1
    segment_float = t * num_segments
    segment_idx = int(segment_float)
    segment_t = segment_float - segment_idx

    if segment_idx >= num_segments:
        return path[-1]

    return interpolate(path[segment_idx], path[segment_idx+1], segment_t)

@app.get("/api/shuttles")
async def get_shuttles():
    shuttles = []
    for s_def in SHUTTLE_DEFS:
        loc = get_simulated_location(s_def["route_id"], s_def["speed"], s_def["offset"])
        shuttles.append(Shuttle(
            id=s_def["id"],
            name=s_def["name"],
            route_id=s_def["route_id"],
            location=loc,
            status="Active" if s_def["id"] == "shuttle-1" else "Delayed",
            last_updated=time.time()
        ))
    return shuttles

@app.get("/api/routes")
async def get_routes():
    return ROUTES

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
