import { useState, useEffect } from "react";
 
import "leaflet/dist/leaflet.css";
import { Box, Stack, useTheme } from "@mui/material";
import TripDetails from "../components/newTrip/tripDetails";
 
import TripStops from "../components/newTrip/stops";
import MapComponant from "../components/map";

const NewTrip: React.FC = () => {
  return (
    <Stack direction={"row"} sx={{ height: "100%", position: "relative" }}>
      <TripDetails />
      <TripStops />
      <Box flex={1}>
        <MapComponant />
      </Box>
    </Stack>
  );
};

export default NewTrip;
