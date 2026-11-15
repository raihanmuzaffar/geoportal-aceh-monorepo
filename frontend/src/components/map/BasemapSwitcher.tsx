import React from 'react';
import { Layers, Map as MapIcon, Globe, Moon } from 'lucide-react';
import type { BasemapType } from './types';
import { BASEMAPS } from './types';

interface BasemapSwitcherProps {
  activeBasemap: BasemapType;
  onChangeBasemap: (id: BasemapType) => void;
}

export const BasemapSwitcher: React.FC<BasemapSwitcherProps> = ({
  activeBasemap,
  onChangeBasemap,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left z-[1000]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-sm text-slate-700 hover:text-slate-900 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-all font-medium text-xs sm:text-sm"
        title="Ganti Peta Dasar (Basemap)"
      >
        <Layers className="w-4 h-4 text-emerald-600" />
        <span className="hidden sm:inline">Basemap:</span>
        <span className="font-semibold text-emerald-700">
          {BASEMAPS[activeBasemap].name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-[1010] animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Pilih Peta Dasar
          </div>

          <button
            type="button"
            onClick={() => {
              onChangeBasemap('osm');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
              activeBasemap === 'osm'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-4 h-4 text-emerald-500" />
            <span>OpenStreetMap</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeBasemap('satellite');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
              activeBasemap === 'satellite'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Satelit (Esri)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeBasemap('dark');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
              activeBasemap === 'dark'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Moon className="w-4 h-4 text-slate-800" />
            <span>CartoDB Dark</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BasemapSwitcher;
