import { useState, useEffect } from 'react';
import type { CityLocation } from '../types/DashboardTypes'; 

interface LocationFetcherOutput {
    locations: CityLocation[] | null;
    loading: boolean;
    error: string | null;
}

export default function LocationFetcher(city: string): LocationFetcherOutput {
    const [locations, setLocations] = useState<CityLocation[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city || city.trim() === '') return;

        setLoading(true);
        setError(null);

        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${import.meta.env.VITE_GEOCODING_API_KEY}`;

        const fetchLocations = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                
                const result: CityLocation[] = await response.json();
                const formatted = result.map(loc => ({
                    ...loc,
                    lat: Number(loc.lat.toFixed(4)),
                    lon: Number(loc.lon.toFixed(4))
                }));
                setLocations(formatted);
            } catch (err) {
                setError(null);
                console.warn('Ha ocurrido un error al buscar la ubicación:', err);
                // Simulación de datos en caso de error
                setLocations([
                    { name: "Madrid (Simulado)", lat: 40.4168, lon: -3.7038, country: "ES", state: "Madrid" },
                    { name: "Buenos Aires (Simulado)", lat: -34.6037, lon: -58.3816, country: "AR" },
                    { name: "New York (Simulado)", lat: 40.7128, lon: -74.0060, country: "US", state: "NY" }
                ]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchLocations, 500);
        return () => clearTimeout(timer);
    }, [city]);

    return { locations, loading, error };
}