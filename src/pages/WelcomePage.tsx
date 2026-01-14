import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { Box, Typography, Button, Fade, CircularProgress, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Geolocation } from '@capacitor/geolocation';
import SelectorUI from '../components/SelectorUI';
import type { CityLocation } from '../types/DashboardTypes';

const WelcomePage: React.FC = () => {
    const history = useHistory();
    const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const isDay = useMemo(() => {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18; 
    }, []);

    const backgroundGradient = isDay
        ? 'linear-gradient(180deg, #4FC3F7 0%, #E1F5FE 100%)' 
        : 'linear-gradient(180deg, #1A237E 0%, #000000 100%)'; 

    const textColor = isDay ? '#0277BD' : '#FFFFFF';

    const handleCityChange = (city: CityLocation) => {
        setSelectedCity(city);
    };

    const handleContinue = () => {
        if (selectedCity) {
            history.push(`/dashboard?lat=${selectedCity.lat}&lon=${selectedCity.lon}&name=${encodeURIComponent(selectedCity.name)}`);
        }
    };

    // --- NUEVA LÓGICA DE GEOLOCALIZACIÓN ---
    const handleCurrentLocation = async () => {
        setLoadingLocation(true);
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            const { latitude, longitude } = coordinates.coords;
            // Redirigimos directamente al obtener coordenadas
            history.push(`/dashboard?lat=${latitude}&lon=${longitude}&name=Ubicación Actual`);
        } catch (error) {
            console.error('Error obteniendo ubicación', error);
            alert("No se pudo obtener tu ubicación. Verifica que el GPS esté activo y tengas permisos.");
        } finally {
            setLoadingLocation(false);
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <Box sx={{ 
                    minHeight: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',    
                    background: backgroundGradient,
                    transition: 'background 1s ease-in-out',
                    p: 4
                }}>
                    <Fade in={true} timeout={1200}>
                        <Box sx={{ width: '100%', maxWidth: 450, textAlign: 'center' }}>
                            
                            <Typography 
                                variant="h5" 
                                fontWeight="500" 
                                sx={{ 
                                    color: textColor, 
                                    mb: 4, 
                                    textShadow: isDay ? 'none' : '0 2px 4px rgba(0,0,0,0.5)'
                                }}
                            >
                                Selecciona tu ubicación para comenzar
                            </Typography>

                            {/* Selector Manual */}
                            <Box sx={{ 
                                mb: 3, 
                                position: 'relative',
                                overflow: 'visible',
                                zIndex: 10 
                            }}>
                                <SelectorUI onCityChange={handleCityChange} />
                            </Box>

                            {/* Botón Continuar (Solo visible si seleccionó ciudad manualmente) */}
                            {selectedCity && (
                                <Fade in={!!selectedCity}>
                                    <Button 
                                        variant="contained" 
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleContinue}
                                        sx={{ 
                                            borderRadius: '30px', 
                                            py: 1.5, px: 4, mb: 3,
                                            width: '100%',
                                            textTransform: 'none', 
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            bgcolor: isDay ? 'white' : 'rgba(255,255,255,0.2)',
                                            color: isDay ? '#0277BD' : 'white',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                bgcolor: isDay ? '#f5f5f5' : 'rgba(255,255,255,0.3)'
                                            }
                                        }}
                                    >
                                        Ver clima en {selectedCity.name}
                                    </Button>
                                </Fade>
                            )}

                            {/* Separador Visual */}
                            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)' }}>
                                <Typography variant="caption">O</Typography>
                            </Divider>

                            {/* Botón Geolocalización */}
                            <Button
                                onClick={handleCurrentLocation}
                                disabled={loadingLocation}
                                startIcon={loadingLocation ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
                                sx={{
                                    width: '100%',
                                    py: 1.5,
                                    borderRadius: '30px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    // Estilo Glassmorphism
                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                                    },
                                    '&:disabled': {
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }}
                            >
                                {loadingLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
                            </Button>

                        </Box>
                    </Fade>
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default WelcomePage;