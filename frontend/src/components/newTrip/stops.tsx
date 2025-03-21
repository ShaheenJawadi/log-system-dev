import { Box, Slide, styled } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useMapUtils } from "../../context/mapContext";
import { useEffect, useState } from "react";

const StopsBox = styled(Slide)(({ theme }) => ({
 
  maxWidth: "30%",
  backgroundColor: "#000",
  minWidth: 200,
}));

const TripStops = () => {
  const { tripStops } = useMapUtils();
 
  return (
    <PerfectScrollbar>
      <StopsBox
        direction="up"
        in={tripStops.length > 0}
        mountOnEnter
        unmountOnExit 
      >
      
          <Box>
            stops
          </Box>
 
      </StopsBox>
    </PerfectScrollbar>
  );
};

export default TripStops;
