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
                        borderRadius: '16px',
                        backgroundColor: 'var(--bg-card)', 
                        color: 'var(--text-dark)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 20px -5px rgba(31, 189, 237, 0.25)', 
                        transition: 'all 0.3s ease',
                        paddingLeft: '10px', 

                        '& fieldset': { border: 'none' }, 
                        
                        '&:hover': {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 10px 25px -5px rgba(31, 189, 237, 0.4)',
                            transform: 'translateY(-2px)'
                        },
                        '&.Mui-focused': {
                            border: '2px solid var(--color-primary)', 
                            boxShadow: '0 0 0 4px var(--color-highlight)', 
                        }
                    }
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start" sx={{ color: 'var(--color-primary)', marginRight: '10px' }}>
                                <MapPin size={24} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {loading && <CircularProgress size={20} />}
                            </InputAdornment>
                        )
                    }
                }}
            />

            {error && (
                <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px', paddingLeft: '10px' }}>
                    Error: {error}
                </div>
            )}

            {locations && locations.length > 0 && isFocused && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        borderRadius: '16px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <List dense>
                        {locations.map((loc, idx) => (
                            <ListItem key={idx} disablePadding>
                                <ListItemButton 
                                    onClick={() => handleSelect(loc)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'var(--bg-body-start)',
                                            color: 'var(--color-primary)',
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={loc.name}
                                        secondary={`${loc.country}${loc.state ? `, ${loc.state}` : ''}`}
                                        primaryTypographyProps={{ fontWeight: 'bold', color: 'var(--text-dark)' }}
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