import { useState, useRef, useEffect } from 'react';
import { CohereClientV2 } from 'cohere-ai';
import {
  Box, TextField, Paper, Typography, CircularProgress, IconButton, Fab, Fade, Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import type { OpenMeteoResponse } from '../types/DashboardTypes';
import ReactMarkdown from 'react-markdown';

interface ChatbotProps {
  data: OpenMeteoResponse | null;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ChatbotUI = ({ data }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Referencia para saber si ya saludamos con LOS DATOS ACTUALES
  const hasWelcomed = useRef(false);

  const API_KEY = import.meta.env.VITE_COHERE_API_KEY;
  const cohere = new CohereClientV2({ token: API_KEY });

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    const generateAIWelcome = async () => {
      if (isOpen && data && data.current && !hasWelcomed.current) {
        setIsLoading(true);
        hasWelcomed.current = true;

        const weatherContext = `
            [DATOS ACTUALES]:
            - Temperatura: ${data.current.temperature_2m}°C
            - Sensación: ${data.current.apparent_temperature}°C
            - Humedad: ${data.current.relative_humidity_2m}%
            - Viento: ${data.current.wind_speed_10m} km/h
            - Código WMO: ${data.current.weather_code}
            - UV Index Max Hoy: ${data.daily?.uv_index_max?.[0] ?? 'No disponible'}
            
            [DATOS DE CONTACTO DESARROLLADOR]:
            - Github: @anthonywpv
            - Email: anthpare@espol.edu.ec
            - Repositorio en github: https://github.com/anthonywpv/dashboard
            }
            `;

        try {
          const response = await cohere.chat({
            model: 'command-r-plus-08-2024',
            messages: [
              {
                role: 'system',
                content: `Eres ClimaBot 🦊, un asistente meteorológico útil y divertido.
                            
                            TU TAREA INICIAL:
                            Genera un mensaje de bienvenida estructurado EXACTAMENTE así:
                            
                            1. Saluda: "Hola, soy **ClimaBot** 🦊, tu asistente meteorológico inteligente." 
                            2. Aclara: "**¡Importante!** El siguiente resumen **es de la ciudad seleccionada. Si deseas información de otra ciudad, selecciónala en el mapa y vuelve a preguntarme.**"
                            3. Sección "Condiciones actuales": Resume brevemente el clima usando los datos proporcionados (ej: si el dia está soleado, puedes decir que el sol brilla con fuerza o si es de noche y hace frío, menciona que se acerca la hora de dormir 😴).
                            4. Sección "Recomendación meteorológica": PIENSA una recomendación útil basada en los datos siempre guiandote también con la hora actual, recomienda según el clima (ej: si hay UV alto🌞, sugiere protector solar 🧴; si hay lluvia🌧️, paraguas☔; si hace frío❄️, abrigo🥼).
                            5. Cierre amable: "¡Estoy aquí para ayudarte con el clima! Porfavor, dime tu nombre y pregúntame lo que quieras. 🌤️"
                            6. Información adicional: "*Si deseas reportar un problema, contacta con el desarrollador @anthonywpv en Github.*"

                            NO PUEDES/PROHIBIDO: PROHIBIDO usar listas numeradas en el mensaje, NO inventes datos que no tengas. NO puedes decir que el sol brilla bastante si es de noche o que la temperatura es alta si está bajo cero (cosas ilógicas).
                            SI PUEDES: Usar negrita (ej **Texto**), usar emojis (ESENCIAL, USA UN EMOJI AL MENOS EN CADA PÁRRAFO) y ser amable.
                            `              },
              {
                role: 'user',
                content: `Genera el reporte con estos datos: ${weatherContext}`
              }
            ]
          });

          if (response && response.message && response.message.content) {
            const textContent = response.message.content.find((c) => c.type === "text");
            const botText = (textContent as any)?.text || "Error al generar saludo.";
            setMessages(prev => [...prev, { role: 'assistant', content: botText }]);
          }
        } catch (err) {
          console.error("Error generando saludo IA", err);
          setMessages(prev => [...prev, { role: 'assistant', content: "Hola 👋. Estoy teniendo problemas para analizar el clima, pero pregúntame lo que quieras." }]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateAIWelcome();
  }, [isOpen, data]);


  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = Date.now();
    const recentRequests = requestTimestamps.filter(t => now - t < 60000);
    if (recentRequests.length >= 10) {
      setErrorMsg("Demasiadas preguntas en un lapso corto de tiempo. Espera al menos un minuto.");
      setRequestTimestamps(recentRequests);
      return;
    }
    setRequestTimestamps([...recentRequests, now]);

    setErrorMsg(null);
    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    let weatherContext = "Cargando datos...";
    if (data && data.current) {
      weatherContext = `Datos: Temp ${data.current.temperature_2m}°C, Sensación ${data.current.apparent_temperature}°C, Viento ${data.current.wind_speed_10m} km/h, Humedad ${data.current.relative_humidity_2m}%.`;
    }

    try {
      const response = await cohere.chat({
        model: 'command-r-plus-08-2024',
        messages: [
          {
            role: 'system',
            content: `Eres ClimaBot 🦊. ${weatherContext}. Responde de forma breve, útil y con emojis.`
          },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          userMessage
        ],
      });

      if (response && response.message && response.message.content) {
        const textContent = response.message.content.find((c) => c.type === "text");
        const botText = (textContent as any)?.text || "No pude procesar la respuesta.";
        setMessages(prev => [...prev, { role: 'assistant', content: botText }]);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error de conexión con la IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <Fade in={isOpen}>
        <Paper elevation={6} sx={{ width: 550, height: 650, mb: 2, borderRadius: 4, display: isOpen ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden' }}>

          <Box sx={{ bgcolor: '#1976d2', p: 2, display: 'flex', alignItems: 'left', justifyContent: 'space-between', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'left', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'white', color: '#1976d2', width: 30, height: 30 }}>
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold">Asistente Clima</Typography>
            </Box>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}><CloseIcon /></IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.length === 0 && !isLoading && (
              <Typography variant="caption" color="text.secondary" align="left" sx={{ mt: 2 }}>
                Conectando con ClimaBot...
              </Typography>
            )}

            {messages.map((msg, index) => (
              <Box key={index} sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                '& p': { margin: 0, marginBottom: 1 },
              }}>
                <Paper sx={{
                  p: 2,
                  maxWidth: '85%',
                  bgcolor: msg.role === 'user' ? '#1976d2' : 'white',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  boxShadow: 1,
                  whiteSpace: 'pre-wrap'
                }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </Typography>
                </Paper>
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left', gap: 1.5, mt: 2, opacity: 0.7 }}>
                <CircularProgress size={16} thickness={5} />
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                  Pensando...
                </Typography>
              </Box>
            )}
            {errorMsg && <Typography color="error" variant="caption" align="left">{errorMsg}</Typography>}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', gap: 1, borderTop: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="¿Cómo estará el clima mañana?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading}>
              <SendIcon />
            </IconButton>
          </Box>

        </Paper>
      </Fade>

      <Fab color="primary" onClick={toggleChat} sx={{ width: 60, height: 60, boxShadow: 4 }}>
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </Box>
  );
};

export default ChatbotUI;