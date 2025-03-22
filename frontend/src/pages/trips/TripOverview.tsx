
import { useState, useEffect } from "react";

import "leaflet/dist/leaflet.css";
import { Box, Stack, useTheme } from "@mui/material";
import TripDetails from "../../components/newTrip/tripDetails";

import TripStops from "../../components/newTrip/stops";
import MapComponant from "../../components/map";
import { headerHeight } from "../../utils/constatnts";
import NewTrip from "./newTrip";

const TripOverView: React.FC = () => {
    return (
      <>
        <NewTrip/>
      </>
    );
  };
  
  export default TripOverView;