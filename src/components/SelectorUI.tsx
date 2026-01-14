import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

import type { CityLocation } from '../types/DashboardTypes';
import LocationFetcher from '../functions/LocationFetcher';

const DEFAULT_CITY: CityLocation = {
    name: "Guayaquil",
    lat: -2.1962,
    lon: -79.8862,
    country: "EC"
};

interface SelectorUIProps {
    onCityChange: (city: CityLocation) => void;
}

export default function SelectorUI({ onCityChange }: SelectorUIProps) {
    const [cityInput, setCityInput] = useState<string>(DEFAULT_CITY.name);
    
    const [search, setSearch] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    
    const { locations, loading, error } = LocationFetcher(search);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCityInput(e.target.value);
    };

    const handleSelect = (city: CityLocation) => {
        onCityChange(city);
        setCityInput(city.name); 
        setSearch(''); 
        setIsFocused(false);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        event.target.select();
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (cityInput.trim() !== '') setSearch(cityInput);
        }, 800);
        return () => clearTimeout(timer);
    }, [cityInput]);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <TextField
                variant="outlined"
                placeholder="Buscar ciudad..."
                fullWidth
                value={cityInput}
                onChange={handleChange}
                onFocus={handleFocus} 
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                autoComplete="off"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '30px',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                        backdropFilter: 'blur(15px)', 
                        WebkitBackdropFilter: 'blur(15px)',
                        color: 'white', 
                        fontWeight: '500',
                        fontSize: '1rem',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', 
                        transition: 'all 0.3s ease',
                        paddingLeft: '5px',
                        border: '1px solid rgba(255, 255, 255, 0.3)', 

                        '& fieldset': { border: 'none' }, 
                        
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            border: '1px solid #ffffff',
                            boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.1)', 
                        }
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1,
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start" sx={{ marginRight: '8px' }}>
                                <MapPin size={22} color="white" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {loading && <CircularProgress size={20} sx={{ color: 'white' }} />}
                            </InputAdornment>
                        )
                    }
                }}
            />

            {error && (
                <div style={{ color: '#ffcdd2', fontSize: '0.8rem', marginTop: '5px', paddingLeft: '15px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    Error: {error}
                </div>
            )}

            {locations && locations.length > 0 && isFocused && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '115%', 
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        borderRadius: '16px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <List dense>
                        {locations.map((loc, idx) => (
                            <ListItem key={idx} disablePadding>
                                <ListItemButton 
                                    onClick={() => handleSelect(loc)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd',
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={loc.name}
                                        secondary={`${loc.country}${loc.state ? `, ${loc.state}` : ''}`}
                                        primaryTypographyProps={{ fontWeight: 'bold', color: '#333' }}
                                        secondaryTypographyProps={{ color: '#666' }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
}