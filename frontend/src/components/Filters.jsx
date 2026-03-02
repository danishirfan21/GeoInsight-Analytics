import React from 'react';
import { Box, TextField, MenuItem, Grid, InputAdornment } from '@mui/material';
import {
    LocationOnOutlined,
    HomeWorkOutlined,
    AttachMoneyOutlined
} from '@mui/icons-material';

export default function Filters({ filters, setFilters }) {
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        select
                        label="Region"
                        name="region"
                        value={filters.region}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOnOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                                </InputAdornment>
                            ),
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
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <HomeWorkOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                                </InputAdornment>
                            ),
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
                        label="Min Price"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="0"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoneyOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Max Price"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Any"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoneyOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
