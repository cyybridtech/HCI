# University Shuttle Tracking System - Architecture

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Leaflet.js
- **Backend**: FastAPI (Python)
- **Deployment**: Vercel (All-in-one)

## System Design
The application is designed to be **stateless** and **serverless-compatible**, allowing it to be hosted entirely on Vercel.

### 1. Frontend (React)
- **Map Visualization**: Uses Leaflet.js to render campus maps and shuttle locations.
- **Real-time Updates**: Instead of WebSockets (unsupported by standard Vercel functions), the frontend uses **Polling**. It fetches updated shuttle positions from the backend every 3 seconds.
- **Responsive UI**: Styled with Tailwind CSS for both mobile and desktop use.

### 2. Backend (FastAPI / Serverless)
- **API Endpoints**:
    - `GET /api/routes`: Returns static route data (paths and colors).
    - `GET /api/shuttles`: Returns current shuttle locations.
- **Movement Simulation**: Since the backend is stateless (Serverless Functions), shuttle movement is calculated based on the current **Unix Timestamp**. The backend uses a mathematical interpolation function to determine where a shuttle should be along its route at any given second.

### 3. Data Flow
1. User opens the web app.
2. Frontend fetches the campus routes.
3. Frontend starts a polling loop.
4. Every 3 seconds, the Frontend calls `/api/shuttles`.
5. The Backend calculates the "live" position based on the current time and returns the coordinates.
6. The Map updates the shuttle markers smoothly.

## Deployment on Vercel
- The root `vercel.json` routes `/api/*` requests to the Python serverless function in `/api/index.py`.
- The frontend is built into the `dist` folder and served as static assets.
