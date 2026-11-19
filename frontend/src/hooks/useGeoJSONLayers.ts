import { useState, useEffect, useRef, useCallback } from 'react';
import { gisService, type LayerFetchResult } from '../services/gisService';
import type {
  GeoJSONFeatureCollection,
  SchoolPointFeature,
  HealthPointFeature,
  DisasterPointFeature,
  DisasterZoneFeature,
  PopulationDistrictFeature,
  AgricultureFeature,
  LayerVisibilityState,
} from '../components/map/types';

export interface LayerMetadata {
  isLive: boolean;
  source: string;
  count: number;
}

export interface GeoJSONLayersState {
  schools: GeoJSONFeatureCollection<SchoolPointFeature> | null;
  health: GeoJSONFeatureCollection<HealthPointFeature> | null;
  disasterPoints: GeoJSONFeatureCollection<DisasterPointFeature> | null;
  disasterZones: GeoJSONFeatureCollection<DisasterZoneFeature> | null;
  population: GeoJSONFeatureCollection<PopulationDistrictFeature> | null;
  agriculture: GeoJSONFeatureCollection<AgricultureFeature> | null;
}

export interface UseGeoJSONLayersReturn {
  layers: GeoJSONLayersState;
  metadata: Record<string, LayerMetadata>;
  loading: Record<string, boolean>;
  isAnyLoading: boolean;
  errors: Record<string, string | null>;
  refetchLayer: (layerKey: keyof GeoJSONLayersState) => Promise<void>;
  refetchAll: () => Promise<void>;
}

export function useGeoJSONLayers(visibility?: LayerVisibilityState): UseGeoJSONLayersReturn {
  const [layers, setLayers] = useState<GeoJSONLayersState>({
    schools: null,
    health: null,
    disasterPoints: null,
    disasterZones: null,
    population: null,
    agriculture: null,
  });

  const [metadata, setMetadata] = useState<Record<string, LayerMetadata>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // AbortController refs to allow request cancellation on unmount
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const fetchLayer = useCallback(
    async <T>(
      layerKey: keyof GeoJSONLayersState,
      fetcher: (signal?: AbortSignal) => Promise<LayerFetchResult<T>>,
      setter: (data: GeoJSONFeatureCollection<T>) => void
    ) => {
      // Cancel previous pending request for this layer if any
      const existingCtrl = abortControllersRef.current.get(layerKey);
      if (existingCtrl) {
        existingCtrl.abort();
      }

      const controller = new AbortController();
      abortControllersRef.current.set(layerKey, controller);

      setLoading((prev) => ({ ...prev, [layerKey]: true }));
      setErrors((prev) => ({ ...prev, [layerKey]: null }));

      try {
        const result = await fetcher(controller.signal);
        setter(result.data);
        setMetadata((prev) => ({
          ...prev,
          [layerKey]: {
            isLive: result.isLive,
            source: result.source,
            count: result.data.features?.length || 0,
          },
        }));
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError' || (err as { name?: string })?.name === 'CanceledError') {
          return; // Ignore canceled requests
        }
        const msg = err instanceof Error ? err.message : 'Gagal memuat layer spasial';
        setErrors((prev) => ({ ...prev, [layerKey]: msg }));
      } finally {
        setLoading((prev) => ({ ...prev, [layerKey]: false }));
      }
    },
    []
  );

  const fetchSchools = useCallback(
    () =>
      fetchLayer(
        'schools',
        (sig) => gisService.getSchoolsGeoJSON(sig),
        (data) => setLayers((prev) => ({ ...prev, schools: data }))
      ),
    [fetchLayer]
  );

  const fetchHealth = useCallback(
    () =>
      fetchLayer(
        'health',
        (sig) => gisService.getHealthGeoJSON(sig),
        (data) => setLayers((prev) => ({ ...prev, health: data }))
      ),
    [fetchLayer]
  );

  const fetchDisasterPoints = useCallback(
    () =>
      fetchLayer(
        'disasterPoints',
        (sig) => gisService.getDisasterIncidentsGeoJSON(sig),
        (data) => setLayers((prev) => ({ ...prev, disasterPoints: data }))
      ),
    [fetchLayer]
  );

  const fetchDisasterZones = useCallback(
    () =>
      fetchLayer(
        'disasterZones',
        (sig) => gisService.getDisasterZonesGeoJSON(sig),
        (data) => setLayers((prev) => ({ ...prev, disasterZones: data }))
      ),
    [fetchLayer]
  );

  const fetchPopulation = useCallback(
    () =>
      fetchLayer(
        'population',
        (sig) => gisService.getPopulationDistrictsGeoJSON(sig),
        (data) => setLayers((prev) => ({ ...prev, population: data }))
      ),
    [fetchLayer]
  );

  const fetchAgriculture = useCallback(
    () =>
      fetchLayer(
        'agriculture',
        (sig) => gisService.getAgricultureGeoJSON(sig),
        (data) => setLayers((prev) => ({ ...prev, agriculture: data }))
      ),
    [fetchLayer]
  );

  const refetchLayer = useCallback(
    async (layerKey: keyof GeoJSONLayersState) => {
      switch (layerKey) {
        case 'schools':
          return fetchSchools();
        case 'health':
          return fetchHealth();
        case 'disasterPoints':
          return fetchDisasterPoints();
        case 'disasterZones':
          return fetchDisasterZones();
        case 'population':
          return fetchPopulation();
        case 'agriculture':
          return fetchAgriculture();
      }
    },
    [fetchSchools, fetchHealth, fetchDisasterPoints, fetchDisasterZones, fetchPopulation, fetchAgriculture]
  );

  const refetchAll = useCallback(async () => {
    await Promise.allSettled([
      fetchSchools(),
      fetchHealth(),
      fetchDisasterPoints(),
      fetchDisasterZones(),
      fetchPopulation(),
      fetchAgriculture(),
    ]);
  }, [fetchSchools, fetchHealth, fetchDisasterPoints, fetchDisasterZones, fetchPopulation, fetchAgriculture]);

  // Load visible layers initially or when visibility changes
  useEffect(() => {
    if (!visibility) {
      // Default: fetch all if visibility is not specified
      refetchAll();
      return;
    }

    if (visibility.schools && !layers.schools) fetchSchools();
    if (visibility.healthFacilities && !layers.health) fetchHealth();
    if (visibility.disasterPoints && !layers.disasterPoints) fetchDisasterPoints();
    if (visibility.disasterZones && !layers.disasterZones) fetchDisasterZones();
    if (visibility.populationChoropleth && !layers.population) fetchPopulation();
    if (visibility.agricultureLands && !layers.agriculture) fetchAgriculture();
  }, [
    visibility,
    layers.schools,
    layers.health,
    layers.disasterPoints,
    layers.disasterZones,
    layers.population,
    layers.agriculture,
    fetchSchools,
    fetchHealth,
    fetchDisasterPoints,
    fetchDisasterZones,
    fetchPopulation,
    fetchAgriculture,
    refetchAll,
  ]);

  // Cleanup on unmount: abort all ongoing requests
  useEffect(() => {
    const controllers = abortControllersRef.current;
    return () => {
      controllers.forEach((ctrl) => ctrl.abort());
      controllers.clear();
    };
  }, []);

  const isAnyLoading = Object.values(loading).some(Boolean);

  return {
    layers,
    metadata,
    loading,
    isAnyLoading,
    errors,
    refetchLayer,
    refetchAll,
  };
}
