import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Grid, Paper, Typography, Box, AppBar, Toolbar,
    Button, Alert, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar, Chip, Tooltip, IconButton
} from '@mui/material';
import {
    LogoutOutlined,
    AdminPanelSettingsOutlined,
    InsightsOutlined,
    TrendingUpOutlined,
    MapOutlined,
    DashboardOutlined
} from '@mui/icons-material';
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
                console.error('Error fetching properties', err.message);
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
    }, [debouncedFilters, user?.role, user]);

    return (
        <Box sx={{ minHeight: '100vh', pb: 8, bgcolor: 'background.default' }}>
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                bgcolor: 'primary.main',
                                p: 1,
                                borderRadius: '12px',
                                display: 'flex',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                            }}>
                                <InsightsOutlined sx={{ color: 'white' }} />
                            </Box>
                            <Typography variant="h5" sx={{
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: { xs: 'none', sm: 'block' }
                            }}>
                                GeoInsight
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                        {user?.username}
                                    </Typography>
                                    <Chip
                                        label={user?.role}
                                        size="small"
                                        color={user?.role === 'Admin' ? 'primary' : 'default'}
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, mt: 0.5 }}
                                    />
                                </Box>
                                <Avatar sx={{
                                    bgcolor: user?.role === 'Admin' ? 'primary.main' : 'rgba(255,255,255,0.1)',
                                    width: 40,
                                    height: 40,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    border: '2px solid rgba(255,255,255,0.1)'
                                }}>
                                    {user?.username?.[0]?.toUpperCase()}
                                </Avatar>
                            </Box>
                            <Tooltip title="Logout">
                                <IconButton
                                    onClick={logout}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'error.main' }
                                    }}
                                >
                                    <LogoutOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 6 }}>
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TrendingUpOutlined sx={{ color: 'primary.main' }} />
                        <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: '0.1em', color: 'primary.main' }}>
                            Market Intelligence Dashboard
                        </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ mb: 1 }}>
                        Real Estate <span style={{ color: '#6366f1' }}>Intelligence</span>
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 600 }}>
                        Gain a competitive edge with advanced geospatial analytics and real-time market performance data.
                    </Typography>
                </Box>

                {user?.role === 'Admin' && (
                    <Alert 
                        icon={<AdminPanelSettingsOutlined />}
                        severity="info" 
                        sx={{ 
                            mb: 6,
                            borderRadius: '16px',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            background: 'rgba(99, 102, 241, 0.05)',
                            '& .MuiAlert-icon': { color: 'primary.main' }
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Admin Privileges Active:
                            <span style={{ fontWeight: 400, marginLeft: '4px' }}>
                                You have full access to proprietary market volume and regional performance data.
                            </span>
                        </Typography>
                    </Alert>
                )}

                <Paper className="premium-card" sx={{ p: 4, mb: 6, borderRadius: '24px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                        <DashboardOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Discovery Filters</Typography>
                    </Box>
                    <Filters filters={filters} setFilters={setFilters} />
                </Paper>

                <Grid container spacing={4}>
                    <Grid item xs={12} lg={8}>
                        <Paper className="premium-card" sx={{
                            p: 2, 
                            height: { xs: 500, lg: 700 },
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}>
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MapOutlined sx={{ color: 'primary.main' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Geospatial Distribution</Typography>
                                </Box>
                                <Chip
                                    label="Live Feed"
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                        color: 'secondary.main',
                                        fontWeight: 700,
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }}
                                />
                            </Box>
                            <Box sx={{ flexGrow: 1, minHeight: 0, borderRadius: '20px', overflow: 'hidden', m: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Map properties={properties} />
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Charts filters={debouncedFilters} layout="sidebar" />
                    </Grid>

                    {user?.role === 'Admin' && (
                        <Grid item xs={12}>
                            <Paper className="premium-card" sx={{ p: 4, borderRadius: '28px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Regional Performance</Typography>
                                        <Typography variant="body2" color="text.secondary">Comparative analysis of key market metrics by region</Typography>
                                    </Box>
                                    <Button size="small" variant="outlined" sx={{ borderRadius: '10px' }}>Export Data</Button>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Region</TableCell>
                                                <TableCell align="right">Active Units</TableCell>
                                                <TableCell align="right">Avg Valuation</TableCell>
                                                <TableCell align="right">Market Volume</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {adminData.map((row) => (
                                                <TableRow key={row._id} hover>
                                                    <TableCell component="th" scope="row">
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{row._id}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.count}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" sx={{ color: 'primary.light', fontWeight: 700 }}>
                                                            ${row.avgPrice ? row.avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                            ${row.totalVolume ? row.totalVolume.toLocaleString() : 'N/A'}
                                                        </Typography>
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
