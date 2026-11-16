import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BASEMAPS } from '../map/types';
import { ACEH_CENTER, DEFAULT_ZOOM } from '../map/utils/geoHelpers';

type BasemapState = 'loading' | 'ready' | 'error';

export default function HomeBasemap() {
  const [state, setState] = useState<BasemapState>('loading');
  const basemap = BASEMAPS.osm;

  return (
    <div className="relative isolate overflow-hidden border border-line bg-paper">
      <div
        role="img"
        aria-label="Peta dasar Provinsi Aceh dari OpenStreetMap. Lapisan batas administrasi resmi belum tersedia."
        className="h-[320px] md:h-[420px]"
      >
        <div inert className="h-full w-full">
          <MapContainer
            center={ACEH_CENTER}
            zoom={DEFAULT_ZOOM}
            className="h-full w-full"
            style={{ cursor: 'default' }}
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            touchZoom={false}
            keyboard={false}
          >
            <TileLayer
              url={basemap.url}
              attribution={basemap.attribution}
              maxZoom={basemap.maxZoom}
              eventHandlers={{
                load: () => setState('ready'),
                tileerror: () => setState('error'),
              }}
            />
          </MapContainer>
        </div>
      </div>

      <div
        role="status"
        aria-hidden={state !== 'loading'}
        className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-paper transition-opacity duration-200 ease-editorial ${
          state === 'loading' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-sm text-ink-2">Memuat peta dasar</p>
      </div>

      {state === 'error' && (
        <div className="absolute inset-x-0 bottom-0 animate-fade-in border-t border-line bg-paper p-4">
          <p className="text-sm text-ink-2">
            Peta dasar tidak dapat dimuat. Periksa koneksi lalu muat ulang halaman.
          </p>
        </div>
      )}
    </div>
  );
}
