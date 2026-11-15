import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { Users, MapPin, ZoomIn, Info } from 'lucide-react';
import type { SchoolPointFeature, GeoJSONFeatureCollection } from './types';
import { toLatLng, formatNumberId } from './utils/geoHelpers';
import { getSchoolIcon } from './utils/customIcons';

interface MapSchoolsProps {
  data?: GeoJSONFeatureCollection<SchoolPointFeature>;
  onSelectSchool?: (school: SchoolPointFeature) => void;
}

// Subkomponen tombol aksi interaktif di dalam popup
function PopupActions({
  position,
  onDetailClick,
}: {
  position: [number, number];
  onDetailClick?: () => void;
}) {
  const map = useMap();
  return (
    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200">
      <button
        type="button"
        onClick={() => map.flyTo(position, 14, { animate: true, duration: 1.2 })}
        className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors border border-slate-300"
        title="Zoom ke Lokasi Sekolah"
      >
        <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
        <span>Zoom Lokasi</span>
      </button>

      <button
        type="button"
        onClick={onDetailClick}
        className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition-colors shadow-sm"
        title="Lihat Detail Fasilitas Sekolah"
      >
        <Info className="w-3.5 h-3.5" />
        <span>Lihat Detail</span>
      </button>
    </div>
  );
}

export const MapSchools: React.FC<MapSchoolsProps> = ({
  data,
  onSelectSchool,
}) => {
  if (!data || !data.features || data.features.length === 0) {
    return null;
  }

  return (
    <>
      {data.features.map((feature) => {
        const { properties, geometry } = feature;
        const position = toLatLng(geometry.coordinates);

        return (
          <Marker
            key={`school-${properties.id}`}
            position={position}
            icon={getSchoolIcon(properties.level)}
            eventHandlers={{
              click: () => onSelectSchool && onSelectSchool(feature),
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-1 text-slate-800 max-h-64 overflow-y-auto pr-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    {properties.level} &bull; {properties.status}
                  </span>
                  {properties.npsn && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      NPSN: {properties.npsn}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {properties.name}
                </h3>

                <div className="space-y-1 text-xs text-slate-600 mb-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>
                      {properties.district}, {properties.regency}
                    </span>
                  </div>

                  {properties.address && (
                    <p className="text-[11px] text-slate-500 italic pl-5">
                      {properties.address}
                    </p>
                  )}

                  {properties.students_count !== undefined && (
                    <div className="flex items-center gap-1.5 pl-0.5 pt-0.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Siswa:{' '}
                        <strong>{formatNumberId(properties.students_count)}</strong>{' '}
                        {properties.teachers_count && (
                          <span className="text-slate-400">
                            &bull; Guru: {formatNumberId(properties.teachers_count)}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <PopupActions
                  position={position}
                  onDetailClick={() => onSelectSchool && onSelectSchool(feature)}
                />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MapSchools;
