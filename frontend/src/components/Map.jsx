import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Box, FormControlLabel, Switch, Typography, Paper } from '@mui/material';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ properties }) {
    const [showHeatmap, setShowHeatmap] = useState(false);
    const center = [51.505, -0.09]; // Default center (London area as per seed)

    // Helper to determine color based on price - Premium Palette
    const getColor = (price) => {
        return price > 800000 ? '#ef4444' : // Red 500
               price > 600000 ? '#f59e0b' : // Amber 500
               price > 400000 ? '#6366f1' : // Indigo 500
               '#10b981'; // Emerald 500
    };

    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <Box sx={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                zIndex: 1000, 
            }}>
                <Paper sx={{
                    p: '6px 16px',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <FormControlLabel
                        control={<Switch checked={showHeatmap} onChange={(e) => setShowHeatmap(e.target.checked)} size="small" color="primary" />}
                        label={<Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.02em' }}>HEATMAP MODE</Typography>}
                    />
                </Paper>
            </Box>
            <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {!showHeatmap ? (
                    properties.map(property => (
                        <Marker key={property._id} position={[property.coordinates.lat, property.coordinates.lng]}>
                            <Popup>
                                <Box sx={{ p: 0.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.light', mb: 0.5 }}>
                                        {property.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Price: <span style={{ color: '#fff' }}>${property.price.toLocaleString()}</span>
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        Type: {property.type} | Region: {property.region}
                                    </Typography>
                                </Box>
                            </Popup>
                        </Marker>
                    ))
                ) : (
                    properties.map(property => (
                        <CircleMarker
                            key={`heat-${property._id}`}
                            center={[property.coordinates.lat, property.coordinates.lng]}
                            radius={20}
                            fillOpacity={0.5}
                            stroke={false}
                            fillColor={getColor(property.price)}
                        >
                            <Popup>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                    Value: ${property.price.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Location: {property.region}
                                </Typography>
                            </Popup>
                        </CircleMarker>
                    ))
                )}
            </MapContainer>
        </Box>
    );
}
