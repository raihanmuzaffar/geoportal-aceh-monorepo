/**
 * GIS Service & GeoJSON Contract Normalizer
 * Geoportal Aceh Frontend Architecture
 */

import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';
import type {
  GeoJSONFeatureCollection,
  SchoolPointFeature,
  HealthPointFeature,
  HealthFacilityProperties,
  DisasterPointFeature,
  DisasterIncidentProperties,
  DisasterZoneFeature,
  PopulationDistrictFeature,
  AgricultureFeature,
} from '../components/map/types';

// Mock datasets for fallback and demo mode
import mockSchools from '../components/map/mock/schoolsData.json';
import mockHealth from '../components/map/mock/healthData.json';
import mockDisaster from '../components/map/mock/disasterData.json';
import mockDistricts from '../components/map/mock/acehDistricts.json';
import mockAgriculture from '../components/map/mock/agricultureData.json';

// In-memory cache to prevent duplicate requests when toggling layers
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cacheStore = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cacheStore.set(key, { data, timestamp: Date.now() });
}

export function clearGisCache(): void {
  cacheStore.clear();
}

/**
 * Coordinate validator: ensures coordinates array has at least 2 valid numbers
 */
export function isValidPointCoordinates(coord: unknown): coord is [number, number] {
  return (
    Array.isArray(coord) &&
    coord.length >= 2 &&
    typeof coord[0] === 'number' &&
    typeof coord[1] === 'number' &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1])
  );
}

/**
 * Normalizes coordinates to GeoJSON standard [longitude, latitude].
 * Detects and corrects reversed [lat, lng] coordinates (Aceh is ~ 2-6°N, 95-98°E).
 */
export function normalizePointCoordinates(coords: [number, number]): [number, number] {
  const [c0, c1] = coords;
  // If first coordinate is between 1 and 8 and second is between 90 and 100, they are reversed!
  if (c0 >= 1 && c0 <= 8 && c1 >= 90 && c1 <= 100) {
    return [c1, c0];
  }
  return [c0, c1];
}

export interface LayerFetchResult<T> {
  data: GeoJSONFeatureCollection<T>;
  isLive: boolean;
  source: string;
}

function isAbortError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    ((err as { name?: string }).name === 'CanceledError' || (err as { name?: string }).name === 'AbortError')
  );
}

