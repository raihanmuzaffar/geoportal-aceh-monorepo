import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RotateCcw, AlertCircle, Loader2 } from 'lucide-react';

import type {
  BasemapType,
  LayerVisibilityState,
  GeoJSONFeatureCollection,
  SchoolPointFeature,
  HealthPointFeature,
  DisasterPointFeature,
  DisasterZoneFeature,
  PopulationDistrictFeature,
  AgricultureFeature,
} from './types';
import { BASEMAPS } from './types';
import { ACEH_CENTER, DEFAULT_ZOOM } from './utils/geoHelpers';
import './utils/customIcons'; // Register Leaflet default marker icons

import BasemapSwitcher from './BasemapSwitcher';
import LayerControl from './LayerControl';
import MapSchools from './MapSchools';
import MapHealth from './MapHealth';
import MapDisasterPoints from './MapDisasterPoints';
import MapPopulation from './MapPopulation';
import MapAgriculture from './MapAgriculture';
import MapDisasterZones from './MapDisasterZones';

// Import dataset mock data GeoJSON
import mockSchools from './mock/schoolsData.json';
import mockHealth from './mock/healthData.json';
import mockDisaster from './mock/disasterData.json';
import mockDistricts from './mock/acehDistricts.json';
import mockAgriculture from './mock/agricultureData.json';

// Komponen helper untuk mengontrol peta (Reset View & Invalidate Size saat resize)
function MapController({
  center,
  zoom,
  triggerReset,
}: {
  center: [number, number];
  zoom: number;
  triggerReset: number;
}) {
  const map = useMap();

  // Reset view saat triggerReset berubah
  useEffect(() => {
    if (triggerReset > 0) {
      map.flyTo(center, zoom, { animate: true, duration: 1.2 });
    }
  }, [triggerReset, map, center, zoom]);

  // Handle auto resize / invalidateSize agar tidak terjadi glitch area abu-abu saat sidebar berubah
  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [map]);

  return null;
}

export interface MapViewProps {
  className?: string;
  height?: string;
  schoolsData?: GeoJSONFeatureCollection<SchoolPointFeature>;
  healthData?: GeoJSONFeatureCollection<HealthPointFeature>;
  disasterData?: GeoJSONFeatureCollection<DisasterPointFeature | DisasterZoneFeature>;
  populationData?: GeoJSONFeatureCollection<PopulationDistrictFeature>;
  agricultureData?: GeoJSONFeatureCollection<AgricultureFeature>;
}

export const MapView: React.FC<MapViewProps> = ({
  className = '',
  height = '560px',
  schoolsData,
  healthData,
  disasterData,
  populationData,
  agricultureData,
}) => {
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('osm');
  const [resetCounter, setResetCounter] = useState(0);
  const [isLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Status visibilitas layer-layer spasial
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>({
    schools: true,
    healthFacilities: true,
    disasterPoints: true,
    populationChoropleth: true,
    agricultureLands: true,
    disasterZones: true,
    showMlPredictionsOnly: false,
  });

  const toggleLayer = (key: keyof LayerVisibilityState) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Menggunakan data dari props jika diberikan (misal dari API Laravel),
  // atau menggunakan fallback mock data valid jika belum ada response API
  const activeSchools = (schoolsData || mockSchools) as unknown as GeoJSONFeatureCollection<SchoolPointFeature>;
  const activeHealth = (healthData || mockHealth) as unknown as GeoJSONFeatureCollection<HealthPointFeature>;
  const activeDisaster = (disasterData || mockDisaster) as unknown as GeoJSONFeatureCollection<DisasterPointFeature | DisasterZoneFeature>;
  const activePopulation = (populationData || mockDistricts) as unknown as GeoJSONFeatureCollection<PopulationDistrictFeature>;
  const activeAgriculture = (agricultureData || mockAgriculture) as unknown as GeoJSONFeatureCollection<AgricultureFeature>;

  const currentBasemap = BASEMAPS[activeBasemap];

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex flex-col ${className}`}
      style={{ height }}
    >
      {/* Loading Spinner Overlay saat layer dimuat */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] z-[1050] flex items-center justify-center animate-in fade-in duration-150">
          <div className="p-3.5 bg-white/95 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            <span className="text-xs font-bold text-slate-700">Memuat Layer Spasial Aceh...</span>
          </div>
        </div>
      )}

      {/* Floating Control Bar di atas peta */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        <BasemapSwitcher
          activeBasemap={activeBasemap}
          onChangeBasemap={setActiveBasemap}
        />
        <LayerControl
          visibility={layerVisibility}
          onToggleLayer={toggleLayer}
          isLoading={isLoading}
        />
      </div>

      {/* Floating Quick Action (Reset View Provinsi Aceh) */}
      <div className="absolute top-3 right-3 z-[1000]">
        <button
          type="button"
          onClick={() => setResetCounter((prev) => prev + 1)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-sm text-slate-700 hover:text-slate-900 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-all font-medium text-xs sm:text-sm"
          title="Kembalikan Tampilan ke Pusat Provinsi Aceh"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Pusat Aceh</span>
        </button>
      </div>

      {/* Pesan Error jika terjadi kegagalan muat layer */}
      {errorMessage && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl shadow-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Container Peta Leaflet */}
      <MapContainer
        center={ACEH_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapController
          center={ACEH_CENTER}
          zoom={DEFAULT_ZOOM}
          triggerReset={resetCounter}
        />

        {/* Tile Layer Aktif Sesuai BasemapSwitcher */}
        <TileLayer
          key={activeBasemap}
          url={currentBasemap.url}
          attribution={currentBasemap.attribution}
          maxZoom={currentBasemap.maxZoom || 19}
        />

        {/* 1. Poligon Kependudukan (Choropleth) */}
        {layerVisibility.populationChoropleth && (
          <MapPopulation data={activePopulation} />
        )}

        {/* 2. Poligon Lahan Pertanian */}
        {layerVisibility.agricultureLands && (
          <MapAgriculture data={activeAgriculture} />
        )}

        {/* 3. Poligon Zona Kerawanan Bencana & Prediksi ML */}
        {layerVisibility.disasterZones && (
          <MapDisasterZones
            data={activeDisaster}
            showMlOnly={layerVisibility.showMlPredictionsOnly}
          />
        )}

        {/* 4. Titik Sekolah (Pendidikan) */}
        {layerVisibility.schools && <MapSchools data={activeSchools} />}

        {/* 5. Titik Fasilitas Kesehatan */}
        {layerVisibility.healthFacilities && <MapHealth data={activeHealth} />}

        {/* 6. Titik Kejadian Bencana */}
        {layerVisibility.disasterPoints && (
          <MapDisasterPoints data={activeDisaster} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
