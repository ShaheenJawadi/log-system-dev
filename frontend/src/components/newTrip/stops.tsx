import { alpha, Box, Slide, Stack, styled } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useMapUtils } from "../../context/mapContext";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot, {
  TimelineDotPropsColorOverrides,
} from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import moment from "moment";
import Typography from "@mui/material/Typography";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import OutboxIcon from "@mui/icons-material/Outbox";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { Stop } from "../../types/trip";
import { transparentColor } from "../../utils/constatnts";
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
const StopsBox = styled(Slide)(({ theme }) => ({
  maxWidth: "25vw",
  height: "100%", 
   backgroundColor: alpha(transparentColor, 0.45),
   minWidth: 300,
}));

const TripStops = () => {
  const { tripStops } = useMapUtils();

  const manageUi = (stop: Stop) => {
    switch (stop.stop_type) {
      case "rest":
        return {
          icon: <AirlineSeatIndividualSuiteIcon />,
          color: "warning",
          title: "Mandatory Rest",
        };
      case "dropoff":
        return {
          icon: <OutboxIcon />,
          color: "primary",
          title: "Dropoff Location",
        };
      case "fuel":
        return {
          icon: <LocalGasStationIcon />,
          color: "info",
          title: "Fuel Stop",
        };
        case "reset":
        return {
          icon: <NotificationsPausedIcon />,
          color: "error",
          title: "34 hour reset",
        };
      default:
        return {
          icon: <MoveToInboxIcon />,
          color: "secondary",
          title: "Pickup Location",
        };
    }
  };

  return (
    <StopsBox
      direction="up"
      in={tripStops.length > 0}
      mountOnEnter
      unmountOnExit
    >
      <Box>
        <PerfectScrollbar>
          <Stack spacing={3}>
  
            <Stack
              spacing={4}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                 
                color: "#fff",
                padding: 2,
                backgroundColor: alpha("#008080", 0.5),
              }}
            >
              <ViewTimelineIcon />
              <Typography fontWeight={600} textAlign={"center"} variant="h6">
                Stops timeline
              </Typography>
            </Stack>
            <Box width={"100%"}>
              <Timeline position="left">
                {tripStops.map((stop, index) => (stop.stop_type as string) !== "driving" && (
                  
                  <TimelineItem>
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      align="right"
                      variant="body2"
                      color="#fff"
                    >
                      <Stack direction="column" spacing={1}>
                        <Typography   variant="body2">
                          Expected
                        </Typography>
                        <Typography fontSize={13}>
                          Arrival: 
                          {moment
                            .utc(stop.arrival_time)
                            .format("MM-DD-YYYY hh:mm A")}
                        </Typography>
                        <Typography fontSize={13}>
                          Departure: 
                          {moment
                            .utc(stop.departure_time)
                            .format("MM-DD-YYYY hh:mm A")}
                        </Typography>
                      </Stack>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot
                        color={
                          manageUi(stop).color as
                            | "secondary"
                            | "inherit"
                            | "warning"
                            | "primary"
                            | "error"
                            | "grey"
                            | "success"
                            | "info"
                        }
                      >
                        {manageUi(stop).icon}
                      </TimelineDot>
                      <TimelineConnector
                        color={
                          manageUi(stop).color as
                            | "secondary"
                            | "inherit"
                            | "warning"
                            | "primary"
                            | "error"
                            | "grey"
                            | "success"
                            | "info"
                        }
                      />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }} color="#fff">
                      <Typography
                        variant="body1"
                        color={
                          manageUi(stop).color as
                            | "secondary"
                            | "inherit"
                            | "warning"
                            | "primary"
                            | "error"
                            | "grey"
                            | "success"
                            | "info"
                        }
                        fontWeight={700}
                        component="span"
                      >
                        {manageUi(stop).title}
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
        </PerfectScrollbar>
      </Box>
    </StopsBox>
  );
};

export default TripStops;
