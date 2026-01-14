import { Paper, Typography, Box } from '@mui/material';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

interface AlertUIProps {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

const getSeverity = (uv: number, rain: number, wind: number) => {
    let score = 1;
    if (uv >= 6) score = Math.max(score, 3);
    else if (uv >= 3) score = Math.max(score, 2);

    if (rain >= 80) score = Math.max(score, 3);
    else if (rain >= 50) score = Math.max(score, 2);

    if (wind >= 60) score = Math.max(score, 3);
    else if (wind >= 40) score = Math.max(score, 2);

    return score;
};

const riskConfig = {
    1: { color: '#54cad1', label: 'Condiciones Seguras', icon: '🛡️', bg: '#ecfdf5' },
    2: { color: '#fcd34d', label: 'Precaución Moderada', icon: '⚠️', bg: '#fffbeb' },
    3: { color: '#f87171', label: 'Riesgo Elevado', icon: '🚨', bg: '#fef2f2' }
};

export default function AlertUI({ data, loading, error }: AlertUIProps) {
    if (loading) return <div style={{ color: 'white' }}>Cargando...</div>;
    if (error) return <div style={{ color: 'white' }}>Error: {error}</div>;
    if (!data || !data.daily) return null;

    const todayUV = data.daily.uv_index_max[0];
    const todayRain = data.daily.precipitation_probability_max[0];
    const todayWind = data.daily.wind_gusts_10m_max[0];

    const severityLevel = getSeverity(todayUV, todayRain, todayWind);
    const config = riskConfig[severityLevel as keyof typeof riskConfig];

    const getStatusColor = (val: number, type: 'uv' | 'rain' | 'wind') => {
        if (type === 'uv') return val >= 6 ? '#ef4444' : val >= 3 ? '#f59e0b' : '#10b981';
        if (type === 'rain') return val >= 80 ? '#ef4444' : val >= 50 ? '#f59e0b' : '#10b981';
        if (type === 'wind') return val >= 60 ? '#ef4444' : val >= 40 ? '#f59e0b' : '#10b981';
        return '#10b981';
    };

    return (
        <Paper elevation={0} sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: `1px solid ${config.color}`,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            color: 'white'
        }}>
            <Typography variant="h6" sx={{ 
                color: config.color, 
                fontWeight: 'bold',
                mb: 2,
                letterSpacing: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                Monitor de Riesgos
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                <Box sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '16px', 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    border: `1px solid ${config.color}40`
                }}>
                    <div style={{ fontSize: '2.5rem' }}>{config.icon}</div>
                    <div>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1.2 }}>
                            {config.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Resumen diario de seguridad
                        </Typography>
                    </div>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    
                    <AlertItem 
                        icon="☀️" 
                        label="Radiación UV" 
                        value={todayUV.toString()} 
                        unit="Índice"
                        reference="Normal: 0 - 2" 
                        statusColor={getStatusColor(todayUV, 'uv')}
                    />

                    <AlertItem 
                        icon="🌧️" 
                        label="Prob. Lluvia" 
                        value={`${todayRain}%`} 
                        unit=""
                        reference="Normal: < 30%" 
                        statusColor={getStatusColor(todayRain, 'rain')}
                    />

                    <AlertItem 
                        icon="💨" 
                        label="Ráfagas Viento" 
                        value={`${todayWind}`} 
                        unit="km/h"
                        reference="Normal: < 40 km/h" 
                        statusColor={getStatusColor(todayWind, 'wind')}
                    />
                </Box>
            </Box>
        </Paper>
    );
}

const AlertItem = ({ icon, label, value, unit, reference, statusColor }: any) => (
    <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.8rem 0.5rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: '1.4rem' }}>{icon}</span>
            <div>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                    {label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                    {reference}
                </Typography>
            </div>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
                {value} <span style={{ fontSize: '0.7em', fontWeight: 400 }}>{unit}</span>
            </Typography>
            <Box sx={{ 
                display: 'inline-block', 
                marginTop: '4px',
                padding: '2px 8px', 
                borderRadius: '10px', 
                backgroundColor: statusColor, 
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
                {statusColor === '#ef4444' ? 'Alto' : statusColor === '#f59e0b' ? 'Medio' : 'Bajo'}
            </Box>
        </Box>
    </Box>
);