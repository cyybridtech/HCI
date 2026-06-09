import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bus, Navigation, Map as MapIcon, Clock, Menu, X } from 'lucide-react';

// API configuration
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';

const shuttleIcon = new L.DivIcon({
  className: 'custom-shuttle-icon',
  html: '<div style="background-color: white; border-radius: 50%; padding: 6px; border: 2px solid #3b82f6; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h20v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="M9 18h6"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/><path d="M4 6h16a2 2 0 0 1 2 2v4H2V8a2 2 0 0 1 2-2Z"/></svg></div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

function App() {
  const [shuttles, setShuttles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pollingRef = useRef(null);

  const fetchShuttles = () => {
    fetch(`${API_BASE_URL}/api/shuttles`)
      .then(res => res.json())
      .then(data => {
        setShuttles(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching shuttles:", err));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/routes`)
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => console.error("Error fetching routes:", err));

    fetchShuttles();
    pollingRef.current = setInterval(fetchShuttles, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-blue-700 p-4 shadow-xl flex items-center justify-between z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-2">
            <Bus size={28} className="text-white" />
            <h1 className="text-xl md:text-2xl font-black tracking-tight">UniShuttle</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center px-3 py-1 bg-blue-800 rounded-full text-xs font-medium border border-blue-500/30">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            LIVE SYSTEM
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Mobile Overlay */}
        <div className={`
          fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden
          ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `} onClick={() => setSidebarOpen(false)}></div>

        {/* Sidebar Content */}
        <aside className={`
          absolute lg:relative z-40 w-72 h-full bg-gray-900 border-r border-gray-800 transition-transform duration-300 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 overflow-y-auto
        `}>
          <div className="p-5 space-y-8">
            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Navigation size={14} /> Active Shuttles
              </h2>
              <div className="space-y-3">
                {shuttles.map(shuttle => (
                  <div key={shuttle.id} className="group bg-gray-800/50 hover:bg-gray-800 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-gray-100">{shuttle.name}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                        shuttle.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {shuttle.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <MapIcon size={12} className="opacity-50" /> {shuttle.route_id}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700/30 flex justify-between items-center">
                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={10} /> Updated just now
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapIcon size={14} /> Available Routes
              </h2>
              <div className="space-y-2">
                {routes.map(route => (
                  <div key={route.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full ring-4 ring-gray-900 shadow-sm" style={{ backgroundColor: route.color }}></div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white">{route.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative bg-gray-900">
          <MapContainer center={[5.6515, -0.19]} zoom={15} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {routes.map(route => (
              <Polyline
                key={route.id}
                positions={route.path.map(p => [p.lat, p.lng])}
                color={route.color}
                weight={5}
                opacity={0.6}
              />
            ))}

            {shuttles.map(shuttle => (
              <Marker
                key={shuttle.id}
                position={[shuttle.location.lat, shuttle.location.lng]}
                icon={shuttleIcon}
              >
                <Popup className="custom-popup">
                  <div className="p-1">
                    <strong className="text-blue-700 block text-base leading-tight mb-1">{shuttle.name}</strong>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${shuttle.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                       <span className="text-xs font-bold uppercase text-gray-500 tracking-tight">{shuttle.status}</span>
                    </div>
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
