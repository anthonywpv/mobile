import Typography from '@mui/material/Typography';
import { Thermometer, Wind, Droplet, CloudSun, Activity } from 'lucide-react'; // Iconos

interface IndicatorUIProps {
    title: string;
    description: string;
}

const getIconConfig = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('temp')) return { icon: <Thermometer size={28} />, color: '#1fbded', bg: '#e0f7fa' };
    if (t.includes('viento')) return { icon: <Wind size={28} />, color: '#a4dbde', bg: '#f1f8e9' };
    if (t.includes('humedad')) return { icon: <Droplet size={28} />, color: '#54cad1', bg: '#e0f2f1' };
    if (t.includes('sensación')) return { icon: <Activity size={28} />, color: '#f87171', bg: '#fef2f2' };
    return { icon: <CloudSun size={28} />, color: '#6b7280', bg: '#f3f4f6' };
};

export default function IndicatorUI({ title, description }: IndicatorUIProps) {
    const { icon, color, bg } = getIconConfig(title);

    return (
        <div className="myContainer" style={{
            background: 'rgba(255, 255, 255, 0.75)', 
            backdropFilter: 'blur(12px)',            
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            
           
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            minHeight: '100px',
            transition: 'transform 0.2s ease',
            cursor: 'default'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Texto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography variant="caption" sx={{ 
                    color: 'var(--text-muted)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                }}>
                    {title}
                </Typography>
                
                <Typography variant="h4" sx={{ 
                    color: 'var(--text-dark)', 
                    fontWeight: '500',
                    letterSpacing: '-1px'
                }}>
                    {description}
                </Typography>
            </div>

            <div style={{ 
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: bg, 
                color: color,        
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 10px ${color}30` 
            }}>
                {icon}
            </div>
        </div>
    );
}