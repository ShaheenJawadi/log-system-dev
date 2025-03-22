 
import "leaflet/dist/leaflet.css";
import { Box, Stack, useTheme } from "@mui/material";
import TripDetails from "../../components/newTrip/tripDetails";

import TripStops from "../../components/newTrip/stops";
import MapComponant from "../../components/map";
import { headerHeight } from "../../utils/constatnts";

const NewTrip: React.FC = () => {
  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <TripDetails />

      <Stack
        direction={"row"}
        height={"100%"}
        sx={{
          maxHeight: `calc(100vh - ${headerHeight}px)`,
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute" , zIndex: 9999, top: 0, left: 0, height: "100%", width: "30%" }} minHeight={"100%"}>
     
          <TripStops />
        </Box>

        <Box flex={1}>
          <MapComponant />
        </Box>
      </Stack>
    </Box>
  );
};

export default NewTrip;
