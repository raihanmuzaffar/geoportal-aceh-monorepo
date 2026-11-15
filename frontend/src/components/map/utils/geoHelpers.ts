import type { SusceptibilityLevel, AgricultureCommodity } from '../types';

/**
 * Aturan emas PostGIS vs Leaflet:
 * - GeoJSON / PostGIS: [longitude, latitude]
 * - Leaflet: [latitude, longitude]
 */

// Pusat koordinat Provinsi Aceh dan zoom default
export const ACEH_CENTER: [number, number] = [4.695135, 96.749399];
export const DEFAULT_ZOOM = 8;

/**
 * Konversi [lng, lat] GeoJSON ke [lat, lng] Leaflet
 */
export function toLatLng(coordinates: [number, number]): [number, number] {
  if (!coordinates || coordinates.length < 2) return [0, 0];
  return [coordinates[1], coordinates[0]];
}

// Alias untuk kompatibilitas
export const toLeafletLatLng = toLatLng;

/**
 * Skala warna untuk Choropleth Kepadatan Penduduk (jiwa/km2).
 * Standar visualisasi demografi bertingkat:
 * - > 1000 : Merah Tua (#800026) - Sangat Padat
 * - 500 - 1000 : Merah Oranye (#BD0026) - Padat
 * - 250 - 500 : Oranye (#E31A1C) - Sedang
 * - 100 - 250 : Kuning Keemasan (#FC4E2A) - Agak Jarang
 * - <= 100 : Hijau Muda / Kuning Cerah (#FEB24C / #78c679) - Jarang
 */
export function getPopulationDensityColor(density: number): string {
  return density > 1000
    ? '#800026'
    : density > 500
    ? '#BD0026'
    : density > 250
    ? '#E31A1C'
    : density > 100
    ? '#FC4E2A'
    : density > 50
    ? '#FD8D3C'
    : '#78c679';
}

/**
 * Skala warna untuk Zona Kerawanan Bencana (Susceptibility)
 */
export function getDisasterSusceptibilityColor(level: SusceptibilityLevel): string {
  switch (level) {
    case 'Sangat Tinggi':
      return '#dc2626'; // Red-600
    case 'Tinggi':
      return '#ea580c'; // Orange-600
    case 'Sedang':
      return '#facc15'; // Yellow-400
    case 'Rendah':
      return '#84cc16'; // Lime-500
    case 'Sangat Rendah':
      return '#22c55e'; // Green-500
    default:
      return '#94a3b8'; // Slate-400
  }
}

/**
 * Skala warna untuk Poligon Komoditas Pertanian
 */
export function getAgricultureCommodityColor(commodity: AgricultureCommodity): string {
  switch (commodity) {
    case 'Padi':
      return '#10b981'; // Emerald-500
    case 'Kelapa Sawit':
      return '#047857'; // Emerald-700
    case 'Kopi Gayo':
      return '#854d0e'; // Amber-800
    case 'Kakao':
      return '#a16207'; // Yellow-700
    case 'Jagung':
      return '#eab308'; // Yellow-500
    case 'Karet':
      return '#065f46'; // Teal-800
    default:
      return '#64748b'; // Slate-500
  }
}

/**
 * Format angka ribuan dengan pemisah titik (standar Indonesia)
 */
export function formatNumberId(value?: number): string {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('id-ID').format(value);
}
