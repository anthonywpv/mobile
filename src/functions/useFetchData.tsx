import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

// Interfaz que define lo que retornará el custom hook
interface FetchResult {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

export default function useFetchData(latitude: number, longitude: number): FetchResult {
  const URL = 
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m&daily=uv_index_max,precipitation_probability_max,wind_gusts_10m_max&timezone=auto`;
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(latitude === undefined || longitude === undefined) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const json: OpenMeteoResponse = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  return { data, loading, error };
}
