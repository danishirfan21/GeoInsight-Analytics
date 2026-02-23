import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Box, FormControlLabel, Switch } from '@mui/material';

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

    // Helper to determine color based on price
    const getColor = (price) => {
        return price > 800000 ? '#f03' :
               price > 600000 ? '#f90' :
               price > 400000 ? '#ff0' :
               '#0f0';
    };

    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, bgcolor: 'rgba(255,255,255,0.8)', p: 0.5, borderRadius: 1 }}>
                <FormControlLabel
                    control={<Switch checked={showHeatmap} onChange={(e) => setShowHeatmap(e.target.checked)} size="small" />}
                    label="Heatmap Mode"
                />
            </Box>
            <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {!showHeatmap ? (
                    properties.map(property => (
                        <Marker key={property._id} position={[property.coordinates.lat, property.coordinates.lng]}>
                            <Popup>
                                <strong>{property.title}</strong><br />
                                Price: ${property.price.toLocaleString()}<br />
                                Type: {property.type}<br />
                                Region: {property.region}
                            </Popup>
                        </Marker>
                    ))
                ) : (
                    properties.map(property => (
                        <CircleMarker
                            key={`heat-${property._id}`}
                            center={[property.coordinates.lat, property.coordinates.lng]}
                            radius={15}
                            fillOpacity={0.4}
                            stroke={false}
                            fillColor={getColor(property.price)}
                        >
                            <Popup>
                                Price: ${property.price.toLocaleString()}<br />
                                Region: {property.region}
                            </Popup>
                        </CircleMarker>
                    ))
                )}
            </MapContainer>
        </Box>
    );
}
