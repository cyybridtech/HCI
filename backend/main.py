from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import json
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data
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

shuttles: Dict[str, Shuttle] = {
    "shuttle-1": Shuttle(
        id="shuttle-1",
        name="Campus Express A",
        route_id="route-1",
        location=Location(lat=5.6506, lng=-0.1962),
        status="Active",
        last_updated=time.time()
    ),
    "shuttle-2": Shuttle(
        id="shuttle-2",
        name="Hostel Loop B",
        route_id="route-2",
        location=Location(lat=5.6515, lng=-0.1870),
        status="Delayed",
        last_updated=time.time()
    )
}

routes: List[Route] = [
    Route(
        id="route-1",
        name="Main Campus Route",
        color="#FF0000",
        path=[
            Location(lat=5.6506, lng=-0.1962),
            Location(lat=5.6510, lng=-0.1950),
            Location(lat=5.6520, lng=-0.1940),
            Location(lat=5.6530, lng=-0.1930)
        ]
    ),
    Route(
        id="route-2",
        name="Hostel Route",
        color="#0000FF",
        path=[
            Location(lat=5.6515, lng=-0.1870),
            Location(lat=5.6525, lng=-0.1880),
            Location(lat=5.6535, lng=-0.1890)
        ]
    )
]

# WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/api/shuttles")
async def get_shuttles():
    return list(shuttles.values())

@app.get("/api/routes")
async def get_routes():
    return routes

@app.websocket("/ws/shuttles")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Send current shuttle data every 2 seconds
            data = [shuttle.model_dump() for shuttle in shuttles.values()]
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(2)

            # Simulate slight movement
            for s_id in shuttles:
                shuttles[s_id].location.lat += 0.0001
                shuttles[s_id].location.lng += 0.0001
                shuttles[s_id].last_updated = time.time()

    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
