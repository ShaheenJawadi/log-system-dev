import React from "react";
import { Box } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";

import TripDetails from "../components/newTrip/tripDetails";
import "leaflet/dist/leaflet.css";
import { headerHeight } from "../utils/constatnts";
const NewTrip: React.FC = () => {
  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <TripDetails />
      <MapContainer
        center={[51.505, -0.09]}
        zoom={100}
        scrollWheelZoom={true}
        style={{ width: "100%", height: `calc(100vh - ${headerHeight}px)` , flex: 1}}  
      >
        <TileLayer
          attribution=' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </Box>
  );
};

export default NewTrip;
