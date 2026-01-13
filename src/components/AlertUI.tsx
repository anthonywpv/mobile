import { Title, Container } from './common/UI';
import { type OpenMeteoResponse } from '../types/DashboardTypes';
import { Typography } from '@mui/material';

interface AlertUIProps {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

const getSeverity = (uv: number, rain: number, wind: number) => {
    let score = 1;
    // UV: >6 Alto, >3 Moderado
    if (uv >= 6) score = Math.max(score, 3);
    else if (uv >= 3) score = Math.max(score, 2);

    // Lluvia: >80% Alta, >50% Media
    if (rain >= 80) score = Math.max(score, 3);
    else if (rain >= 50) score = Math.max(score, 2);

    // Viento: >60km/h Fuerte, >40km/h Moderado
    if (wind >= 60) score = Math.max(score, 3);
    else if (wind >= 40) score = Math.max(score, 2);

    return score;
};

const riskConfig = {
    1: { color: 'var(--alert-success, #54cad1)', label: 'Condiciones Seguras', icon: '🛡️', bg: '#ecfdf5' },
    2: { color: 'var(--alert-warning, #fcd34d)', label: 'Precaución Moderada', icon: '⚠️', bg: '#fffbeb' },
    3: { color: 'var(--alert-error, #f87171)', label: 'Riesgo Elevado', icon: '🚨', bg: '#fef2f2' }
};

export default function AlertUI({ data, loading, error }: AlertUIProps) {
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
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
        <Container 
            style={{ 
                border: `2px solid ${config.color}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Title style={{ 
                color: config.color, 
                borderLeftColor: config.color, 
                marginBottom: '0.5rem' 
            }}>
                Monitor de Riesgos
            </Title>
            
            <div style={{ height: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Cabecera del Estado Actual */}
                <div style={{ 
                    background: config.bg, 
                    borderRadius: '12px', 
                    padding: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    border: `1px solid ${config.color}40`
                }}>
                    <div style={{ fontSize: '2.5rem' }}>{config.icon}</div>
                    <div>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-dark)', lineHeight: 1.2 }}>
                            {config.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                            Resumen diario de seguridad
                        </Typography>
                    </div>
                </div>

                {/* Lista de Métricas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flexGrow: 1 }}>
                    
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
                </div>
            </div>
        </Container>
    );
}

const AlertItem = ({ icon, label, value, unit, reference, statusColor }: any) => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.6rem 0.8rem', 
        borderRadius: '8px',
        borderBottom: '1px solid #f0f0f0' 
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <div>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                    {label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }}>
                    {reference}
                </Typography>
            </div>
        </div>

        <div style={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-dark)', lineHeight: 1 }}>
                {value} <span style={{ fontSize: '0.7em', fontWeight: 400 }}>{unit}</span>
            </Typography>
            <div style={{ 
                display: 'inline-block', 
                marginTop: '4px',
                padding: '2px 8px', 
                borderRadius: '10px', 
                backgroundColor: statusColor, 
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold'
            }}>
                {statusColor === '#ef4444' ? 'Alto' : statusColor === '#f59e0b' ? 'Medio' : 'Bajo'}
            </div>
        </div>
    </div>
);