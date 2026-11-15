import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { SchoolLevel, HealthFacilityType, DisasterType, ImpactLevel } from '../types';

// Atur icon default Leaflet agar tidak broken saat di-bundle Vite
export const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Generator L.divIcon memadukan styling Tailwind CSS agar ikon tajam dan modern
 */
export const createDivIcon = (colorClass: string, symbolText: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white ${colorClass} text-white font-bold text-xs transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110">
        ${symbolText}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

/**
 * Icon untuk fasilitas pendidikan berdasarkan jenjang (SD, SMP, SMA, PT)
 */
export function getSchoolIcon(level: SchoolLevel): L.DivIcon {
  switch (level) {
    case 'SD':
      return createDivIcon('bg-red-600', 'SD');
    case 'SMP':
      return createDivIcon('bg-blue-600', 'SMP');
    case 'SMA':
    case 'SMK':
      return createDivIcon('bg-slate-700', 'SMA');
    case 'Perguruan Tinggi':
      return createDivIcon('bg-purple-700', 'PT');
    default:
      return createDivIcon('bg-sky-600', 'EDU');
  }
}

/**
 * Icon untuk fasilitas kesehatan (Rumah Sakit, Puskesmas, Klinik)
 */
export function getHealthIcon(type: HealthFacilityType): L.DivIcon {
  switch (type) {
    case 'Rumah Sakit':
      return createDivIcon('bg-rose-600', 'RS');
    case 'Puskesmas':
      return createDivIcon('bg-emerald-600', 'PKM');
    case 'Klinik':
      return createDivIcon('bg-sky-600', 'KLN');
    default:
      return createDivIcon('bg-teal-600', 'FES');
  }
}

/**
 * Icon untuk titik kejadian bencana
 */
export function getDisasterPointIcon(
  type: DisasterType,
  impact: ImpactLevel
): L.DivIcon {
  let colorClass: string;
  if (impact === 'Kritis' || impact === 'Tinggi') {
    colorClass = 'bg-red-600';
  } else if (impact === 'Sedang') {
    colorClass = 'bg-amber-600';
  } else {
    colorClass = 'bg-yellow-500';
  }

  let code = '⚠️';
  if (type === 'Banjir') code = '🌊';
  else if (type === 'Tanah Longsor') code = '⛰️';
  else if (type === 'Gempa Bumi') code = '🌋';
  else if (type === 'Angin Puting Beliung') code = '🌪️';
  else if (type === 'Kebakaran Hutan') code = '🔥';

  return L.divIcon({
    className: 'custom-disaster-icon',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-lg shadow-lg border-2 border-white ${colorClass} text-white font-bold text-sm transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125">
        ${code}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}
