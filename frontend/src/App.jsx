import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bus, Navigation, Map as MapIcon, Clock } from 'lucide-react';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const shuttleIcon = new L.DivIcon({
  className: 'custom-shuttle-icon',
  html: '<div style="background-color: white; border-radius: 50%; padding: 5px; border: 2px solid #3b82f6; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h20v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="M9 18h6"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/><path d="M4 6h16a2 2 0 0 1 2 2v4H2V8a2 2 0 0 1 2-2Z"/></svg></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function App() {
  const [shuttles, setShuttles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial routes
    fetch('http://localhost:8000/api/routes')
      .then(res => res.json())
      .then(data => {
        setRoutes(data);
      })
      .catch(err => console.error("Error fetching routes:", err));

    // Fetch initial shuttles
    fetch('http://localhost:8000/api/shuttles')
      .then(res => res.json())
      .then(data => {
        setShuttles(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching shuttles:", err));

    // WebSocket for real-time updates
    const ws = new WebSocket('ws://localhost:8000/ws/shuttles');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setShuttles(data);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-blue-600 p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bus size={32} />
          <h1 className="text-2xl font-bold">UniShuttle Tracker</h1>
        </div>
        <div className="hidden md:block text-sm">
          Real-time Campus Transportation
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 p-4 overflow-y-auto hidden lg:block">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Navigation size={20} /> Active Shuttles
          </h2>
          <div className="space-y-4">
            {shuttles.map(shuttle => (
              <div key={shuttle.id} className="bg-gray-700 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="font-bold">{shuttle.name}</div>
                <div className="text-sm text-gray-400">Route: {shuttle.route_id}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    shuttle.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {shuttle.status}
                  </span>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> Just now
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
            <MapIcon size={20} /> Routes
          </h2>
          <div className="space-y-2">
            {routes.map(route => (
              <div key={route.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }}></div>
                <span>{route.name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          <MapContainer center={[5.6515, -0.19]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Draw Routes */}
            {routes.map(route => (
              <Polyline
                key={route.id}
                positions={route.path.map(p => [p.lat, p.lng])}
                color={route.color}
                weight={4}
                opacity={0.7}
              />
            ))}

            {/* Draw Shuttles */}
            {shuttles.map(shuttle => (
              <Marker
                key={shuttle.id}
                position={[shuttle.location.lat, shuttle.location.lng]}
                icon={shuttleIcon}
              >
                <Popup>
                  <div className="text-gray-900">
                    <strong className="block">{shuttle.name}</strong>
                    <span className="text-sm">Status: {shuttle.status}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </main>
      </div>
    </div>
  );
}

export default App;
