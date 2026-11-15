import React, { useCallback } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import type { PopulationDistrictFeature, PopulationDistrictProperties, GeoJSONFeatureCollection } from './types';
import { getPopulationDensityColor, formatNumberId } from './utils/geoHelpers';

interface MapPopulationProps {
  data?: GeoJSONFeatureCollection<PopulationDistrictFeature>;
  selectedRegency?: string;
  onSelectDistrict?: (feature: PopulationDistrictFeature) => void;
}

export const MapPopulation: React.FC<MapPopulationProps> = ({
  data,
  selectedRegency,
  onSelectDistrict,
}) => {
  const map = useMap();

  // Style untuk setiap feature poligon
  const styleFeature = useCallback(
    (feature?: Feature) => {
      const props = feature?.properties as PopulationDistrictProperties | undefined;
      const density = props?.density_per_km2 || 0;
      const isSelected =
        selectedRegency && props?.regency_name === selectedRegency;

      return {
        fillColor: getPopulationDensityColor(density),
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        color: isSelected ? '#1e293b' : '#ffffff',
        dashArray: isSelected ? '' : '3',
        fillOpacity: isSelected ? 0.85 : 0.65,
      };
    },
    [selectedRegency]
  );

  // Event handler untuk interaksi per wilayah
  const onEachFeature = useCallback(
    (feature: Feature, layer: L.Layer) => {
      const props = feature.properties as PopulationDistrictProperties;
      if (!props) return;

      // Tooltip sederhana saat hover
      layer.bindTooltip(
        `<strong>${props.regency_name}</strong><br/>Kepadatan: ${formatNumberId(
          props.density_per_km2
        )} jiwa/km²`,
        { sticky: true, className: 'leaflet-custom-tooltip' }
      );

      // Popup detail saat diklik
      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; color: #1e293b; min-width: 220px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #4338ca; margin-bottom: 2px;">
            Demografi & Kependudukan
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
            ${props.regency_name}
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Total Penduduk:</span>
              <strong>${formatNumberId(props.total_population)} jiwa</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Luas Wilayah:</span>
              <strong>${formatNumberId(props.area_km2)} km²</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Kepadatan:</span>
              <strong style="color: #dc2626;">${formatNumberId(props.density_per_km2)} jiwa/km²</strong>
            </div>
            ${
              props.growth_rate_pct !== undefined
                ? `
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Laju Pertumbuhan:</span>
              <strong style="color: #059669;">+${props.growth_rate_pct}% / thn</strong>
            </div>`
                : ''
            }
          </div>
          <div style="font-size: 10px; color: #94a3b8; text-align: center;">
            Klik wilayah untuk perbesar (Fit Bounds)
          </div>
        </div>
      `;
      layer.bindPopup(popupHtml, { maxWidth: 280 });

      // Interaksi mouseover, mouseout, dan click
      layer.on({
        mouseover: (e) => {
          const target = e.target as L.Path;
          target.setStyle({
            weight: 3,
            color: '#0f172a',
            dashArray: '',
            fillOpacity: 0.85,
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            target.bringToFront();
          }
        },
        mouseout: (e) => {
          const target = e.target as L.Path;
          target.setStyle(styleFeature(feature));
        },
        click: (e) => {
          const target = e.target as L.Polygon;
          if (target.getBounds) {
            map.fitBounds(target.getBounds(), { padding: [20, 20], maxZoom: 12 });
          }
          if (onSelectDistrict) {
            onSelectDistrict(feature as unknown as PopulationDistrictFeature);
          }
        },
      });
    },
    [map, onSelectDistrict, styleFeature]
  );

  if (!data || !data.features || data.features.length === 0) {
    return null;
  }

  return (
    <GeoJSON
      key={`choropleth-layer-${selectedRegency || 'all'}`}
      data={data as unknown as GeoJsonObject}
      style={styleFeature}
      onEachFeature={onEachFeature}
    />
  );
};

export default MapPopulation;
