import React from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { Calendar, Users, MapPin, ZoomIn, Info, ShieldAlert } from 'lucide-react';
import type { DisasterPointFeature, DisasterZoneFeature, DisasterIncidentProperties, GeoJSONFeatureCollection } from './types';
import { toLatLng, formatNumberId } from './utils/geoHelpers';
import { getDisasterPointIcon } from './utils/customIcons';

interface MapDisasterPointsProps {
  data?: GeoJSONFeatureCollection<DisasterPointFeature> | GeoJSONFeatureCollection<DisasterPointFeature | DisasterZoneFeature>;
  selectedType?: string;
  onSelectIncident?: (incident: DisasterPointFeature) => void;
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
        title="Zoom ke Titik Kejadian"
      >
        <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
        <span>Zoom Lokasi</span>
      </button>

      <button
        type="button"
        onClick={onDetailClick}
        className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition-colors shadow-sm"
        title="Lihat Detail Kejadian Bencana"
      >
        <Info className="w-3.5 h-3.5" />
        <span>Lihat Detail</span>
      </button>
    </div>
  );
}

export const MapDisasterPoints: React.FC<MapDisasterPointsProps> = ({
  data,
  selectedType,
  onSelectIncident,
}) => {
  if (!data || !data.features || data.features.length === 0) {
    return null;
  }

  // Filter titik kejadian yang bertipe Point
  const pointFeatures = (data.features as Array<DisasterPointFeature | DisasterZoneFeature>).filter(
    (f): f is DisasterPointFeature =>
      f.geometry.type === 'Point' &&
      (!selectedType || selectedType === 'ALL' || ('disaster_type' in f.properties && (f.properties as DisasterIncidentProperties).disaster_type === selectedType))
  );

  return (
    <>
      {pointFeatures.map((feature) => {
        const { properties, geometry } = feature;
        const position = toLatLng(geometry.coordinates);

        const impactBadgeColor =
          properties.impact_level === 'Kritis' || properties.impact_level === 'Tinggi'
            ? 'bg-red-100 text-red-800 border-red-200'
            : properties.impact_level === 'Sedang'
            ? 'bg-amber-100 text-amber-800 border-amber-200'
            : 'bg-yellow-100 text-yellow-800 border-yellow-200';

        return (
          <Marker
            key={`disaster-pt-${properties.id}`}
            position={position}
            icon={getDisasterPointIcon(properties.disaster_type, properties.impact_level)}
            eventHandlers={{
              click: () => onSelectIncident && onSelectIncident(feature),
            }}
          >
            <Popup className="custom-popup" maxWidth={310}>
              <div className="p-1 text-slate-800 max-h-64 overflow-y-auto pr-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-900 border border-orange-200">
                    {properties.disaster_type}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${impactBadgeColor}`}
                  >
                    Dampak: {properties.impact_level}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {properties.location_name}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 mb-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tanggal: {properties.date}</span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>
                      {properties.district ? `${properties.district}, ` : ''}
                      {properties.regency}
                    </span>
                  </div>

                  {properties.damage_summary && (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed">
                      {properties.damage_summary}
                    </div>
                  )}

                  {(properties.displaced_people || properties.casualties) ? (
                    <div className="flex items-center gap-3 pt-0.5 text-[11px]">
                      {properties.displaced_people !== undefined && (
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Users className="w-3.5 h-3.5" /> Pengungsi:{' '}
                          {formatNumberId(properties.displaced_people)} jiwa
                        </span>
                      )}
                      {properties.casualties !== undefined && properties.casualties > 0 && (
                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                          <ShieldAlert className="w-3.5 h-3.5" /> Korban Jiwa:{' '}
                          {properties.casualties}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>

                <PopupActions
                  position={position}
                  onDetailClick={() => onSelectIncident && onSelectIncident(feature)}
                />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MapDisasterPoints;
