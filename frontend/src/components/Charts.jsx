import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Box, Typography, Paper, Grid } from '@mui/material';
import api from '../api/axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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

                // Map data and ensure values are numbers
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
        <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 7 }}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Price Trends (Avg Price per Month)</Typography>
                    {priceTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={priceTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${Math.round(value).toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="avgPrice" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Avg Price" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="90%">
                            <Typography color="textSecondary">No data available</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>Property Type Distribution</Typography>
                    {typeDist.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={typeDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {typeDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="90%">
                            <Typography color="textSecondary">No data available</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
            <Grid size={12}>
                <Paper sx={{ p: 2, height: 350 }}>
                    <Typography variant="h6" gutterBottom>Region Comparison (Avg Price)</Typography>
                    {regionDist.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={regionDist}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${Math.round(value).toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="avgPrice" fill="#00C49F" name="Avg Price" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" height="90%">
                            <Typography color="textSecondary">No data available</Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}
