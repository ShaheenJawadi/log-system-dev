import React from "react";
import { Box } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const NewTrip: React.FC = () => {
  return (
    <Box>
      <MapContainer zoom={10} scrollWheelZoom={false}>
        <TileLayer
          attribution=' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </Box>
  );
};

export default NewTrip;
