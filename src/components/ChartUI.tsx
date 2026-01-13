import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Title, Container } from './common/UI';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartProps {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

const processData = (data: OpenMeteoResponse | null) => {
    if (!data) return [];

    const currentIsoDateHour = data.current.time.slice(0, 13); 
    
    const startIndex = data.hourly.time.findIndex(t => t.startsWith(currentIsoDateHour));
    const safeStartIndex = startIndex === -1 ? 0 : startIndex;
    const endIndex = safeStartIndex + 24;

    return data.hourly.time.slice(safeStartIndex, endIndex).map((time, idx) => ({
        time: time.slice(11, 16), 
        temperature: data.hourly.temperature_2m[safeStartIndex + idx],
        apparent: data.hourly.apparent_temperature[safeStartIndex + idx],
        windSpeed: data.hourly.wind_speed_10m[safeStartIndex + idx],
        windGusts: data.hourly.wind_gusts_10m ? data.hourly.wind_gusts_10m[safeStartIndex + idx] : 0
    }));
};

// --- GRÁFICO 1: TEMPERATURA ---
export function TemperatureChart({ data, loading, error }: ChartProps) {
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return null;

    const chartData = processData(data);

    return (
        <Container>
            <Title>Temperatura</Title>
            <div style={{ width: '100%', height: 350, minWidth: 0 }}> 
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1fbded" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#1fbded" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="time" stroke="#3a3842" fontSize={11} tickLine={false} axisLine={false} interval={4} />
                        <YAxis stroke="#3a3842" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}°`} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="temperature" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" name="Temp." />
                        <Area type="monotone" dataKey="apparent" stroke="var(--color-secondary)" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="Sensación" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Container>
    );
}

// --- GRÁFICO 2: VIENTO ---
export function WindChart({ data, loading, error }: ChartProps) {
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return null;

    const chartData = processData(data);

    return (
        <Container>
            <Title>Viento</Title>
            <div style={{ width: '100%', height: 350, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="time" stroke="#3a3842" fontSize={11} tickLine={false} axisLine={false} interval={4} />
                        <YAxis stroke="#3a3842" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} k/h`} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="windSpeed" stroke="var(--text-dark)" strokeWidth={3} dot={false} name="Velocidad" />
                        <Line type="monotone" dataKey="windGusts" stroke="var(--color-secondary)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-secondary)' }} name="Ráfagas" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Container>
    );
}