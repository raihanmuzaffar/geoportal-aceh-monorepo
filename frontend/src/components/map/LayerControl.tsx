import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  Users,
  Sprout,
  ShieldAlert,
  BrainCircuit,
  Eye,
  Info
} from 'lucide-react';
import type { LayerVisibilityState } from './types';

interface LayerControlProps {
  visibility: LayerVisibilityState;
  onToggleLayer: (key: keyof LayerVisibilityState) => void;
  isLoading?: boolean;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  visibility,
  onToggleLayer,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="relative z-[1000] text-left">
      {/* Trigger Button */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border text-xs sm:text-sm font-medium transition-all ${
            isExpanded
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-white/95 backdrop-blur-sm text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
          title="Atur Layer & Tampilan Peta"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Layer Spasial</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 ml-1" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowLegend((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg shadow-md border text-xs font-medium transition-all ${
            showLegend
              ? 'bg-blue-600 text-white border-blue-700'
              : 'bg-white/95 backdrop-blur-sm text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
          title="Lihat Legenda Peta"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Legenda</span>
        </button>
      </div>

      {/* Main Panel Filter Layer */}
      {isExpanded && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 p-4 z-[1010] animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" /> Kontrol Layer Spasial
            </h4>
            {isLoading && (
              <span className="text-[11px] text-amber-600 animate-pulse font-medium">
                Memuat data...
              </span>
            )}
          </div>

          {/* Group 1: Marker Titik Fasilitas */}
          <div className="mb-3">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1.5">
              Titik Fasilitas & Kejadian
            </span>
            <div className="space-y-1.5 pl-1">
              <label className="flex items-center justify-between p-1.5 hover:bg-slate-100/70 rounded-lg cursor-pointer transition-colors text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Pendidikan (Sekolah/PT)</span>
                </span>
                <input
                  type="checkbox"
                  checked={visibility.schools}
                  onChange={() => onToggleLayer('schools')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 hover:bg-slate-100/70 rounded-lg cursor-pointer transition-colors text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  <span>Kesehatan (RS/Puskesmas)</span>
                </span>
                <input
                  type="checkbox"
                  checked={visibility.healthFacilities}
                  onChange={() => onToggleLayer('healthFacilities')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 hover:bg-slate-100/70 rounded-lg cursor-pointer transition-colors text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Kejadian Bencana (Titik)</span>
                </span>
                <input
                  type="checkbox"
                  checked={visibility.disasterPoints}
                  onChange={() => onToggleLayer('disasterPoints')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Group 2: Poligon & Choropleth Wilayah */}
          <div className="mb-3 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1.5">
              Poligon Wilayah & Tematik
            </span>
            <div className="space-y-1.5 pl-1">
              <label className="flex items-center justify-between p-1.5 hover:bg-slate-100/70 rounded-lg cursor-pointer transition-colors text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Kependudukan (Choropleth)</span>
                </span>
                <input
                  type="checkbox"
                  checked={visibility.populationChoropleth}
                  onChange={() => onToggleLayer('populationChoropleth')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 hover:bg-slate-100/70 rounded-lg cursor-pointer transition-colors text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Lahan Pertanian</span>
                </span>
                <input
                  type="checkbox"
                  checked={visibility.agricultureLands}
                  onChange={() => onToggleLayer('agricultureLands')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 hover:bg-slate-100/70 rounded-lg cursor-pointer transition-colors text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Zona Rawan Bencana</span>
                </span>
                <input
                  type="checkbox"
                  checked={visibility.disasterZones}
                  onChange={() => onToggleLayer('disasterZones')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Group 3: Filter Khusus Machine Learning */}
          <div className="pt-2 border-t border-slate-100 bg-purple-50/60 -mx-4 -mb-4 p-3 rounded-b-xl">
            <span className="text-[10px] font-bold text-purple-700 tracking-wider uppercase block mb-1">
              Mode Analisis Machine Learning
            </span>
            <label className="flex items-center justify-between cursor-pointer text-xs text-purple-900 font-medium">
              <span className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>Hanya Tampilkan Prediksi ML</span>
              </span>
              <input
                type="checkbox"
                checked={visibility.showMlPredictionsOnly}
                onChange={() => onToggleLayer('showMlPredictionsOnly')}
                className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500 cursor-pointer"
              />
            </label>
            <p className="text-[10px] text-purple-600/80 mt-1 pl-6">
              Memfilter poligon zona rawan dan proyeksi berdasarkan model AI tervalidasi.
            </p>
          </div>
        </div>
      )}

      {/* Panel Legenda */}
      {showLegend && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 p-3 z-[1010] animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200 font-semibold text-slate-800">
            <span>Legenda Peta Spasial</span>
            <button
              onClick={() => setShowLegend(false)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>

          {/* Legenda Kependudukan */}
          {visibility.populationChoropleth && (
            <div className="mb-2.5">
              <span className="font-semibold text-slate-700 block mb-1 text-[11px]">
                Kepadatan Penduduk (jiwa/km²)
              </span>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#800026] inline-block border border-black/10"></span>
                  <span>&gt; 1.000 (Sangat Padat)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#BD0026] inline-block border border-black/10"></span>
                  <span>500 - 1.000</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#E31A1C] inline-block border border-black/10"></span>
                  <span>250 - 500</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#FC4E2A] inline-block border border-black/10"></span>
                  <span>100 - 250</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#FEB24C] inline-block border border-black/10"></span>
                  <span>&le; 100 (Jarang)</span>
                </div>
              </div>
            </div>
          )}

          {/* Legenda Kerawanan Bencana */}
          {visibility.disasterZones && (
            <div className="mb-2.5 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1 text-[11px]">
                Tingkat Kerawanan Bencana
              </span>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-red-600 inline-block"></span>
                  <span>Tinggi</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-orange-500 inline-block"></span>
                  <span>Sedang</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-lime-500 inline-block"></span>
                  <span>Rendah</span>
                </div>
              </div>
            </div>
          )}

          {/* Legenda Komoditas Pertanian */}
          {visibility.agricultureLands && (
            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1 text-[11px]">
                Komoditas Pertanian
              </span>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                  <span>Padi Sawah</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-amber-800 inline-block"></span>
                  <span>Kopi Gayo</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-emerald-800 inline-block"></span>
                  <span>Kelapa Sawit</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block"></span>
                  <span>Jagung</span>
                </div>
              </div>
            </div>
          )}

          {/* Jika tidak ada layer polygon yang aktif */}
          {!visibility.populationChoropleth &&
            !visibility.disasterZones &&
            !visibility.agricultureLands && (
              <p className="text-slate-400 italic text-[11px] py-1 text-center">
                Aktifkan layer poligon untuk melihat legenda warna.
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default LayerControl;

