import { useEffect, useRef, useState } from 'react';
import { Layers, X } from 'lucide-react';
import PublicMap, { type PublicBasemapId } from '../../components/map/PublicMap';
import ButtonLink from '../../components/ui/ButtonLink';
import StatusTag from '../../components/ui/StatusTag';

type BasemapOption = {
  id: PublicBasemapId;
  label: string;
  detail: string;
};

const basemapOptions: BasemapOption[] = [
  {
    id: 'osm',
    label: 'OpenStreetMap',
    detail: 'Jalan, permukiman, dan kenampakan alami.',
  },
  {
    id: 'satellite',
    label: 'Satelit Esri',
    detail: 'Citra permukaan bumi untuk membaca bentuk wilayah.',
  },
];

function BasemapOptions({
  name,
  value,
  onChange,
}: {
  name: string;
  value: PublicBasemapId;
  onChange: (id: PublicBasemapId) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">Peta dasar</legend>
      <div className="mt-3 space-y-1">
        {basemapOptions.map((option) => (
          <label
            key={option.id}
            className="flex min-h-11 cursor-pointer items-start gap-3 rounded border border-transparent px-2 py-2 transition-colors duration-200 ease-editorial hover:bg-surface-soft has-[:checked]:border-line-strong has-[:checked]:bg-surface-soft"
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="mt-1 h-4 w-4 shrink-0 accent-forest"
            />
            <span>
              <span className="block text-sm font-semibold text-ink">
                {option.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink-2">
                {option.detail}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function LayerEmptyState() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">Lapisan data</h3>
        <StatusTag status="unavailable">Belum tersedia</StatusTag>
      </div>
      <div className="mt-3 border border-dashed border-line-strong bg-surface-soft p-4">
        <p className="text-sm text-ink-2">
          Peta ini baru menampilkan peta dasar. Batas administrasi resmi, titik
          fasilitas, dan poligon tematik belum tersedia.
        </p>
        <p className="mt-3 text-xs text-ink-3">
          Lapisan akan ditambahkan setelah layanan GeoJSON menyediakan data
          terverifikasi. Tidak ada geometri contoh yang ditampilkan sebagai data
          resmi.
        </p>
      </div>
      <div className="mt-4">
        <ButtonLink to="/analitik/kependudukan" variant="text">
          Buka analisis kependudukan
        </ButtonLink>
      </div>
    </div>
  );
}

export default function WebGisPage() {
  const [basemap, setBasemap] = useState<PublicBasemapId>('osm');
  const [resetSignal, setResetSignal] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const currentBasemapName =
    basemapOptions.find((option) => option.id === basemap)?.label ?? '';

  useEffect(() => {
    if (!sheetOpen) return;

    const panel = sheetRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const focusableElements = () => {
      if (!panel) return [] as HTMLElement[];
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSheetOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocus?.focus?.();
    };
  }, [sheetOpen]);

  return (
    <section
      aria-labelledby="webgis-heading"
      className="relative overflow-hidden border-b border-line"
    >
      <h1 id="webgis-heading" className="sr-only">
        WebGIS Provinsi Aceh
      </h1>

      <div className="flex h-[calc(100dvh-64px)] min-h-[420px] md:h-[calc(100dvh-72px)]">
        <aside className="hidden w-80 shrink-0 animate-panel-in flex-col overflow-y-auto border-r border-line bg-surface md:flex">
          <div className="border-b border-line p-6">
            <p className="text-xs font-semibold text-ink-2">WebGIS</p>
            <h2 className="mt-2 text-2xl text-ink">Peta Aceh</h2>
            <p className="mt-3 text-sm text-ink-2">
              Peta dasar interaktif. Lapisan data tematik belum tersedia.
            </p>
          </div>

          <div className="flex-1 space-y-6 p-6">
            <BasemapOptions
              name="basemap-desktop"
              value={basemap}
              onChange={setBasemap}
            />

            <div className="border-t border-line pt-6">
              <LayerEmptyState />
            </div>
          </div>

          <div className="border-t border-line p-6">
            <button
              type="button"
              onClick={() => setResetSignal((value) => value + 1)}
              className="inline-flex min-h-11 w-full items-center justify-center border border-line-strong bg-surface px-4 text-sm font-semibold text-forest transition-[background-color,border-color,color,transform] duration-200 ease-editorial hover:bg-forest-soft active:translate-y-px"
            >
              Pusatkan ke Provinsi Aceh
            </button>
            <p className="mt-3 text-xs text-ink-3">
              Sumber peta dasar: OpenStreetMap dan Esri.
            </p>
          </div>
        </aside>

        <div className="relative isolate min-w-0 flex-1">
          <PublicMap
            basemap={basemap}
            resetSignal={resetSignal}
            className="h-full w-full"
            describedBy="webgis-text-alternative"
          />

          <p id="webgis-text-alternative" className="sr-only">
            Peta dasar Provinsi Aceh dengan peta dasar {currentBasemapName}.
            Tidak ada lapisan data tematik yang aktif karena batas administrasi
            resmi belum tersedia. Tabel hasil clustering kependudukan dapat dibaca
            di halaman analitik kependudukan.
          </p>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
            aria-controls="webgis-layer-sheet"
            className="absolute bottom-4 left-4 z-[1000] inline-flex min-h-11 items-center gap-2 border border-line-strong bg-surface px-4 text-sm font-semibold text-ink shadow-overlay transition-[background-color,transform] duration-200 ease-editorial active:translate-y-px md:hidden"
          >
            <Layers aria-hidden="true" size={16} strokeWidth={1.75} />
            Lapisan
          </button>
        </div>
      </div>

      <div
        className={`md:hidden ${sheetOpen ? 'visible' : 'pointer-events-none'}`}
        aria-hidden={!sheetOpen}
        inert={!sheetOpen}
      >
          <div
            className={`fixed inset-0 z-[1200] bg-[rgba(24,33,28,0.4)] transition-opacity duration-200 ease-editorial ${
              sheetOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            id="webgis-layer-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="webgis-sheet-heading"
            className={`fixed inset-x-0 bottom-0 z-[1210] max-h-[60dvh] overflow-y-auto border-t border-line bg-paper p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] transition-[opacity,transform] duration-300 ease-editorial ${
              sheetOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="webgis-sheet-heading" className="text-xl text-ink">
                Peta dasar dan lapisan
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Tutup panel lapisan"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong bg-surface text-ink transition-[background-color,transform] duration-200 ease-editorial hover:bg-surface-soft active:translate-y-px"
              >
                <X aria-hidden="true" size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              <BasemapOptions
                name="basemap-mobile"
                value={basemap}
                onChange={setBasemap}
              />
              <div className="border-t border-line pt-5">
                <LayerEmptyState />
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetSignal((value) => value + 1);
                  setSheetOpen(false);
                }}
                className="inline-flex min-h-11 w-full items-center justify-center border border-line-strong bg-surface px-4 text-sm font-semibold text-forest transition-[background-color,border-color,color,transform] duration-200 ease-editorial hover:bg-forest-soft active:translate-y-px"
              >
                Pusatkan ke Provinsi Aceh
              </button>
              <p className="text-xs text-ink-3">
                Sumber peta dasar: OpenStreetMap dan Esri.
              </p>
            </div>
          </div>
        </div>
    </section>
  );
}
