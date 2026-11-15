import React, { useCallback } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import type { DisasterPointFeature, DisasterZoneFeature, DisasterZoneProperties, GeoJSONFeatureCollection } from './types';
import { getDisasterSusceptibilityColor, formatNumberId } from './utils/geoHelpers';

interface MapDisasterZonesProps {
  data?: GeoJSONFeatureCollection<DisasterZoneFeature> | GeoJSONFeatureCollection<DisasterPointFeature | DisasterZoneFeature>;
  showMlOnly?: boolean;
  onSelectZone?: (feature: DisasterZoneFeature) => void;
}

export const MapDisasterZones: React.FC<MapDisasterZonesProps> = ({
  data,
  showMlOnly = false,
  onSelectZone,
}) => {
  const map = useMap();

  const styleFeature = useCallback((feature?: Feature) => {
    const props = feature?.properties as DisasterZoneProperties | undefined;
    const level = props?.susceptibility_level || 'Sedang';
    const isMl = props?.is_ml_prediction || false;

    return {
      fillColor: getDisasterSusceptibilityColor(level),
      weight: isMl ? 2.5 : 1.5,
      opacity: 0.9,
      color: isMl ? '#7e22ce' : '#dc2626', // Ungu jika ML, Merah jika historis
      dashArray: isMl ? '4, 4' : '', // Garis putus-putus untuk estimasi prediktif ML
      fillOpacity: isMl ? 0.55 : 0.45,
    };
  }, []);

  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const props = feature.properties as DisasterZoneProperties;
      if (!props) return;
      const isMl = props.is_ml_prediction;
      const modelVer = props.ml_metadata?.model_version || 'v1.0.0';
      const modelAlg = props.ml_metadata?.algorithm || props.ml_metadata?.model_name || 'XGBoost';

      layer.bindTooltip(
        `<strong>${props.zone_name}</strong><br/>Tingkat: ${props.susceptibility_level} ${
          isMl ? '(Model ML)' : ''
        }`,
        { sticky: true }
      );

      // Pembeda visual tegas antara data historis vs prediksi ML sesuai pedoman
      const mlBadgeHtml = isMl
        ? `
        <div style="margin-bottom: 8px;">
          <span style="background-color: #f3e8ff; color: #6b21a8; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; display: inline-block; border: 1px solid #d8b4fe;">
            Model ML: ${modelVer} (${modelAlg})
          </span>
          <div style="font-size: 10px; color: #7e22ce; margin-top: 4px;">
            Prediksi Kerawanan Spasial Berbasis AI
            ${props.ml_metadata?.confidence_score ? ` &bull; Akurasi: <strong>${(props.ml_metadata.confidence_score * 100).toFixed(1)}%</strong>` : ''}
          </div>
        </div>
        `
        : `
        <div style="margin-bottom: 6px;">
          <span style="background-color: #fee2e2; color: #991b1b; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
            Data Historis Lapangan
          </span>
        </div>
        `;

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; color: #1e293b; min-width: 250px; max-height: 250px; overflow-y: auto;">
          ${mlBadgeHtml}
          
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 6px; line-height: 1.3;">
            ${props.zone_name}
          </div>

          <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Bahaya Bencana:</span>
              <strong style="color: #9f1239;">${props.disaster_type}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Tingkat Kerawanan:</span>
              <strong style="color: ${getDisasterSusceptibilityColor(props.susceptibility_level)};">
                ${props.susceptibility_level}
              </strong>
            </div>
            ${
              props.area_ha
                ? `
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Luas Zona Rawan:</span>
              <strong>${formatNumberId(props.area_ha)} Ha</strong>
            </div>`
                : ''
            }
          </div>

          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            Lokasi: ${props.district ? `${props.district}, ` : ''}${props.regency}
          </div>

          <div style="font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
            Klik poligon untuk perbesar (Fit Bounds)
          </div>
        </div>
      `;
      layer.bindPopup(popupHtml, { maxWidth: 300 });

      layer.on({
        mouseover: (e) => {
          const target = e.target as L.Path;
          target.setStyle({
            weight: 3.5,
            fillOpacity: 0.75,
          });
        },
        mouseout: (e) => {
          const target = e.target as L.Path;
          target.setStyle(styleFeature(feature));
        },
        click: (e) => {
          const target = e.target as L.Polygon;
          if (target.getBounds) {
            map.fitBounds(target.getBounds(), { padding: [20, 20], maxZoom: 13 });
          }
          if (onSelectZone) {
            onSelectZone(feature as unknown as DisasterZoneFeature);
          }
        },
      });
    },
    [map, onSelectZone, styleFeature]
  );

  if (!data || !data.features || data.features.length === 0) {
    return null;
  }

  // Filter hanya poligon dan sesuaikan dengan opsi showMlOnly
  const polygonFeatures = (data.features as Array<DisasterPointFeature | DisasterZoneFeature>).filter(
    (f): f is DisasterZoneFeature => {
      const isPolygon = f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon';
      if (!isPolygon) return false;
      const isMl = 'is_ml_prediction' in f.properties && Boolean(f.properties.is_ml_prediction);
      if (showMlOnly) return isMl;
      return true;
    }
  );

  const filteredData = {
    ...data,
    features: polygonFeatures,
  };

  return (
    <GeoJSON
      key={`disaster-zones-layer-${showMlOnly ? 'ml-only' : 'all'}`}
      data={filteredData as unknown as GeoJsonObject}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
};

export default MapDisasterZones;