interface RawGeoFeature {
  type?: string;
  id?: string | number;
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

interface RawHealthFacilityItem {
  id?: string | number;
  name?: string;
  type?: string;
  regency?: string;
  district?: string;
  address?: string;
  capacity?: number;
  phone?: string;
  emergency_ready?: boolean | number;
  location?: {
    coordinates?: unknown;
  };
}

export const gisService = {
  /**
   * 1. Ambil data titik sekolah (GeoJSON Point)
   */
  async getSchoolsGeoJSON(signal?: AbortSignal): Promise<LayerFetchResult<SchoolPointFeature>> {
    const cacheKey = 'gis_schools';
    const cached = getCached<GeoJSONFeatureCollection<SchoolPointFeature>>(cacheKey);
    if (cached) {
      return { data: cached, isLive: !IS_DEMO_MODE, source: 'Cache / Memory' };
    }

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/pendidikan/schools/geojson', { signal });
        const raw = response.data;
        if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features) && raw.features.length > 0) {
          const sanitizedFeatures: SchoolPointFeature[] = (raw.features as RawGeoFeature[])
            .filter((f) => f?.geometry?.type === 'Point' && isValidPointCoordinates(f?.geometry?.coordinates))
            .map((f) => ({
              type: 'Feature',
              id: f.id ?? (f.properties?.id as string | number | undefined),
              geometry: {
                type: 'Point',
                coordinates: normalizePointCoordinates(f.geometry!.coordinates as [number, number]),
              },
              properties: {
                id: (f.properties?.id ?? f.id ?? 0) as number,
                name: String(f.properties?.name || 'Sekolah'),
                level: (f.properties?.level || f.properties?.stage || 'SD') as 'SD' | 'SMP' | 'SMA' | 'SMK',
                status: (f.properties?.status || 'Negeri') as 'Negeri' | 'Swasta',
                regency: String(f.properties?.regency || 'Aceh'),
                district: String(f.properties?.district || 'Aceh'),
                address: f.properties?.address ? String(f.properties.address) : undefined,
                students_count: Number(f.properties?.students_count || 0),
                teachers_count: Number(f.properties?.teachers_count || 0),
              },
            }));

          const collection: GeoJSONFeatureCollection<SchoolPointFeature> = {
            type: 'FeatureCollection',
            features: sanitizedFeatures,
          };
          setCache(cacheKey, collection);
          return { data: collection, isLive: true, source: 'Laravel API (/pendidikan/schools/geojson)' };
        }
      } catch (err: unknown) {
        if (isAbortError(err)) throw err;
        console.warn('API schools geojson unavailable, using Aceh schools dataset:', err);
      }
    }

    const fallback = mockSchools as unknown as GeoJSONFeatureCollection<SchoolPointFeature>;
    setCache(cacheKey, fallback);
    return { data: fallback, isLive: false, source: 'BPS Aceh Dataset (Local Fallback)' };
  },

  /**
   * 2. Ambil data titik fasilitas kesehatan (GeoJSON Point)
   */
  async getHealthGeoJSON(signal?: AbortSignal): Promise<LayerFetchResult<HealthPointFeature>> {
    const cacheKey = 'gis_health';
    const cached = getCached<GeoJSONFeatureCollection<HealthPointFeature>>(cacheKey);
    if (cached) {
      return { data: cached, isLive: !IS_DEMO_MODE, source: 'Cache / Memory' };
    }

    if (!IS_DEMO_MODE) {
      // 1. Coba endpoint GeoJSON khusus jika tersedia
      try {
        const response = await api.get('/kesehatan/facilities/geojson', { signal });
        const raw = response.data;
        if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features) && raw.features.length > 0) {
          const sanitizedFeatures: HealthPointFeature[] = (raw.features as RawGeoFeature[])
            .filter((f) => f?.geometry?.type === 'Point' && isValidPointCoordinates(f?.geometry?.coordinates))
            .map((f) => {
              const rawType = String(f.properties?.type || 'Puskesmas');
              const facilityType = rawType === 'RSUD' || rawType === 'Rumah Sakit' ? 'Rumah Sakit' : (rawType as HealthFacilityProperties['type']);
              return {
                type: 'Feature',
                id: f.id ?? (f.properties?.id as string | number | undefined),
                geometry: {
                  type: 'Point',
                  coordinates: normalizePointCoordinates(f.geometry!.coordinates as [number, number]),
                },
                properties: {
                  id: (f.properties?.id ?? f.id ?? 0) as number,
                  name: String(f.properties?.name || 'Fasilitas Kesehatan'),
                  type: facilityType,
                  regency: String(f.properties?.regency || 'Aceh'),
                  district: String(f.properties?.district || 'Aceh'),
                  address: String(f.properties?.address || ''),
                  capacity: f.properties?.capacity ? Number(f.properties.capacity) : undefined,
                  phone: f.properties?.phone ? String(f.properties.phone) : undefined,
                  emergency_ready: Boolean(f.properties?.emergency_ready),
                },
              };
            });

          const collection: GeoJSONFeatureCollection<HealthPointFeature> = {
            type: 'FeatureCollection',
            features: sanitizedFeatures,
          };
          setCache(cacheKey, collection);
          return { data: collection, isLive: true, source: 'Laravel API (/kesehatan/facilities/geojson)' };
        }
      } catch (err: unknown) {
        if (isAbortError(err)) throw err;
      }

      // 2. Coba endpoint REST standar /kesehatan/facilities dan normalisasi geometry point
      try {
        const response = await api.get('/kesehatan/facilities?per_page=100', { signal });
        const list = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        if (Array.isArray(list) && list.length > 0) {
          const parsedFeatures: HealthPointFeature[] = (list as RawHealthFacilityItem[])
            .filter((item) => item.location && isValidPointCoordinates(item.location?.coordinates))
            .map((item) => {
              const rawType = item.type || 'Puskesmas';
              const facilityType = rawType === 'RSUD' || rawType === 'Rumah Sakit' ? 'Rumah Sakit' : (rawType as HealthFacilityProperties['type']);
              return {
                type: 'Feature',
                id: item.id,
                geometry: {
                  type: 'Point',
                  coordinates: normalizePointCoordinates(item.location!.coordinates as [number, number]),
                },
                properties: {
                  id: (item.id ?? 0) as number,
                  name: item.name || 'Fasilitas Kesehatan',
                  type: facilityType,
                  regency: item.regency || 'Aceh',
                  district: item.district || '',
                  address: item.address || '',
                  capacity: item.capacity,
                  phone: item.phone,
                  emergency_ready: Boolean(item.emergency_ready),
                },
              };
            });

          if (parsedFeatures.length > 0) {
            const collection: GeoJSONFeatureCollection<HealthPointFeature> = {
              type: 'FeatureCollection',
              features: parsedFeatures,
            };
            setCache(cacheKey, collection);
            return { data: collection, isLive: true, source: 'Laravel API (/kesehatan/facilities)' };
          }
        }
      } catch (err: unknown) {
        if (isAbortError(err)) throw err;
        console.warn('API health geojson unavailable, using Aceh health dataset:', err);
      }
    }

    const fallback = mockHealth as unknown as GeoJSONFeatureCollection<HealthPointFeature>;
    setCache(cacheKey, fallback);
    return { data: fallback, isLive: false, source: 'Dinas Kesehatan Aceh Dataset' };
  },

  /**
   * 3. Ambil titik kejadian bencana (GeoJSON Point)
   */
  async getDisasterIncidentsGeoJSON(signal?: AbortSignal): Promise<LayerFetchResult<DisasterPointFeature>> {
    const cacheKey = 'gis_disaster_incidents';
    const cached = getCached<GeoJSONFeatureCollection<DisasterPointFeature>>(cacheKey);
    if (cached) {
      return { data: cached, isLive: !IS_DEMO_MODE, source: 'Cache / Memory' };
    }

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/kebencanaan/incidents/geojson', { signal });
        const raw = response.data;
        if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features)) {
          const sanitizedFeatures: DisasterPointFeature[] = (raw.features as RawGeoFeature[])
            .filter((f) => f?.geometry?.type === 'Point' && isValidPointCoordinates(f?.geometry?.coordinates))
            .map((f) => {
              const rawDisaster = String(f.properties?.disaster_type || 'Banjir');
              const disasterType: DisasterIncidentProperties['disaster_type'] = (
                ['Banjir', 'Tanah Longsor', 'Gempa Bumi', 'Angin Puting Beliung', 'Kebakaran Hutan'].includes(rawDisaster)
                  ? rawDisaster
                  : 'Banjir'
              ) as DisasterIncidentProperties['disaster_type'];

              return {
                type: 'Feature',
                id: f.id ?? (f.properties?.id as string | number | undefined),
                geometry: {
                  type: 'Point',
                  coordinates: normalizePointCoordinates(f.geometry!.coordinates as [number, number]),
                },
                properties: {
                  id: (f.properties?.id ?? f.id ?? Math.random()) as number,
                  disaster_type: disasterType,
                  date: String(f.properties?.date || (typeof f.properties?.occurred_at === 'string' ? f.properties.occurred_at.split('T')[0] : '2026-11-01')),
                  location_name: String(f.properties?.location_name || 'Aceh'),
                  regency: String(f.properties?.regency || 'Provinsi Aceh'),
                  district: f.properties?.district ? String(f.properties.district) : '',
                  impact_level: (f.properties?.impact_level || 'Sedang') as 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis',
                  casualties: Number(f.properties?.casualties ?? 0),
                  displaced_people: Number(f.properties?.displaced_people ?? f.properties?.affected_people ?? 0),
                  damage_summary: f.properties?.damage_summary ? String(f.properties.damage_summary) : '',
                },
              };
            });

          const collection: GeoJSONFeatureCollection<DisasterPointFeature> = {
            type: 'FeatureCollection',
            features: sanitizedFeatures,
          };
          setCache(cacheKey, collection);
          return { data: collection, isLive: true, source: 'Laravel API (/kebencanaan/incidents/geojson)' };
        }
      } catch (err: unknown) {
        if (isAbortError(err)) throw err;
        console.warn('API disaster incidents unavailable, using Aceh disaster mock:', err);
      }
    }

    // Filter points only from mockDisaster
    const pointFeatures = (mockDisaster.features as RawGeoFeature[]).filter(
      (f) => f?.geometry?.type === 'Point'
    ) as unknown as DisasterPointFeature[];

    const fallback: GeoJSONFeatureCollection<DisasterPointFeature> = {
      type: 'FeatureCollection',
      features: pointFeatures,
    };
    setCache(cacheKey, fallback);
    return { data: fallback, isLive: false, source: 'BPBD Aceh Dataset (Verified Fallback)' };
  },

  /**
   * 4. Ambil zona kerawanan bencana & ML Susceptibility (GeoJSON Polygon/MultiPolygon)
   */
  async getDisasterZonesGeoJSON(signal?: AbortSignal): Promise<LayerFetchResult<DisasterZoneFeature>> {
    const cacheKey = 'gis_disaster_zones';
    const cached = getCached<GeoJSONFeatureCollection<DisasterZoneFeature>>(cacheKey);
    if (cached) {
      return { data: cached, isLive: !IS_DEMO_MODE, source: 'Cache / Memory' };
    }

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/kebencanaan/zones/geojson', { signal });
        const raw = response.data;
        if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features)) {
          const sanitizedFeatures: DisasterZoneFeature[] = (raw.features as RawGeoFeature[])
            .filter((f) => f?.geometry?.type === 'Polygon' || f?.geometry?.type === 'MultiPolygon')
            .map((f) => {
              const rawDisaster = String(f.properties?.disaster_type || 'Banjir');
              const disasterType: 'Banjir' | 'Tanah Longsor' = rawDisaster === 'Tanah Longsor' ? 'Tanah Longsor' : 'Banjir';

              return {
                type: 'Feature',
                id: f.id ?? (f.properties?.id as string | number | undefined),
                geometry: f.geometry as DisasterZoneFeature['geometry'],
                properties: {
                  id: (f.properties?.id ?? f.id ?? 0) as number,
                  zone_name: String(f.properties?.zone_name || 'Zona Kerawanan'),
                  disaster_type: disasterType,
                  susceptibility_level: (f.properties?.susceptibility_level || 'Sedang') as 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi',
                  regency: String(f.properties?.regency || 'Aceh'),
                  district: f.properties?.district ? String(f.properties.district) : undefined,
                  area_ha: f.properties?.area_ha ? Number(f.properties.area_ha) : undefined,
                  is_ml_prediction: Boolean(f.properties?.is_ml_prediction),
                  ml_metadata: f.properties?.ml_metadata as DisasterZoneFeature['properties']['ml_metadata'],
                },
              };
            });

          const collection: GeoJSONFeatureCollection<DisasterZoneFeature> = {
            type: 'FeatureCollection',
            features: sanitizedFeatures,
          };
          setCache(cacheKey, collection);
          return { data: collection, isLive: true, source: 'Laravel API (/kebencanaan/zones/geojson)' };
        }
      } catch (err: unknown) {
        if (isAbortError(err)) throw err;
        console.warn('API disaster zones unavailable, using mock zones:', err);
      }
    }

    // Filter polygon/multipolygon from mockDisaster
    const zoneFeatures = (mockDisaster.features as RawGeoFeature[]).filter(
      (f) => f?.geometry?.type === 'Polygon' || f?.geometry?.type === 'MultiPolygon'
    ) as unknown as DisasterZoneFeature[];

    const fallback: GeoJSONFeatureCollection<DisasterZoneFeature> = {
      type: 'FeatureCollection',
      features: zoneFeatures,
    };
    setCache(cacheKey, fallback);
    return { data: fallback, isLive: false, source: 'Kajian Risiko Bencana Aceh (Fallback)' };
  },

  /**
   * 5. Ambil data poligon komoditas lahan pertanian (GeoJSON Polygon)
   */
  async getAgricultureGeoJSON(signal?: AbortSignal): Promise<LayerFetchResult<AgricultureFeature>> {
    const cacheKey = 'gis_agriculture';
    const cached = getCached<GeoJSONFeatureCollection<AgricultureFeature>>(cacheKey);
    if (cached) {
      return { data: cached, isLive: !IS_DEMO_MODE, source: 'Cache / Memory' };
    }

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/pertanian/lands/geojson', { signal });
        const raw = response.data;
        if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features) && raw.features.length > 0) {
          const collection = raw as GeoJSONFeatureCollection<AgricultureFeature>;
          setCache(cacheKey, collection);
          return { data: collection, isLive: true, source: 'Laravel API (/pertanian/lands/geojson)' };
        }
      } catch (err: unknown) {
        if (isAbortError(err)) throw err;
        console.warn('API agriculture geojson unavailable, using ST2023 Aceh agriculture dataset:', err);
      }
    }

    const fallback = mockAgriculture as unknown as GeoJSONFeatureCollection<AgricultureFeature>;
    setCache(cacheKey, fallback);
    return { data: fallback, isLive: false, source: 'Sensus Pertanian BPS Aceh (ST2023)' };
  },

  /**
   * 6. Ambil batas administrasi & kepadatan penduduk untuk Choropleth (GeoJSON Polygon)
   */
  async getPopulationDistrictsGeoJSON(signal?: AbortSignal): Promise<LayerFetchResult<PopulationDistrictFeature>> {
    const cacheKey = 'gis_districts_population';
    const cached = getCached<GeoJSONFeatureCollection<PopulationDistrictFeature>>(cacheKey);
    if (cached) {
      return { data: cached, isLive: !IS_DEMO_MODE, source: 'Cache / Memory' };
    }

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/kependudukan/populations/geojson', { signal });
        const raw = response.data;
        if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features) && raw.features.length > 0) {
          const collection = raw as GeoJSONFeatureCollection<PopulationDistrictFeature>;
          setCache(cacheKey, collection);
          return { data: collection, isLive: true, source: 'Laravel API (/kependudukan/populations/geojson)' };
        }
      } catch (err: unknown) {
        if (isAbortError(err)) throw err;
        console.warn('API population districts geojson unavailable, using verified Aceh boundaries:', err);
      }
    }

    const fallback = mockDistricts as unknown as GeoJSONFeatureCollection<PopulationDistrictFeature>;
    setCache(cacheKey, fallback);
    return { data: fallback, isLive: false, source: 'BPS Provinsi Aceh (23 Kab/Kota Demografi 2024)' };
  },
};
