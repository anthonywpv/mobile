import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { Box, Typography, Button, Fade } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SelectorUI from '../components/SelectorUI';
import type { CityLocation } from '../types/DashboardTypes';

const WelcomePage: React.FC = () => {
    const history = useHistory();
    const [selectedCity, setSelectedCity] = React.useState<CityLocation | null>(null);

    const isDay = useMemo(() => {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18; 
    }, []);

    const backgroundGradient = isDay
        ? 'linear-gradient(180deg, #4FC3F7 0%, #E1F5FE 100%)' // Día: Azul cielo a muy claro
        : 'linear-gradient(180deg, #1A237E 0%, #000000 100%)'; // Noche: Azul profundo a negro

    const textColor = isDay ? '#0277BD' : '#FFFFFF'; // Texto oscuro en día, blanco en noche

    const handleCityChange = (city: CityLocation) => {
        setSelectedCity(city);
    };

    const handleContinue = () => {
        if (selectedCity) {
            history.push(`/dashboard?lat=${selectedCity.lat}&lon=${selectedCity.lon}&name=${encodeURIComponent(selectedCity.name)}`);
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

                            <Box sx={{ 
                                mb: 4, 
                                position: 'relative',
                                overflow: 'visible',
                                zIndex: 10 
                            }}>
                                <SelectorUI onCityChange={handleCityChange} />
                            </Box>

                            <Button 
                                variant="contained" 
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={handleContinue}
                                disabled={!selectedCity}
                                sx={{ 
                                    borderRadius: '30px', 
                                    py: 1.5, 
                                    px: 4,
                                    textTransform: 'none', 
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    bgcolor: isDay ? 'white' : 'rgba(255,255,255,0.2)',
                                    color: isDay ? '#0277BD' : 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    '&:hover': {
                                        bgcolor: isDay ? '#f5f5f5' : 'rgba(255,255,255,0.3)'
                                    },
                                    opacity: selectedCity ? 1 : 0,
                                    transition: 'opacity 0.3s ease'
                                }}
                            >
                                Ver el Clima
                            </Button>

                        </Box>
                    </Fade>
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default WelcomePage;