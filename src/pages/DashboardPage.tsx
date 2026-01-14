import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { 
  IonPage, 
  IonContent, 
  IonRefresher, 
  IonRefresherContent
} from '@ionic/react';
import type { RefresherEventDetail } from '@ionic/react';
import { Grid as Grid, Card, CardContent, Typography, Box, Paper, IconButton } from '@mui/material';
import { 
  WbSunny, 
  Cloud, 
  AcUnit, 
  Thunderstorm, 
  WaterDrop, 
  Air,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';

import AlertUI from '../components/AlertUI';
import TableUI from '../components/TableUI';
import { TemperatureChart, WindChart } from '../components/ChartUI';
import useFetchData from '../functions/useFetchData';

const getWeatherIcon = (code: number) => {
    if (code === 0) return <WbSunny sx={{ fontSize: 60, color: '#FFD54F' }} />;
    if (code >= 1 && code <= 3) return <Cloud sx={{ fontSize: 60, color: '#90CAF9' }} />;
    if (code >= 45 && code <= 48) return <Air sx={{ fontSize: 60, color: '#B0BEC5' }} />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <WaterDrop sx={{ fontSize: 60, color: '#4FC3F7' }} />;
    if (code >= 71 && code <= 77) return <AcUnit sx={{ fontSize: 60, color: '#81D4FA' }} />;
    if (code >= 95 && code <= 99) return <Thunderstorm sx={{ fontSize: 60, color: '#5C6BC0' }} />;
    return <WbSunny sx={{ fontSize: 60, color: '#FFD54F' }} />;
};

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const history = useHistory(); 
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  

  const lat = parseFloat(queryParams.get('lat') || "-2.1962"); 
  const lon = parseFloat(queryParams.get('lon') || "-79.8862");
  const cityName = queryParams.get('name') || "Guayaquil";

  const { data, loading, error, fetchData } = useFetchData(lat, lon);

  const isDay = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  }, []);

  const backgroundGradient = isDay
    ? 'linear-gradient(180deg, #4FC3F7 0%, #E1F5FE 100%)' 
    : 'linear-gradient(180deg, #1A237E 0%, #000000 100%)';

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchData().then(() => {
        event.detail.complete();
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Box sx={{ 
            minHeight: '100%', 
            background: backgroundGradient,
            transition: 'background 1s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            
            <Box sx={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 100, 
                p: 2, 
                pt: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <Box sx={{ position: 'absolute', left: 20 }}>
                    <IconButton 
                        onClick={() => history.push('/welcome')}
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

                <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    fontSize: '1.2rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '0.5px'
                }}>
                    {cityName}
                </Typography>
            </Box>

            <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ zIndex: 101 }}>
                 <IonRefresherContent />
            </IonRefresher>

            <Box sx={{ p: 2, pb: 15, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              
              {data && !loading && (
                <Grid container spacing={3}>
                    
                    {/* HERO TEMP */}
                    <Grid size={{ xs: 12 }}>
                        <Paper elevation={0} sx={{ 
                            p: 3, 
                            borderRadius: 4, 
                            background: 'rgba(255, 255, 255, 0.2)', 
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            textAlign: 'center',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
                                {getWeatherIcon(data.current.weather_code)}
                                <Typography variant="h1" fontWeight="bold" sx={{ fontSize: '5rem', color: isDay ? '#333' : 'white', textShadow: isDay ? 'none' : '0 2px 10px rgba(0,0,0,0.5)' }}>
                                    {Math.round(data.current.temperature_2m)}°
                                </Typography>
                            </Box>
                            
                            <Typography variant="h6" sx={{ color: isDay ? 'text.secondary' : 'rgba(255,255,255,0.8)', fontWeight: '500' }}>
                                Sensación térmica: {Math.round(data.current.apparent_temperature)}°
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <AlertUI data={data} loading={loading} error={error} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, ml: 1, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                            Pronóstico 24 Horas
                        </Typography>
                        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                            <Box sx={{ overflowX: 'auto' }}>
                                <TableUI data={data} loading={loading} error={error} />
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                            <CardContent>
                                <TemperatureChart data={data} loading={loading} error={error} />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                            <CardContent>
                                <WindChart data={data} loading={loading} error={error} />
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
              )}

            </Box>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;