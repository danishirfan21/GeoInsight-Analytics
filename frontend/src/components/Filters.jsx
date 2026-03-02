import React from 'react';
import { Box, TextField, MenuItem, Grid } from '@mui/material';

export default function Filters({ filters, setFilters }) {
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        select
                        label="Region"
                        name="region"
                        value={filters.region}
                        onChange={handleChange}
                        variant="standard"
                        InputProps={{ disableUnderline: false }}
                        sx={{ 
                            '& .MuiInput-root': { py: 1 },
                            '& .MuiInputLabel-root': { fontWeight: 600, color: 'text.secondary' }
                        }}
                    >
                        <MenuItem value="">All Regions</MenuItem>
                        <MenuItem value="North">North</MenuItem>
                        <MenuItem value="South">South</MenuItem>
                        <MenuItem value="East">East</MenuItem>
                        <MenuItem value="West">West</MenuItem>
                        <MenuItem value="Central">Central</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        select
                        label="Property Type"
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                        variant="standard"
                        sx={{ 
                            '& .MuiInput-root': { py: 1 },
                            '& .MuiInputLabel-root': { fontWeight: 600, color: 'text.secondary' }
                        }}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        <MenuItem value="Apartment">Apartment</MenuItem>
                        <MenuItem value="House">House</MenuItem>
                        <MenuItem value="Condo">Condo</MenuItem>
                        <MenuItem value="Townhouse">Townhouse</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Price Floor ($)"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleChange}
                        variant="standard"
                        sx={{ 
                            '& .MuiInput-root': { py: 1 },
                            '& .MuiInputLabel-root': { fontWeight: 600, color: 'text.secondary' }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Price Ceiling ($)"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        variant="standard"
                        sx={{ 
                            '& .MuiInput-root': { py: 1 },
                            '& .MuiInputLabel-root': { fontWeight: 600, color: 'text.secondary' }
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
