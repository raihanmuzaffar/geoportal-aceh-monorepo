/**
 * Unit Test: GeoJSON Normalization & Spatial Logic
 * Geoportal Aceh - Issue #35
 * Native Node.js Test Runner
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Helper mirror / tests for coordinate validation and normalization logic
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
  // If first coordinate is between 1 and 8 and second is between 90 and 100, they are reversed!
  if (c0 >= 1 && c0 <= 8 && c1 >= 90 && c1 <= 100) {
    return [c1, c0];
  }
  return [c0, c1];
}

function toLatLng(coordinates) {
  if (!coordinates || coordinates.length < 2) return [0, 0];
  return [coordinates[1], coordinates[0]];
}

function getPopulationDensityColor(density) {
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

function getDisasterSusceptibilityColor(level) {
  switch (level) {
    case 'Sangat Tinggi':
      return '#dc2626';
    case 'Tinggi':
      return '#ea580c';
    case 'Sedang':
      return '#facc15';
    case 'Rendah':
      return '#84cc16';
    case 'Sangat Rendah':
      return '#22c55e';
    default:
      return '#94a3b8';
  }
}

describe('GeoJSON Coordinate Validation & Normalization', () => {
  it('should accept valid Point coordinates [lng, lat]', () => {
    const validCoord = [95.32, 5.55];
    assert.strictEqual(isValidPointCoordinates(validCoord), true);
  });

  it('should reject invalid coordinates (null, undefined, non-numbers)', () => {
    assert.strictEqual(isValidPointCoordinates(null), false);
    assert.strictEqual(isValidPointCoordinates(undefined), false);
    assert.strictEqual(isValidPointCoordinates([]), false);
    assert.strictEqual(isValidPointCoordinates([95.32]), false);
    assert.strictEqual(isValidPointCoordinates(['95.32', '5.55']), false);
    assert.strictEqual(isValidPointCoordinates([NaN, 5.55]), false);
  });

  it('should preserve standard GeoJSON order [lng, lat] for Aceh (lng: ~95-98, lat: ~2-6)', () => {
    const coords = [95.3238, 5.5483]; // Banda Aceh [lng, lat]
    const normalized = normalizePointCoordinates(coords);
    assert.deepStrictEqual(normalized, [95.3238, 5.5483]);
  });

  it('should auto-detect and reverse inverted coordinates [lat, lng] -> [lng, lat]', () => {
    const inverted = [5.5483, 95.3238];
    const normalized = normalizePointCoordinates(inverted);
    assert.deepStrictEqual(normalized, [95.3238, 5.5483]);
  });

  it('should correctly convert GeoJSON [lng, lat] to Leaflet [lat, lng]', () => {
    const geoJsonCoord = [95.3238, 5.5483];
    const leafletCoord = toLatLng(geoJsonCoord);
    assert.strictEqual(leafletCoord[0], 5.5483);
    assert.strictEqual(leafletCoord[1], 95.3238);
  });
});

describe('Spatial Symbology & Choropleth Calculations', () => {
  it('should return correct choropleth color based on population density', () => {
    assert.strictEqual(getPopulationDensityColor(1200), '#800026');
    assert.strictEqual(getPopulationDensityColor(600), '#BD0026');
    assert.strictEqual(getPopulationDensityColor(300), '#E31A1C');
    assert.strictEqual(getPopulationDensityColor(150), '#FC4E2A');
    assert.strictEqual(getPopulationDensityColor(40), '#78c679');
  });

  it('should return correct color for disaster susceptibility levels', () => {
    assert.strictEqual(getDisasterSusceptibilityColor('Sangat Tinggi'), '#dc2626');
    assert.strictEqual(getDisasterSusceptibilityColor('Tinggi'), '#ea580c');
    assert.strictEqual(getDisasterSusceptibilityColor('Sedang'), '#facc15');
    assert.strictEqual(getDisasterSusceptibilityColor('Rendah'), '#84cc16');
    assert.strictEqual(getDisasterSusceptibilityColor('Sangat Rendah'), '#22c55e');
  });
});
