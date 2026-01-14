# Weather Dashboard & AI Assistant

Aplicación web progresiva desarrollada con React y Ionic para la visualización de datos meteorológicos en tiempo real y asistencia mediante Inteligencia Artificial. La aplicación utiliza la API de Open-Meteo para obtener pronósticos precisos y Cohere AI para impulsar un chatbot contextualizado.

## Características Principales

- **Búsqueda de Ubicación:** Selector de ciudades con autocompletado utilizando la API de Geocoding de Open-Meteo.
- **Dashboard Meteorológico:**
  - Visualización de temperatura actual y sensación térmica.
  - Monitor de riesgos (Índice UV, Probabilidad de Lluvia y Velocidad del Viento).
  - Tabla de pronóstico detallado para las próximas 24 horas.
  - Gráficos interactivos de temperatura y viento.
- **Asistente IA (ClimaBot):** Chatbot integrado alimentado por Cohere AI que responde preguntas en lenguaje natural utilizando el contexto meteorológico actual de la ubicación seleccionada.
- **Interfaz de Usuario (UI):**
  - Diseño estilo Glassmorphism (efecto cristal).
  - Fondos dinámicos que cambian según si es de día o de noche.
  - Diseño responsivo adaptado para dispositivos móviles (Mobile-first).

## Tecnologías Utilizadas

### Frontend
- **React:** Biblioteca principal para la construcción de la interfaz.
- **Ionic Framework:** Componentes de interfaz móvil y enrutamiento.
- **Material UI (MUI):** Componentes de interfaz adicionales y sistema de diseño.
- **Recharts:** Librería para la visualización de datos (gráficos).
- **Vite:** Entorno de desarrollo y empaquetador.

### APIs y Servicios
- **Open-Meteo API:** Fuente de datos meteorológicos (sin necesidad de API Key).
- **Open-Weather API:** Fuente de datos geológicos.
- **Cohere AI:** Procesamiento de lenguaje natural para el chatbot.

## Requisitos Previos

- Node.js (versión 16 o superior)
- NPM o Yarn
