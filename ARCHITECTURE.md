# Architecture: University Shuttle Tracking System

## Overview
The University Shuttle Tracking System is designed to provide students with real-time information about campus shuttle locations, routes, and estimated arrival times.

## Tech Stack
- **Backend:** Python with FastAPI
- **Frontend:** React with Tailwind CSS
- **Maps:** Leaflet.js (for route and shuttle visualization)
- **Database:** SQLite (for storing routes, stops, and historical data)
- **Real-time Communication:** WebSockets or Long Polling for live shuttle updates

## Data Models

### Shuttle
- `id`: Unique identifier
- `name`: Name of the shuttle (e.g., "Shuttle A")
- `route_id`: ID of the route the shuttle is currently serving
- `latitude`: Current latitude
- `longitude`: Current longitude
- `last_updated`: Timestamp of the last location update
- `status`: (e.g., "Active", "Delayed", "Out of Service")

### Route
- `id`: Unique identifier
- `name`: Name of the route
- `color`: Hex color for map visualization
- `path`: List of coordinates defining the route line

### Stop
- `id`: Unique identifier
- `name`: Name of the stop
- `latitude`: Latitude of the stop
- `longitude`: Longitude of the stop
- `routes`: List of route IDs that serve this stop

## API Endpoints

### Backend (FastAPI)
- `GET /api/shuttles`: Returns a list of all shuttles and their current locations.
- `GET /api/shuttles/{id}`: Returns details for a specific shuttle.
- `GET /api/routes`: Returns all shuttle routes and their paths.
- `GET /api/stops`: Returns all shuttle stops.
- `POST /api/shuttles/{id}/location`: (Internal/Driver API) Update the location of a shuttle.
- `WS /ws/shuttles`: WebSocket endpoint for real-time shuttle location updates.

## Frontend Components
- **MapContainer**: The main map view showing routes and moving shuttle icons.
- **RouteSidebar**: List of routes with the ability to toggle visibility.
- **ShuttleDetail**: Detailed information about a selected shuttle (status, next stop, ETA).
- **NotificationBanner**: Alerts for delays or service changes.

## Development Plan
1. Implement the FastAPI backend with mock data.
2. Set up the React frontend with Leaflet integration.
3. Connect the frontend to the backend via REST and WebSockets.
4. Add simulation logic to move shuttles along routes for demonstration.
