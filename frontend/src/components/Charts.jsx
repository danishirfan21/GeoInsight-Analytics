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

export default function Charts({ filters }) {
    const [priceTrends, setPriceTrends] = useState([]);
    const [typeDist, setTypeDist] = useState([]);
    const [regionDist, setRegionDist] = useState([]);

    useEffect(() => {
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

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} lg={7}>
                <Paper sx={{ p: 4, height: 450, borderRadius: '24px' }}>
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>Market Price Velocity</Typography>
                    {priceTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={priceTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="avgPrice" 
                                    stroke="#3b82f6" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                                    activeDot={{ r: 8, strokeWidth: 0 }} 
                                    name="Avg Price" 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="85%">
                            <Typography color="textSecondary">No trend data available</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
            <Grid item xs={12} lg={5}>
                <Paper sx={{ p: 4, height: 450, borderRadius: '24px' }}>
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>Portfolio Composition</Typography>
                    {typeDist.length > 0 ? (
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={typeDist}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="name"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {typeDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="85%">
                            <Typography color="textSecondary">No composition data</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 4, height: 400, borderRadius: '24px' }}>
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>Regional Valuations (Avg USD)</Typography>
                    {regionDist.length > 0 ? (
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={regionDist} barSize={60}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="avgPrice" radius={[10, 10, 0, 0]} name="Avg Price">
                                    {regionDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="85%">
                            <Typography color="textSecondary">No regional data available</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}
