import React from 'react';
import MapView, { Marker, UrlTile } from 'react-native-maps';

import { TILE_URL } from '@/lib/constants';

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

export default function AddressMap({
  mapRef,
  region,
  marker,
  resultLabel,
  onRegionChange,
}: Props) {
  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={region}
      region={region}
      onRegionChangeComplete={onRegionChange}
      mapType="none"
    >
      <UrlTile urlTemplate={TILE_URL} maximumZ={19} tileSize={256} />
      {marker && <Marker coordinate={marker} title="Direccion" description={resultLabel ?? undefined} />}
    </MapView>
  );
}
