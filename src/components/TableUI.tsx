import Typography from '@mui/material/Typography';
import { Title, Container } from './common/UI';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

function getWeatherIcon(code: number): string {
    if (code === 0) return '☀️'; 
    if (code === 1) return '🌤️'; 
    if (code === 2) return '⛅'; 
    if (code === 3) return '☁️'; 
    if ([45, 48].includes(code)) return '🌫️'; 
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️'; 
    if ((code >= 71 && code <= 77)) return '❄️'; 
    if (code >= 95) return '⛈️';
    return '🌡️';
}

interface TableUIProps {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

export default function TableUI({ data, loading, error }: TableUIProps) {
  if (loading) return <Typography>Cargando pronóstico...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const currentIsoDateHour = data.current.time.slice(0, 13);
  
  const startIdx = data.hourly.time.findIndex(t => t.startsWith(currentIsoDateHour));
  const safeStartIdx = startIdx === -1 ? 0 : startIdx;

  const range = data.hourly.time.slice(safeStartIdx, safeStartIdx + 24);
  
  const hours = range.map(t => t.slice(11, 16));
  
  const weatherIcons = range.map((_, i) => getWeatherIcon(data.hourly.weather_code[safeStartIdx + i]));
  const temps = range.map((_, i) => Math.round(data.hourly.temperature_2m[safeStartIdx + i]));
  const humidity = range.map((_, i) => data.hourly.relative_humidity_2m[safeStartIdx + i]);
  const wind = range.map((_, i) => data.hourly.wind_speed_10m[safeStartIdx + i]);

  const cellStyle = {
    padding: '12px 16px',
    whiteSpace: 'nowrap' as const,
    textAlign: 'center' as const,
    borderRight: '1px solid #f0f0f0', 
  };

  const headerCellStyle = {
    ...cellStyle,
    position: 'sticky' as const, 
    left: 0,
    background: 'var(--bg-card)', 
    zIndex: 10,
    fontWeight: 'bold',
    color: 'var(--color-primary)', 
    textAlign: 'left' as const,
    borderRight: '2px solid var(--color-highlight)', 
    minWidth: '100px',
    boxShadow: '4px 0 8px -4px rgba(0,0,0,0.1)' 
  };

  return (
    <Container>
      <Title>Pronóstico Detallado (24h)</Title>
      
      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '10px' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: 'max-content' }}>
          <tbody>
            {/* Fila 1: Hora */}
            <tr>
              <td style={headerCellStyle}>Hora</td>
              {hours.map((h, i) => (
                <td key={i} style={{ ...cellStyle, background: i % 2 === 0 ? 'var(--bg-base)' : 'transparent', fontWeight: 600 }}>
                  {h}
                </td>
              ))}
            </tr>

            {/* Fila 2: Clima (Iconos) */}
            <tr>
              <td style={headerCellStyle}>Clima</td>
              {weatherIcons.map((icon, i) => (
                <td key={i} style={{ ...cellStyle, fontSize: '1.5rem' }}>
                  {icon}
                </td>
              ))}
            </tr>

            {/* Fila 3: Temperatura */}
            <tr>
              <td style={headerCellStyle}>Temp.</td>
              {temps.map((t, i) => (
                <td key={i} style={cellStyle}>
                  <span style={{ 
                      backgroundColor: 'var(--color-highlight)', 
                      color: 'var(--text-dark)', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontWeight: 'bold'
                  }}>
                    {t}°
                  </span>
                </td>
              ))}
            </tr>

            {/* Fila 4: Humedad */}
            <tr>
              <td style={headerCellStyle}>Humedad</td>
              {humidity.map((h, i) => (
                <td key={i} style={{ ...cellStyle, color: 'var(--text-muted)' }}>
                  {h}%
                </td>
              ))}
            </tr>

            {/* Fila 5: Viento */}
            <tr>
              <td style={headerCellStyle}>Viento</td>
              {wind.map((w, i) => (
                <td key={i} style={{ ...cellStyle, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {w} <span style={{fontSize: '0.7em'}}>km/h</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
};