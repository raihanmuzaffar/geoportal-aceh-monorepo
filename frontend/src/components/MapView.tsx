import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api/axios';

// --- PERBAIKAN IKON MARKER LEAFLET ---
// Secara default, Leaflet sering gagal memuat ikon marker di React/Vite.
// Kita harus meng-import ikonnya secara manual dan mengaturnya.
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --------------------------------------

export default function MapView() {
  // Koordinat tengah Provinsi Aceh
  const center: [number, number] = [4.695135, 96.749399]; 
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    // Mengambil data dari API Laravel
    const fetchLocations = async () => {
      try {
        const response = await api.get('/locations');
        setLocations(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data lokasi", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner z-0 relative">
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            // PostGIS mengembalikan [Longitude, Latitude], tapi Leaflet butuh [Latitude, Longitude]
            position={[loc.location.coordinates[1], loc.location.coordinates[0]]}
          >
            <Popup>
              <div className="p-1">
                <strong className="text-base text-slate-800">{loc.name}</strong><br/>
                <span className="text-sm text-slate-600">{loc.description}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}