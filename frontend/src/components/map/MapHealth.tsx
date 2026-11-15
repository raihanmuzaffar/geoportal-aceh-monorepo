import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { Phone, BedDouble, MapPin, ZoomIn, Info, ShieldCheck } from 'lucide-react';
import type { HealthPointFeature, GeoJSONFeatureCollection } from './types';
import { toLatLng, formatNumberId } from './utils/geoHelpers';
import { getHealthIcon } from './utils/customIcons';

interface MapHealthProps {
  data?: GeoJSONFeatureCollection<HealthPointFeature>;
  onSelectFacility?: (facility: HealthPointFeature) => void;
}

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
        title="Zoom ke Lokasi Faskes"
      >
        <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
        <span>Zoom Lokasi</span>
      </button>

      <button
        type="button"
        onClick={onDetailClick}
        className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold transition-colors shadow-sm"
        title="Lihat Detail Fasilitas Kesehatan"
      >
        <Info className="w-3.5 h-3.5" />
        <span>Lihat Detail</span>
      </button>
    </div>
  );
}

export const MapHealth: React.FC<MapHealthProps> = ({
  data,
  onSelectFacility,
}) => {
  if (!data || !data.features || data.features.length === 0) {
    return null;
  }

  return (
    <>
      {data.features.map((feature) => {
        const { properties, geometry } = feature;
        const position = toLatLng(geometry.coordinates);

        const typeColor =
          properties.type === 'Rumah Sakit'
            ? 'bg-rose-100 text-rose-800'
            : properties.type === 'Puskesmas'
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-sky-100 text-sky-800';

        return (
          <Marker
            key={`health-${properties.id}`}
            position={position}
            icon={getHealthIcon(properties.type)}
            eventHandlers={{
              click: () => onSelectFacility && onSelectFacility(feature),
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-1 text-slate-800 max-h-64 overflow-y-auto pr-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeColor}`}>
                    {properties.type}
                  </span>
                  {properties.emergency_ready && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> IGD 24 Jam
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

                  {properties.capacity !== undefined && (
                    <div className="flex items-center gap-1.5 pl-0.5 pt-0.5 text-slate-700">
                      <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Kapasitas Tempat Tidur:{' '}
                        <strong>{formatNumberId(properties.capacity)} TT</strong>
                      </span>
                    </div>
                  )}

                  {properties.phone && (
                    <div className="flex items-center gap-1.5 pl-0.5 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{properties.phone}</span>
                    </div>
                  )}
                </div>

                <PopupActions
                  position={position}
                  onDetailClick={() => onSelectFacility && onSelectFacility(feature)}
                />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MapHealth;
