// Tipe data GeoJSON standar dan spesifik untuk Geoportal Aceh
export type GeoJSONGeometryType = 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon';

export interface GeoJSONGeometry<T = [number, number] | [number, number][] | [number, number][][] | [number, number][][][]> {
  type: GeoJSONGeometryType;
  coordinates: T;
}

export interface GeoJSONFeature<G = GeoJSONGeometry, P = Record<string, unknown>> {
  type: 'Feature';
  id?: string | number;
  geometry: G;
  properties: P;
}

export interface GeoJSONFeatureCollection<F = GeoJSONFeature> {
  type: 'FeatureCollection';
  features: F[];
}

// 1. Pendidikan
export type SchoolLevel = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'Perguruan Tinggi';

export interface SchoolProperties {
  id: string | number;
  name: string;
  npsn?: string;
  level: SchoolLevel;
  status: 'Negeri' | 'Swasta';
  district: string;
  regency: string;
  students_count?: number;
  teachers_count?: number;
  address?: string;
}

export type SchoolPointFeature = GeoJSONFeature<
  GeoJSONGeometry<[number, number]>,
  SchoolProperties
>;

// 2. Kesehatan
export type HealthFacilityType = 'Rumah Sakit' | 'Puskesmas' | 'Klinik' | 'Apotek' | 'Posyandu';

export interface HealthFacilityProperties {
  id: string | number;
  name: string;
  type: HealthFacilityType;
  regency: string;
  district: string;
  address: string;
  capacity?: number;
  phone?: string;
  emergency_ready?: boolean;
}

export type HealthPointFeature = GeoJSONFeature<
  GeoJSONGeometry<[number, number]>,
  HealthFacilityProperties
>;

// 3. Kebencanaan - Titik Kejadian
export type DisasterType = 'Banjir' | 'Tanah Longsor' | 'Gempa Bumi' | 'Angin Puting Beliung' | 'Kebakaran Hutan';
export type ImpactLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';

export interface DisasterIncidentProperties {
  id: string | number;
  disaster_type: DisasterType;
  date: string;
  location_name: string;
  regency: string;
  district?: string;
  impact_level: ImpactLevel;
  casualties?: number;
  displaced_people?: number;
  damage_summary?: string;
}

export type DisasterPointFeature = GeoJSONFeature<
  GeoJSONGeometry<[number, number]>,
  DisasterIncidentProperties
>;

// 4. Kebencanaan - Poligon Zona Kerawanan & ML Susceptibility
export type SusceptibilityLevel = 'Sangat Rendah' | 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';

export interface DisasterZoneProperties {
  id: string | number;
  zone_name: string;
  disaster_type: 'Banjir' | 'Tanah Longsor';
  susceptibility_level: SusceptibilityLevel;
  regency: string;
  district?: string;
  area_ha?: number;
  is_ml_prediction: boolean;
  ml_metadata?: {
    model_name: string;
    model_version: string;
    prediction_date: string;
    confidence_score?: number;
    algorithm?: string;
  };
}

export type DisasterZoneFeature = GeoJSONFeature<
  GeoJSONGeometry<[number, number][][] | [number, number][][][]>,
  DisasterZoneProperties
>;

// 5. Kependudukan - Poligon Choropleth
export interface PopulationDistrictProperties {
  id: string | number;
  regency_name: string;
  district_name: string;
  total_population: number;
  male_population: number;
  female_population: number;
  area_km2: number;
  density_per_km2: number; // Kepadatan jiwa/km2
  growth_rate_pct?: number;
  is_ml_forecast?: boolean;
  ml_forecast_year?: number;
}

export type PopulationDistrictFeature = GeoJSONFeature<
  GeoJSONGeometry<[number, number][][] | [number, number][][][]>,
  PopulationDistrictProperties
>;

// 6. Pertanian - Poligon Lahan Pertanian
export type AgricultureCommodity = 'Padi' | 'Kelapa Sawit' | 'Kopi Gayo' | 'Kakao' | 'Jagung' | 'Karet';

export interface AgricultureProperties {
  id: string | number;
  land_name: string;
  commodity: AgricultureCommodity;
  land_use_type: 'Sawah Irigasi' | 'Sawah Tadah Hujan' | 'Perkebunan Rakyat' | 'Perkebunan Besar' | 'Ladang/Tegalan';
  area_ha: number;
  regency: string;
  district: string;
  estimated_yield_ton?: number;
  soil_type?: string;
  suitability_class?: 'S1 (Sangat Sesuai)' | 'S2 (Cukup Sesuai)' | 'S3 (Sesuai Marjinal)' | 'N (Tidak Sesuai)';
}

export type AgricultureFeature = GeoJSONFeature<
  GeoJSONGeometry<[number, number][][] | [number, number][][][]>,
  AgricultureProperties
>;

// --- Basemap & Layer Control Types ---
export type BasemapId = 'osm' | 'satellite' | 'dark';
export type BasemapType = BasemapId;

export interface BasemapConfig {
  id: BasemapId;
  name: string;
  url: string;
  attribution: string;
  maxZoom?: number;
}

export const BASEMAPS: Record<BasemapType, { name: string; url: string; attribution: string; maxZoom?: number }> = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  satellite: {
    name: 'Satelit (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  },
  dark: {
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    maxZoom: 19
  }
};

export const BASEMAP_CONFIGS = BASEMAPS;

export interface LayerVisibilityState {
  // Marker layers
  schools: boolean;
  healthFacilities: boolean;
  disasterPoints: boolean;
  // Polygon layers
  populationChoropleth: boolean;
  agricultureLands: boolean;
  disasterZones: boolean;
  // ML Layer toggle
  showMlPredictionsOnly: boolean;
}

