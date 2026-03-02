import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Box, Typography, Paper, Grid, Skeleton } from '@mui/material';
import api from '../api/axios';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{ 
                bgcolor: 'rgba(15, 23, 42, 0.95)',
                p: 2, 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)'
            }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.light', fontWeight: 800 }}>
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const [trendsRes, typeRes] = await Promise.all([
                    api.get('/analytics/price-trends', { params: filters }),
                    api.get('/analytics/property-type-distribution', { params: filters })
                ]);

                setPriceTrends(trendsRes.data.map(item => ({
                    name: item._id || 'Unknown',
                    avgPrice: Number(item.avgPrice) || 0
                })));

                setTypeDist(typeRes.data.map(item => ({
                    name: item._id || 'Unknown',
                    count: Number(item.count) || 0
                })));
            } catch (err) {
                console.error('Error fetching analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [filters]);

    const isSidebar = layout === 'sidebar';

    if (loading) {
        return (
            <Grid container spacing={4}>
                <Grid item xs={12}><Skeleton variant="rounded" height={isSidebar ? 330 : 450} sx={{ borderRadius: '24px' }} /></Grid>
                <Grid item xs={12}><Skeleton variant="rounded" height={isSidebar ? 330 : 450} sx={{ borderRadius: '24px' }} /></Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={4}>
            {/* Price Trend Chart */}
            <Grid item xs={12}>
                <Paper className="premium-card" sx={{ p: 3, height: isSidebar ? 330 : 450, borderRadius: '24px' }}>
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>Market Price Velocity</Typography>
                    {priceTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={priceTrends}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    hide={isSidebar}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    hide={isSidebar}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone" 
                                    dataKey="avgPrice" 
                                    stroke="#6366f1"
                                    strokeWidth={3} 
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    name="Avg Price" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Insufficient trend data</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>

            {/* Distribution Chart */}
            <Grid item xs={12}>
                <Paper className="premium-card" sx={{ p: 3, height: isSidebar ? 330 : 450, borderRadius: '24px' }}>
                    <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>Portfolio Composition</Typography>
                    {typeDist.length > 0 ? (
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={typeDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={isSidebar ? 60 : 100}
                                    outerRadius={isSidebar ? 85 : 140}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="name"
                                    stroke="none"
                                >
                                    {typeDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No composition data</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}
