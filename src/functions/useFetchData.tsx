import { useEffect, useState, useCallback } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface FetchResult {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>; 
}

export default function useFetchData(latitude: number, longitude: number): FetchResult {
  const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m&daily=uv_index_max,precipitation_probability_max,wind_gusts_10m_max&timezone=auto`;
  
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (latitude === undefined || longitude === undefined) return;
    
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
  }, [latitude, longitude, URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, fetchData };
}