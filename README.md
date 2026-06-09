# UniShuttle Tracker

A real-time campus shuttle tracking system prototype developed for a Human-Computer Interaction (HCI) project.

## Features
- **Real-time Map**: Visual tracking of campus shuttles using Leaflet.
- **Stateless Simulation**: Backend calculates shuttle positions based on time, making it perfect for serverless environments.
- **Mobile Friendly**: Responsive design for students on the go.

## Project Structure
- `src/`: React frontend source code.
- `api/`: Python backend (FastAPI) served as Vercel Serverless Functions.
- `HCI_Project_Proposal.pdf`: The formal project proposal.

## Local Development

### Backend (Python)
1. Install dependencies:
   ```bash
   pip install -r api/requirements.txt
   ```
2. Run the FastAPI server:
   ```bash
   uvicorn api.index:app --reload
   ```

### Frontend (React)
1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com).

### Steps:
1. **Push to GitHub**: Upload your code to a GitHub repository.
2. **Import to Vercel**:
   - Go to your Vercel Dashboard and click "Add New" -> "Project".
   - Import your GitHub repository.
3. **Configure Project**:
   - **Framework Preset**: Vite (detected automatically).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps` (Required due to peer dependency conflicts in some React 18/19 packages).
4. **Deploy**: Click "Deploy". Vercel will build the frontend and serve the `api/` directory as serverless functions.

### Architecture Note
The system uses **polling** (every 3 seconds) instead of WebSockets. This ensures compatibility with Vercel's stateless serverless functions while still providing a "live" feel for users.
