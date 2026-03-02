import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Grid, Paper, Typography, Box, AppBar, Toolbar,
    Button, Alert, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow
} from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map';
import Filters from '../components/Filters';
import Charts from '../components/Charts';
import { debounce } from 'lodash';

export default function Dashboard() {
    const { logout, user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [filters, setFilters] = useState({
        region: '',
        type: '',
        minPrice: '',
        maxPrice: ''
    });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Debounce filter updates to avoid too many API calls
    const debouncedSetFilters = useCallback(
        debounce((newFilters) => {
            setDebouncedFilters(newFilters);
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSetFilters(filters);
    }, [filters, debouncedSetFilters]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await api.get('/properties', { params: debouncedFilters });
                setProperties(res.data);
            } catch (err) {
                console.error('CRITICAL: Error fetching properties. Check if backend is reachable and CORS is configured.', err.message);
                if (err.response) console.error('Data error:', err.response.data);
            }
        };

        const fetchAdminData = async () => {
            if (user?.role === 'Admin') {
                try {
                    const res = await api.get('/analytics/admin-stats', { params: debouncedFilters });
                    setAdminData(res.data);
                } catch (err) {
                    console.error('Error fetching admin data', err);
                    // Additional logging for admin data fetch errors
                    if (err.response) {
                        console.error('Admin data error response:', err.response.data);
                        console.error('Admin data error status:', err.response.status);
                    } else if (err.request) {
                        console.error('Admin data error request:', err.request);
                    } else {
                        console.error('Admin data error message:', err.message);
                    }
                }
            }
        };

        fetchProperties();
        fetchAdminData();
    }, [debouncedFilters, user?.role, user]); // Added user to dependency array for logging

    return (
        <Box sx={{ 
            minHeight: '100vh',
            pb: 8
        }}>
            <AppBar position="sticky" sx={{ mb: 4 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 700, 
                            letterSpacing: '-0.5px',
                            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            GeoInsight Analytics
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.light' }}>
                                {user?.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {user?.role} Account
                            </Typography>
                        </Box>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={logout}
                            sx={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl">
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        Real Estate Intelligence
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                        Comprehensive market insights and property analytics
                    </Typography>
                </Box>

                {user?.role === 'Admin' && (
                    <Alert 
                        severity="info" 
                        sx={{ 
                            mb: 4, 
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            background: 'rgba(59, 130, 246, 0.05)',
                        }}
                    >
                        <strong>Admin Control Panel:</strong> You are viewing privileged data and system management tools.
                    </Alert>
                )}

                <Paper sx={{ p: 3, mb: 5, borderRadius: '20px' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Market Filters</Typography>
                    <Filters filters={filters} setFilters={setFilters} />
                </Paper>

                <Grid container spacing={3}>
                    {/* Hero Section: Map & Key Trends */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Paper sx={{ 
                            p: 2, 
                            height: { xs: 500, lg: 650 }, 
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Geospatial Distribution</Typography>
                                <Typography variant="caption" color="text.secondary">Live Market Feed</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, minHeight: 0, borderRadius: '16px', overflow: 'hidden', mt: 1 }}>
                                <Map properties={properties} />
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Charts filters={debouncedFilters} layout="sidebar" />
                    </Grid>

                    {user?.role === 'Admin' && (
                        <Grid size={12}>
                            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Regional Performance Benchmarks</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, color: 'primary.light', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>REGION</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.light', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>UNIT COUNT</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.light', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>AVG VALUATION</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.light', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>MARKET VOLUME</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {adminData.map((row) => (
                                                <TableRow key={row._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                        {row._id}
                                                    </TableCell>
                                                    <TableCell align="right">{row.count}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'primary.light', fontWeight: 600 }}>
                                                        ${row.avgPrice ? row.avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'N/A'}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                        ${row.totalVolume ? row.totalVolume.toLocaleString() : 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}
