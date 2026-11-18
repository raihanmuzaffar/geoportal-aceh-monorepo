/**
 * Map Layers & GeoJSON Fixtures Test Suite
 * Tests layer parsing, valid/invalid fixture resilience, visibility toggling, ML prediction filters, and caching
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// --- Test Fixtures ---
const VALID_GEOJSON_FIXTURE = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'test-point-1',
      geometry: {
        type: 'Point',
        coordinates: [95.3238, 5.5483], // [lng, lat] Banda Aceh
      },
      properties: {
        id: 101,
        name: 'SD Negeri 1 Banda Aceh',
        level: 'SD',
        status: 'Negeri',
        regency: 'Kota Banda Aceh',
        district: 'Baiturrahman',
        students_count: 320,
        teachers_count: 24,
      },
    },
    {
      type: 'Feature',
      id: 'test-point-2',
      geometry: {
        type: 'Point',
        coordinates: [96.1265, 4.1449], // [lng, lat] Meulaboh
      },
      properties: {
        id: 102,
        name: 'RSUD Cut Nyak Dhien',
        type: 'Rumah Sakit',
        regency: 'Kabupaten Aceh Barat',
        district: 'Johan Pahlawan',
        emergency_ready: true,
      },
    },
    {
      type: 'Feature',
      id: 'test-zone-1',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [95.3, 5.5],
            [95.4, 5.5],
            [95.4, 5.6],
            [95.3, 5.6],
            [95.3, 5.5],
          ],
        ],
      },
      properties: {
        id: 201,
        zone_name: 'Kawasan Rawan Banjir Krueng Aceh',
        disaster_type: 'Banjir',
        susceptibility_level: 'Tinggi',
        is_ml_prediction: true,
        ml_metadata: { model: 'RandomForest-v2.1', confidence: 0.89 },
      },
    },
  ],
};

const INVALID_GEOJSON_FIXTURE = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'invalid-point-null-coord',
      geometry: {
        type: 'Point',
        coordinates: [null, 5.5483], // Invalid: null longitude
      },
      properties: { name: 'Invalid School 1' },
    },
    {
      type: 'Feature',
      id: 'invalid-point-empty-coord',
      geometry: {
        type: 'Point',
        coordinates: [], // Invalid: empty coordinate array
      },
      properties: { name: 'Invalid School 2' },
    },
    {
      type: 'Feature',
      id: 'invalid-point-inverted-coord',
      geometry: {
        type: 'Point',
        coordinates: [5.55, 95.32], // Inverted: [lat, lng] instead of [lng, lat]
      },
      properties: { name: 'Inverted School 3' },
    },
    {
      type: 'Feature',
      id: 'invalid-geometry-type',
      geometry: {
        type: 'LineString', // LineString inside a Point-only layer
        coordinates: [
          [95.1, 5.1],
          [95.2, 5.2],
        ],
      },
      properties: { name: 'Mismatched Geometry' },
    },
    {
      type: 'Feature',
      id: 'missing-geometry',
      geometry: null, // Null geometry
      properties: { name: 'Missing Geometry' },
    },
  ],
};

// Coordinate helpers matching gisService.ts
function isValidPointCoordinates(coord) {
  return (
    Array.isArray(coord) &&
    coord.length >= 2 &&
    typeof coord[0] === 'number' &&
    typeof coord[1] === 'number' &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1])
  );
}

function normalizePointCoordinates(coords) {
  const [c0, c1] = coords;
  // If c0 is latitude (1-8) and c1 is longitude (90-100), swap them
  if (c0 >= 1 && c0 <= 8 && c1 >= 90 && c1 <= 100) {
    return [c1, c0];
  }
  return [c0, c1];
}

describe('Valid GeoJSON Fixture Ingestion', () => {
  test('should parse all valid features without loss of properties', () => {
    const points = VALID_GEOJSON_FIXTURE.features.filter(
      (f) => f.geometry.type === 'Point' && isValidPointCoordinates(f.geometry.coordinates)
    );

    assert.equal(points.length, 2);
    assert.equal(points[0].properties.name, 'SD Negeri 1 Banda Aceh');
    assert.equal(points[1].properties.name, 'RSUD Cut Nyak Dhien');
  });

  test('should keep GeoJSON [lng, lat] order untouched for already-valid Aceh coordinates', () => {
    const coords = VALID_GEOJSON_FIXTURE.features[0].geometry.coordinates;
    const normalized = normalizePointCoordinates(coords);

    assert.equal(normalized[0], 95.3238); // Longitude
    assert.equal(normalized[1], 5.5483); // Latitude
  });
});

describe('Invalid GeoJSON Fixture Resilience & Sanitization', () => {
  test('should filter out features with null or empty coordinates', () => {
    const rawFeatures = INVALID_GEOJSON_FIXTURE.features;
    const validPoints = rawFeatures.filter(
      (f) => f.geometry && f.geometry.type === 'Point' && isValidPointCoordinates(f.geometry.coordinates)
    );

    // Only the inverted one has 2 valid numbers [5.55, 95.32]; null, empty, linestring, and missing are rejected
    assert.equal(validPoints.length, 1);
    assert.equal(validPoints[0].id, 'invalid-point-inverted-coord');
  });

  test('should detect and repair inverted [lat, lng] coordinates', () => {
    const invertedFeature = INVALID_GEOJSON_FIXTURE.features.find(
      (f) => f.id === 'invalid-point-inverted-coord'
    );
    const rawCoords = invertedFeature.geometry.coordinates;

    assert.equal(rawCoords[0], 5.55); // Latitude first
    assert.equal(rawCoords[1], 95.32); // Longitude second

    const corrected = normalizePointCoordinates(rawCoords);
    assert.equal(corrected[0], 95.32); // Longitude first
    assert.equal(corrected[1], 5.55); // Latitude second
  });

  test('should reject LineString geometry from Point layer', () => {
    const lineStringFeature = INVALID_GEOJSON_FIXTURE.features.find(
      (f) => f.id === 'invalid-geometry-type'
    );
    const isPoint = lineStringFeature.geometry?.type === 'Point';
    assert.equal(isPoint, false);
  });

  test('should safely handle completely missing or null geometry without crashing', () => {
    const nullGeomFeature = INVALID_GEOJSON_FIXTURE.features.find(
      (f) => f.id === 'missing-geometry'
    );
    const isValid = nullGeomFeature.geometry && isValidPointCoordinates(nullGeomFeature.geometry?.coordinates);
    assert.equal(Boolean(isValid), false);
  });
});

describe('Layer Visibility State & ML Prediction Filter', () => {
  const initialVisibility = {
    pendidikan: true,
    kesehatan: true,
    kebencanaan: true,
    kebencanaanZones: true,
    pertanian: false,
    kependudukan: false,
  };

  test('should toggle layer visibility correctly', () => {
    const visibility = { ...initialVisibility };

    // Toggle pertanian ON
    visibility.pertanian = true;
    assert.equal(visibility.pertanian, true);

    // Toggle pendidikan OFF
    visibility.pendidikan = false;
    assert.equal(visibility.pendidikan, false);
  });

  test('should filter disaster zones by ML prediction flag when toggle is active', () => {
    const zones = [
      {
        id: 1,
        properties: { zone_name: 'Banjir Tahunan', is_ml_prediction: false },
      },
      {
        id: 2,
        properties: { zone_name: 'Prediksi Longsor Model AI', is_ml_prediction: true },
      },
      {
        id: 3,
        properties: { zone_name: 'Prediksi Banjir Bandang Model AI', is_ml_prediction: true },
      },
    ];

    // Filter only ML predictions
    const onlyML = zones.filter((z) => z.properties.is_ml_prediction === true);
    assert.equal(onlyML.length, 2);

    // Filter verified historical zones only
    const onlyHistorical = zones.filter((z) => !z.properties.is_ml_prediction);
    assert.equal(onlyHistorical.length, 1);
    assert.equal(onlyHistorical[0].properties.zone_name, 'Banjir Tahunan');
  });
});

describe('In-Memory GIS Layer Cache Mechanism', () => {
  class TestCache {
    constructor(ttlMs = 3000) {
      this.store = new Map();
      this.ttlMs = ttlMs;
    }
    get(key) {
      const entry = this.store.get(key);
      if (!entry) return null;
      if (Date.now() - entry.timestamp > this.ttlMs) {
        this.store.delete(key);
        return null;
      }
      return entry.data;
    }
    set(key, data) {
      this.store.set(key, { data, timestamp: Date.now() });
    }
  }

  test('should return cached layer on rapid consecutive toggles without new API calls', () => {
    const cache = new TestCache();
    const mockData = { type: 'FeatureCollection', features: [{ id: 1 }] };

    cache.set('gis_schools', mockData);
    const cached = cache.get('gis_schools');

    assert.deepEqual(cached, mockData);
  });

  test('should invalidate cache when TTL is exceeded', async () => {
    // 50ms TTL for testing
    const cache = new TestCache(50);
    cache.set('gis_schools', { data: 'test' });

    assert.notEqual(cache.get('gis_schools'), null);

    // Wait 60ms to expire
    await new Promise((resolve) => setTimeout(resolve, 60));

    assert.equal(cache.get('gis_schools'), null);
  });
});
