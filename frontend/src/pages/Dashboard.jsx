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
                console.error('Error fetching properties', err);
            }
        };

        const fetchAdminData = async () => {
            if (user?.role === 'Admin') {
                try {
                    const res = await api.get('/analytics/admin-stats', { params: debouncedFilters });
                    setAdminData(res.data);
                } catch (err) {
                    console.error('Error fetching admin data', err);
                }
            }
        };

        fetchProperties();
        fetchAdminData();
    }, [debouncedFilters, user?.role]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        GeoInsight Analytics
                    </Typography>
                    <Typography sx={{ mr: 2 }}>{user?.username} ({user?.role})</Typography>
                    <Button color="inherit" onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Real Estate Dashboard</Typography>

                {user?.role === 'Admin' && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <strong>Admin Access:</strong> You have full access to all analytics and property management tools.
                    </Alert>
                )}

                <Paper sx={{ p: 2, mb: 4 }}>
                    <Filters filters={filters} setFilters={setFilters} />
                </Paper>

                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500 }}>
                            <Typography variant="h6" gutterBottom>Property Map</Typography>
                            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                                <Map properties={properties} />
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={12}>
                        <Charts filters={debouncedFilters} />
                    </Grid>

                    {user?.role === 'Admin' && (
                        <Grid size={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Admin: Region Performance Metrics</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Region</TableCell>
                                                <TableCell align="right">Property Count</TableCell>
                                                <TableCell align="right">Average Price</TableCell>
                                                <TableCell align="right">Total Volume</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {adminData.map((row) => (
                                                <TableRow key={row._id}>
                                                    <TableCell component="th" scope="row">{row._id}</TableCell>
                                                    <TableCell align="right">{row.count}</TableCell>
                                                    <TableCell align="right">
                                                        ${row.avgPrice ? row.avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'N/A'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        ${row.totalVolume ? row.totalVolume.toLocaleString() : 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {adminData.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center">No data available</TableCell>
                                                </TableRow>
                                            )}
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
