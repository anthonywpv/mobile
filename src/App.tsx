import './App.css'
import { Grid } from '@mui/material'
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './functions/useFetchData';
import TableUI from './components/TableUI';
import { TemperatureChart, WindChart } from './components/ChartUI';
import { useState } from 'react';
import ChatbotUI from './components/ChatbotUI';
import type { CityLocation } from './types/DashboardTypes';
import { IonApp, IonContent, IonPage } from '@ionic/react';

function App() {

  const [selectedCity, setSelectedCity] = useState<CityLocation>({
    name: "Guayaquil",
    lat: -2.1962,
    lon: -79.8862,
    country: "EC"
  });

  const { data, loading, error } = useFetchData(selectedCity.lat, selectedCity.lon);
  const handleCityChange = (city: CityLocation) => {
    setSelectedCity(city);
  };


  return (
    <IonApp>
      <IonPage>
        <IonContent>
          <Grid container spacing={4} sx={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>

            {/* 1. Header y Selector */}
            <Grid size={{ xs: 12, md: 8 }}>
              <HeaderUI />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <SelectorUI onCityChange={handleCityChange} />
            </Grid>

            {/* 2. Indicadores Rápidos */}
            {data && !loading && (
              <Grid container size={{ xs: 12 }} spacing={2}>

                <Grid size={{ xs: 6, md: 3 }}>
                  <IndicatorUI title='Temperatura' description={`${data.current.temperature_2m}°`} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <IndicatorUI title='Viento' description={`${data.current.wind_speed_10m} km/h`} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <IndicatorUI title='Humedad' description={`${data.current.relative_humidity_2m}%`} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <IndicatorUI title='Sensación' description={`${data.current.apparent_temperature}°`} />
                </Grid>
              </Grid>
            )}

            {/* 3. GRÁFICOS Y ALERTAS */}
            <Grid container size={{ xs: 12 }} spacing={3}>

              {/* Columna 1: Temperatura */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <TemperatureChart data={data} loading={loading} error={error} />
              </Grid>

              {/* Columna 2: Viento */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <WindChart data={data} loading={loading} error={error} />
              </Grid>

              {/* Columna 3: Alertas */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <AlertUI data={data} loading={loading} error={error} />
              </Grid>

            </Grid>

            {/* 4. Tabla Detallada */}
            <Grid size={{ xs: 12 }}>
              <TableUI data={data} loading={loading} error={error} />
            </Grid>

            <ChatbotUI data={data} />

          </Grid>
        </IonContent>
      </IonPage>
    </IonApp>


  );
}

export default App;