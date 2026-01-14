import { useState, useRef, useEffect } from 'react';
import { CohereClientV2 } from 'cohere-ai';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  Chip,
  Fade,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon, SmartToy as BotIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatbotUIProps {
  data?: any;
  isDay?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const getWMODescription = (code: number) => {
  const wmoTable: { [key: number]: string } = {
    0: "Cielo Despejado ☀️",
    1: "Mayormente Despejado 🌤️",
    2: "Parcialmente Nublado ⛅",
    3: "Nublado ☁️",
    45: "Niebla 🌫️",
    48: "Niebla con escarcha 🌫️❄️",
    51: "Llovizna Ligera 🌦️",
    53: "Llovizna Moderada 🌧️",
    55: "Llovizna Densa 🌧️",
    61: "Lluvia Ligera ☔",
    63: "Lluvia Moderada ☔",
    65: "Lluvia Fuerte ⛈️",
    71: "Nieve Ligera 🌨️",
    73: "Nieve Moderada 🌨️",
    75: "Nieve Fuerte ❄️",
    77: "Granizo 🌨️",
    80: "Lluvia (Chubascos) Leves 🌦️",
    81: "Lluvia (Chubascos) Moderados 🌧️",
    82: "Lluvia (Chubascos) Violentos ⛈️",
    95: "Tormenta Eléctrica ⚡",
    96: "Tormenta con Granizo Ligero ⚡🌨️",
    99: "Tormenta con Granizo Fuerte ⚡❄️"
  };
  return wmoTable[code] || `Condición Variable (Código: ${code})`;
};

const ChatbotUI = ({ data = true }: ChatbotUIProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hola, soy ClimaBot 🦊. ¿En qué te ayudo hoy?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_KEY = import.meta.env.VITE_COHERE_API_KEY;
  const cohere = new CohereClientV2({ token: API_KEY });

  const suggestions = [
    "¿Lloverá hoy?",
    "Resumen del clima",
    "¿Qué ropa uso?",
    "Viento actual"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showSuggestions]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setInput('');
    setIsLoading(true);

    const now = new Date();
    const currentTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let weatherContext = "No hay datos sincronizados.";

    if (data && data.current) {
      const wmoCode = data.current.weather_code;
      const weatherDesc = getWMODescription(wmoCode);

      let futureBrief = "";

      if (data.hourly?.time) {
        const currentIndex = data.hourly.time.findIndex(
          (t: string) => new Date(t).getTime() >= now.getTime()
        );

        if (currentIndex !== -1) {
          for (let offset = 1; offset <= 12; offset++) {
            const idx = currentIndex + offset;

            if (idx < data.hourly.time.length) {
              const hDate = new Date(data.hourly.time[idx]);
              const hTime = hDate.toLocaleTimeString("es-EC", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const hCode = data.hourly.weather_code[idx];
              const hTemp = data.hourly.temperature_2m[idx];

              futureBrief += `[${hTime}: ${hTemp}°C, ${getWMODescription(hCode)}] `;
            }
          }
        }
      }


      weatherContext = `
            [SITUACIÓN ACTUAL - HORA: ${currentTimeString}]:
            - Código WMO: ${wmoCode} (${weatherDesc})
            - Temperatura: ${data.current.temperature_2m}°C
            - Sensación Térmica: ${data.current.apparent_temperature}°C
            - Humedad: ${data.current.relative_humidity_2m}%
            - Viento: ${data.current.wind_speed_10m} km/h
            - UV Index Max Hoy: ${data.daily?.uv_index_max?.[0] ?? 'N/A'}
            
            [PRONÓSTICO HASTA 12 HORAS FUTURO]:
            ${futureBrief}
            `;
    }

    const systemPrompt = `
        Eres ClimaBot 🦊, un asistente meteorológico preciso y moderno.
        
        CONTEXTO TÉCNICO:
        ${weatherContext}

        INSTRUCCIONES CLAVE:
        1. Si preguntan por ropa o actividades, basa tu recomendación según los datos proporcionados.
        2. Se amigable, usa emojies de ser necesario, siempre trata de tener una personalidad alegre.
        `;

    try {
      const response = await cohere.chat({
        model: 'command-r-plus-08-2024',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: textToSend }
        ]
      });

      if (response?.message?.content) {
        const textContent = response.message.content.find((c) => c.type === "text");
        const botText = (textContent as any)?.text || "Error de respuesta.";
        setMessages(prev => [...prev, { role: 'assistant', content: botText }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sin conexión." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: 'transparent',
      position: 'relative',
      pt: 8
    }}>

      <Box sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        pb: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="caption" align="center" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, mb: 2 }}>
          🤖 Asistente impulsado por Coherence AI
        </Typography>

        {messages.map((msg, index) => (
          <Box key={index} sx={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 1.5,
            maxWidth: '100%'
          }}>
            {msg.role === 'assistant' && (
              <Avatar sx={{
                width: 32, height: 32,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <BotIcon sx={{ fontSize: 20, color: 'white' }} />
              </Avatar>
            )}

            <Paper elevation={0} sx={{
              p: 1.5,
              px: 2,
              maxWidth: '75%',
              borderRadius: '20px',
              borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
              borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
              bgcolor: msg.role === 'user'
                ? 'rgba(255, 255, 255, 0.35)'
                : 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{
                '& p': { m: 0 },
                '& a': { color: 'white', textDecoration: 'underline' }
              }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </Box>
            </Paper>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'transparent' }}>
              <BotIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
            </Avatar>
            <Box sx={{ display: 'flex', gap: 0.5, p: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, pt: 1 }}>
        <Fade in={showSuggestions && !isLoading}>
          <Box sx={{ display: showSuggestions ? 'flex' : 'none', gap: 1, overflowX: 'auto', mb: 1.5, pb: 0.5 }}>
            {suggestions.map((text, idx) => (
              <Chip
                key={idx}
                label={text}
                onClick={() => handleSend(text)}
                clickable
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontWeight: 500,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              />
            ))}
          </Box>
        </Fade>

        <Paper
          component="form"
          elevation={0}
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          sx={{
            p: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <TextField
            sx={{ ml: 2, flex: 1 }}
            placeholder="Escribe un mensaje..."
            variant="standard"
            InputProps={{ disableUnderline: true, style: { color: 'white' } }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <IconButton
            type="submit"
            sx={{
              p: '10px',
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              ml: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
            disabled={!input.trim() || isLoading}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>

      <style>{`
                @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
                .MuiInputBase-input::placeholder { color: rgba(255,255,255,0.7) !important; opacity: 1; }
            `}</style>
    </Box>
  );
};

export default ChatbotUI;