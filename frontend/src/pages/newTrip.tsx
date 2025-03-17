import React from "react";
import { Box } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Height } from "@mui/icons-material";

const NewTrip: React.FC = () => {
  return (
    <Box sx={{height:"100%"}}  >
      <MapContainer  center={[51.505, -0.09]}  zoom={10} scrollWheelZoom={false}  style={{ width: '100%', height: '100%' }} >
        <TileLayer
          attribution=' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </Box>
  );
};

export default NewTrip;
