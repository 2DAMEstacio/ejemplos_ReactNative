import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';

import { NOMINATIM_SEARCH_URL } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';

type GeoResult = {
  lat: string;
  lon: string;
  display_name: string;
};

const DEFAULT_REGION = {
  latitude: 40.4168,
  longitude: -3.7038,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export function useMapScreen() {
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const { authChecked, sessionUserId, signOut } = useAuth();

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultLabel, setResultLabel] = useState<string | null>(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (authChecked && !sessionUserId) {
      router.replace('/login');
    }
  }, [authChecked, router, sessionUserId]);

  const runSearch = useCallback(async (query: string) => {
    const normalized = query.trim();
    if (!normalized) {
      return;
    }

    setLoading(true);
    setError(null);
    setResultLabel(null);
    Keyboard.dismiss();

    try {
      const url = `${NOMINATIM_SEARCH_URL}?format=json&limit=1&q=${encodeURIComponent(normalized)}`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'mapas-app/1.0 (expo)',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo consultar la direccion.');
      }

      const data = (await response.json()) as GeoResult[];
      if (!data.length) {
        setError('No se encontraron resultados. Prueba con una direccion mas completa.');
        return;
      }

      const result = data[0];
      const latitude = Number.parseFloat(result.lat);
      const longitude = Number.parseFloat(result.lon);
      const nextRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(nextRegion);
      setMarker({ latitude, longitude });
      setResultLabel(result.display_name);
      mapRef.current?.animateToRegion?.(nextRegion, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo buscar la direccion.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    const query = address.trim();
    if (!query) {
      Alert.alert('Falta direccion', 'Escribe una direccion para buscar.');
      return;
    }

    await runSearch(query);
  }, [address, runSearch]);


  return {
    address,
    setAddress,
    loading,
    error,
    resultLabel,
    region,
    setRegion,
    marker,
    handleSearch,
    signOut,
    mapRef,
  };
}
