import React, { useMemo } from 'react';

import { LEAFLET_CSS_URL, LEAFLET_JS_URL, TILE_ATTRIBUTION, TILE_URL } from '@/lib/constants';

type Props = {
  mapRef: React.RefObject<any>;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  marker: { latitude: number; longitude: number } | null;
  resultLabel: string | null;
  onRegionChange: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default function AddressMap({ region, marker, resultLabel }: Props) {
  const html = useMemo(() => {
    const center = marker ?? { latitude: region.latitude, longitude: region.longitude };
    const label = resultLabel ? escapeHtml(resultLabel) : 'Direccion';
    const zoom = marker ? 16 : 12;
    const shouldRenderMarker = Boolean(marker);

    return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="${LEAFLET_CSS_URL}" />
    <style>
      html, body, #map { height: 100%; margin: 0; background: #0b1120; }
      .leaflet-control-attribution { font-size: 11px; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="${LEAFLET_JS_URL}"></script>
    <script>
      const map = L.map('map', { zoomControl: true }).setView([${center.latitude}, ${center.longitude}], ${zoom});
      L.tileLayer('${TILE_URL}', {
        maxZoom: 19,
        attribution: '${TILE_ATTRIBUTION}'
      }).addTo(map);
      ${shouldRenderMarker ? `const marker = L.marker([${center.latitude}, ${center.longitude}]).addTo(map);
      marker.bindPopup('${label}');` : ''}
    </script>
  </body>
</html>`;
  }, [marker, region.latitude, region.longitude, resultLabel]);

  return (
    <iframe
      title="mapa"
      srcDoc={html}
      style={{ width: '100%', height: '100%', border: 0 }}
      allow="geolocation"
    />
  );
}
