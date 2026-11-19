import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';
import { AlertCircle, LocateFixed, Minus, Plus } from 'lucide-react';
import { BASEMAPS } from './types';
import { ACEH_CENTER, DEFAULT_ZOOM } from './utils/geoHelpers';

export type PublicBasemapId = 'osm' | 'satellite';

type TileState = 'loading' | 'ready' | 'error';

type PublicMapProps = {
  basemap: PublicBasemapId;
  resetSignal: number;
  className?: string;
  describedBy?: string;
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function MapBehaviour({ resetSignal }: { resetSignal: number }) {
  const map = useMap();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (prefersReducedMotion()) {
      map.setView(ACEH_CENTER, DEFAULT_ZOOM);
      return;
    }

    map.flyTo(ACEH_CENTER, DEFAULT_ZOOM, { animate: true, duration: 0.9 });
  }, [resetSignal, map]);

  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    const timer = window.setTimeout(handleResize, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timer);
    };
  }, [map]);

  return null;
}

export default function PublicMap({
  basemap,
  resetSignal,
  className = '',
  describedBy,
}: PublicMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [tileResult, setTileResult] = useState<{
    key: string;
    state: Exclude<TileState, 'loading'>;
  } | null>(null);

  const layerKey = `${basemap}-${retryCount}`;
  const tileState: TileState =
    tileResult?.key === layerKey ? tileResult.state : 'loading';

  const currentBasemap = BASEMAPS[basemap];

  return (
    <div
      className={`relative isolate bg-surface-soft ${className}`}
      role="region"
      aria-label="Peta dasar Provinsi Aceh"
      aria-describedby={describedBy}
    >
      <MapContainer
        ref={mapRef}
        center={ACEH_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <MapBehaviour resetSignal={resetSignal} />
        <TileLayer
          key={layerKey}
          url={currentBasemap.url}
          attribution={currentBasemap.attribution}
          maxZoom={currentBasemap.maxZoom || 19}
          eventHandlers={{
            load: () => setTileResult({ key: layerKey, state: 'ready' }),
            tileerror: () => setTileResult({ key: layerKey, state: 'error' }),
          }}
        />
      </MapContainer>

      <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Perbesar peta"
          className="inline-flex h-11 w-11 items-center justify-center border border-line-strong bg-surface text-ink shadow-overlay transition-[background-color,transform] duration-200 ease-editorial hover:bg-surface-soft active:translate-y-px"
        >
          <Plus aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Perkecil peta"
          className="inline-flex h-11 w-11 items-center justify-center border border-line-strong bg-surface text-ink shadow-overlay transition-[background-color,transform] duration-200 ease-editorial hover:bg-surface-soft active:translate-y-px"
        >
          <Minus aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.setView(ACEH_CENTER, DEFAULT_ZOOM)}
          aria-label="Kembalikan tampilan ke pusat Provinsi Aceh"
          className="inline-flex h-11 w-11 items-center justify-center border border-line-strong bg-surface text-ink shadow-overlay transition-[background-color,transform] duration-200 ease-editorial hover:bg-surface-soft active:translate-y-px"
        >
          <LocateFixed aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div
        role="status"
        aria-hidden={tileState !== 'loading'}
        className={`pointer-events-none absolute inset-0 z-[900] flex items-center justify-center bg-[rgba(247,244,236,0.7)] transition-opacity duration-200 ease-editorial ${
          tileState === 'loading' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="border border-line bg-paper px-4 py-2 text-sm text-ink-2">
          Memuat peta dasar
        </p>
      </div>

      {tileState === 'error' && (
        <div
          role="alert"
          className="absolute inset-x-3 top-3 z-[1000] flex animate-fade-in items-start justify-between gap-3 border border-line-strong bg-paper p-3 text-sm text-ink-2 shadow-overlay sm:right-20"
        >
          <span className="flex items-start gap-2">
            <AlertCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
            <span>
              Sebagian ubin peta gagal dimuat. Periksa koneksi lalu coba lagi.
            </span>
          </span>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="shrink-0 border border-line-strong px-3 py-1 text-sm font-semibold text-forest underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
          >
            Coba lagi
          </button>
        </div>
      )}
    </div>
  );
}
