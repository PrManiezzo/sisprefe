import { useState, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  location: Location | null;
  error: string | null;
  getLocation: () => void;
  isLoading: boolean;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError('Erro ao obter localização. Por favor, permita o acesso à sua localização.');
        setIsLoading(false);
      }
    );
  }, []);

  return { location, error, getLocation, isLoading };
}