import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ChatbotUI from '../components/ChatbotUI';
import useFetchData from '../functions/useFetchData';
import type { CityLocation } from '../types/DashboardTypes';

const ChatPage: React.FC = () => {
    const history = useHistory();

    const isDay = useMemo(() => {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 18;
    }, []);

    const backgroundGradient = isDay
        ? 'linear-gradient(180deg, #4FC3F7 0%, #E1F5FE 100%)' 
        : 'linear-gradient(180deg, #1A237E 0%, #000000 100%)';

    const [selectedCity] = useState<CityLocation>({
        name: "Ubicación Actual",
        lat: -2.1962,
        lon: -79.8862,
        country: "EC"
    });

    const { data } = useFetchData(selectedCity.lat, selectedCity.lon);

    return (
        <IonPage>
            <IonContent fullscreen>
                <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: backgroundGradient,
                    transition: 'background 1s ease-in-out',
                    position: 'relative'
                }}>
                    
                    <Box sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        zIndex: 100 
                    }}>
                        <Box sx={{ position: 'absolute', left: 20 }}>
                            <IconButton 
                                onClick={() => history.goBack()}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(15px)',
                                    WebkitBackdropFilter: 'blur(15px)',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    width: 45,
                                    height: 45,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                                    }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Box>

                        {/* Título Central */}
                        <Typography variant="h6" sx={{ 
                            color: 'white', 
                            fontWeight: 'bold', 
                            fontSize: '1.2rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)', 
                            letterSpacing: '0.5px'
                        }}>
                            ClimaBot 🦊
                        </Typography>
                    </Box>

                    {/* CHAT UI */}
                    <ChatbotUI data={data}/>
                    
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default ChatPage;