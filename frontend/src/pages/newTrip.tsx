import { useState, useEffect } from "react";

import "leaflet/dist/leaflet.css";
import { Box, Stack, useTheme } from "@mui/material";
import TripDetails from "../components/newTrip/tripDetails";

import TripStops from "../components/newTrip/stops";
import MapComponant from "../components/map";
import { headerHeight } from "../utils/constatnts";

const NewTrip: React.FC = () => {
  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <TripDetails />

      <Stack direction={"row"} height={"100%"} sx={{ maxHeight: `calc(100vh - ${headerHeight}px)` }}>
  
                <TripStops />
      
        <Box flex={1}>
          <MapComponant />
        </Box>
      </Stack>
    </Box>
  );
};

export default NewTrip;
