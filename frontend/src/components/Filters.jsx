import React, { useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Grid, InputAdornment, Skeleton } from '@mui/material';
import {
    LocationOnOutlined,
    HomeWorkOutlined,
    AttachMoneyOutlined
} from '@mui/icons-material';
import api from '../api/axios';

export default function Filters({ filters, setFilters }) {
    const [options, setOptions] = useState({ regions: [], types: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // We'll create these simple endpoints or use the existing analytics data
                const [regRes, typeRes] = await Promise.all([
                    api.get('/analytics/region-distribution'),
                    api.get('/analytics/property-type-distribution')
                ]);
                
                setOptions({
                    regions: regRes.data.map(r => r._id).sort(),
                    types: typeRes.data.map(t => t._id).sort()
                });
            } catch (err) {
                console.error('Error fetching filter options', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%' }}>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rounded" height={56} sx={{ borderRadius: '12px' }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

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
                        {options.regions.map(region => (
                            <MenuItem key={region} value={region}>{region}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        select
                        label="Room Type"
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
                        {options.types.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
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
