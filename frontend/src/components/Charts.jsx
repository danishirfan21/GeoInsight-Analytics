import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Box, Typography, Paper, Grid, Skeleton } from '@mui/material';
import api from '../api/axios';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const isPrice = payload[0].name === 'Avg Price';
        const value = payload[0].value;
        const color = payload[0].payload.fill || payload[0].color || '#6366f1';
        
        return (
            <Box sx={{ 
                bgcolor: 'rgba(2, 6, 23, 0.95)',
                p: 2, 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(12px)',
                minWidth: '160px'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {!isPrice && (
                        <Box sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            bgcolor: color, 
                            mr: 1 
                        }} />
                    )}
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {payload[0].payload.name || label}
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                    {isPrice ? `$${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                    {isPrice ? 'Average Listing Price' : 'Total Properties'}
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
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500 }}>{value}</span>}
                                />
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
