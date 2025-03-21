import { Box, Slide, Stack, styled } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useMapUtils } from "../../context/mapContext";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot, { TimelineDotPropsColorOverrides } from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import moment from "moment";
import Typography from "@mui/material/Typography";
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { Stop } from "../../types/trip";

const StopsBox = styled(Slide)(({ theme }) => ({
  maxWidth: "30vw",
  backgroundColor: "#fff",
  height: "100%",
}));

const TripStops = () => {
  const { tripStops } = useMapUtils();

  const manageUi =(stop:Stop)=>{ 
   switch(stop.stop_type){
      case 'rest':
        return{
            icon :<AirlineSeatIndividualSuiteIcon/>,
            color :"warning",
            title : "Mandatory Rest",
            }
      case 'dropoff':
        return  {
            icon :<OutboxIcon/>,
            color :"primary",
            title : "Dropoff Location",
            }
      case 'fuel': 
      return{
            icon :<LocalGasStationIcon/>,
            color :"info",
            title : "Fuel Stop",
            }
      default: 
        return{
            icon :<MoveToInboxIcon/>,
            color :"secondary",
            title : "Pickup Location",
            }
    }
  }

  return (
    <PerfectScrollbar>
      <StopsBox
        direction="up"
        in={tripStops.length > 0}
        mountOnEnter
        unmountOnExit
      >
        <Stack spacing={3}>
           <Stack spacing={4} direction={"row"} justifyContent={"center"} alignItems={"center"} sx={{backgroundColor:"primary.main", color:"#fff", padding:2}}>
            <ViewTimelineIcon />
          <Typography textAlign={"center"} variant="h6">
            Stops timeline
          </Typography>
        </Stack>
        <Box width={"100%"}>
          <Timeline position="left">
            {tripStops.map((stop, index) => (
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align="right"
                  variant="body2"
                >
                  <Stack direction="column" spacing={1}>
                    <Typography color="text.secondary" variant="body2">
                      Expected  
                    </Typography>
                    <Typography fontSize={13}>
                      Arrival: {moment.utc(stop.arrival_time).format("MM/DD/YYYY hh:mm A")}
                    </Typography>
                    <Typography fontSize={13}>
                      Departure:{" "}
                      {moment.utc(stop.departure_time).format("MM/DD/YYYY hh:mm A")}
                    </Typography>
                  </Stack>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color={manageUi(stop).color as "secondary" | "inherit" | "warning" | "primary" | "error" | "grey" | "success" | "info" }>
                   {manageUi(stop).icon}
                  </TimelineDot>
                  <TimelineConnector color={manageUi(stop).color as "secondary" | "inherit" | "warning" | "primary" | "error" | "grey" | "success" | "info"} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "12px", px: 2 }}>
                  <Typography variant="body1" color={manageUi(stop).color as "secondary" | "inherit" | "warning" | "primary" | "error" | "grey" | "success" | "info"} fontWeight={700} component="span"   >
                    { manageUi(stop).title}
                  </Typography>
                  <Typography fontSize={12}> 
                    {stop.location_details.address}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
        </Stack>
       
      </StopsBox>
    </PerfectScrollbar>
  );
};

export default TripStops;
