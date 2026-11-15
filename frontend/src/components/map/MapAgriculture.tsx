import React, { useCallback } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import type { AgricultureFeature, AgricultureProperties, GeoJSONFeatureCollection } from './types';
import { getAgricultureCommodityColor, formatNumberId } from './utils/geoHelpers';

interface MapAgricultureProps {
  data?: GeoJSONFeatureCollection<AgricultureFeature>;
  selectedCommodity?: string;
  onSelectLand?: (feature: AgricultureFeature) => void;
}

export const MapAgriculture: React.FC<MapAgricultureProps> = ({
  data,
  selectedCommodity,
  onSelectLand,
}) => {
  const map = useMap();

  const styleFeature = useCallback(
    (feature?: Feature) => {
      const props = feature?.properties as AgricultureProperties | undefined;
      const commodity = props?.commodity;
      return {
        fillColor: commodity ? getAgricultureCommodityColor(commodity) : '#64748b',
        weight: 2,
        opacity: 0.9,
        color: '#ffffff',
        dashArray: '2',
        fillOpacity: 0.5,
      };
    },
    []
  );

  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const props = feature.properties as AgricultureProperties;
      if (!props) return;

      layer.bindTooltip(
        `<strong>${props.land_name}</strong><br/>Komoditas: ${props.commodity} (${formatNumberId(
          props.area_ha
        )} Ha)`,
        { sticky: true }
      );

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; color: #1e293b; min-width: 230px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #047857; margin-bottom: 2px;">
            Sektor Pertanian & Perkebunan
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
            ${props.land_name}
          </div>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Komoditas:</span>
              <strong style="color: #047857;">${props.commodity}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Tipe Lahan:</span>
              <strong>${props.land_use_type}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Luas Area:</span>
              <strong>${formatNumberId(props.area_ha)} Hektar</strong>
            </div>
            ${
              props.estimated_yield_ton
                ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Estimasi Hasil:</span>
              <strong>${formatNumberId(props.estimated_yield_ton)} Ton</strong>
            </div>`
                : ''
            }
            ${
              props.suitability_class
                ? `
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Kesesuaian Lahan:</span>
              <strong style="color: #15803d;">${props.suitability_class}</strong>
            </div>`
                : ''
            }
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
            Lokasi: ${props.district}, ${props.regency}
          </div>
          <div style="font-size: 10px; color: #94a3b8; text-align: center;">
            Klik untuk fokus ke area pertanian
          </div>
        </div>
      `;
      layer.bindPopup(popupHtml, { maxWidth: 290 });

      layer.on({
        mouseover: (e) => {
          const target = e.target as L.Path;
          target.setStyle({
            weight: 3,
            color: '#064e3b',
            fillOpacity: 0.8,
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
          if (onSelectLand) {
            onSelectLand(feature as unknown as AgricultureFeature);
          }
        },
      });
    },
    [map, onSelectLand, styleFeature]
  );

  if (!data || !data.features || data.features.length === 0) {
    return null;
  }

  // Filter komoditas jika dispesifikasikan
  const filteredFeatures = data.features.filter(
    (f) =>
      !selectedCommodity ||
      selectedCommodity === 'ALL' ||
      f.properties.commodity === selectedCommodity
  );

  const filteredData = {
    ...data,
    features: filteredFeatures,
  };

  return (
    <GeoJSON
      key={`agri-layer-${selectedCommodity || 'all'}`}
      data={filteredData as unknown as GeoJsonObject}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
};

export default MapAgriculture;
