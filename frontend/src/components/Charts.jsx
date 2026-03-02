import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Box, Typography, Paper, Grid } from '@mui/material';
import api from '../api/axios';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{ 
                bgcolor: 'rgba(30, 41, 59, 0.9)', 
                p: 2, 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{label}</Typography>
                <Typography variant="h6" sx={{ color: 'primary.light', fontWeight: 700 }}>
                    {payload[0].name}: ${Number(payload[0].value).toLocaleString()}
                </Typography>
            </Box>
        );
    }
    return null;
};

export default function Charts({ filters, layout }) {
    const [priceTrends, setPriceTrends] = useState([]);
    const [typeDist, setTypeDist] = useState([]);
    const [regionDist, setRegionDist] = useState([]);

    useEffect(() => {
        // ... (fetch logic remains same)
        const fetchAnalytics = async () => {
            try {
                const [trendsRes, typeRes, regionRes] = await Promise.all([
                    api.get('/analytics/price-trends', { params: filters }),
                    api.get('/analytics/property-type-distribution', { params: filters }),
                    api.get('/analytics/region-distribution', { params: filters })
                ]);

                setPriceTrends(trendsRes.data.map(item => ({
                    name: item._id || 'Unknown',
                    avgPrice: Number(item.avgPrice) || 0
                })));

                setTypeDist(typeRes.data.map(item => ({
                    name: item._id || 'Unknown',
                    count: Number(item.count) || 0
                })));

                setRegionDist(regionRes.data.map(item => ({
                    name: item._id || 'Unknown',
                    avgPrice: Number(item.avgPrice) || 0
                })));
            } catch (err) {
                console.error('Error fetching analytics', err);
            }
        };
        fetchAnalytics();
    }, [filters]);

    const isSidebar = layout === 'sidebar';

    return (
        <Grid container spacing={3}>
            {/* Price Trend Chart */}
            <Grid size={12}>
                <Paper sx={{ p: 3, height: isSidebar ? 310 : 450, borderRadius: '24px' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Market Price Velocity</Typography>
                    {priceTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={priceTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" hide={isSidebar} />
                                <YAxis hide={isSidebar} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="avgPrice" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    dot={!isSidebar} 
                                    name="Avg Price" 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Insufficient trend data</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>

            {/* Distribution Chart */}
            <Grid size={12}>
                <Paper sx={{ p: 3, height: isSidebar ? 310 : 450, borderRadius: '24px' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Portfolio Composition</Typography>
                    {typeDist.length > 0 ? (
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={typeDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={isSidebar ? 40 : 80}
                                    outerRadius={isSidebar ? 60 : 120}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="name"
                                >
                                    {typeDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                {!isSidebar && <Legend verticalAlign="bottom" height={36} />}
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No composition data</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>

            {/* Region Chart if NOT sidebar (or we can add more charts here) */}
            {!isSidebar && (
                <Grid size={12}>
                    <Paper sx={{ p: 4, height: 400, borderRadius: '24px' }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Regional Valuations (Avg USD)</Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={regionDist} barSize={60}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="avgPrice" radius={[10, 10, 0, 0]}>
                                    {regionDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            )}
        </Grid>
    );
}
