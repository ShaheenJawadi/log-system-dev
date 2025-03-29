import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import RouteIcon from "@mui/icons-material/Route";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import MapIcon from "@mui/icons-material/Map";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { useDialog } from "../../context/dialogContext";
import * as tripService from "../../services/tripServices";
import { useEffect, useState } from "react";
import { Trip } from "../../types/trip";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../routes/paths";
import EmptyComponant from "../../components/empty";
const TripsHistory = () => {
  const { openDialog, refresh } = useDialog();

  const navigate = useNavigate();
  const [tripData, setTripData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  const fetchList = async () => {
    try {
      const response = await tripService.getListTrip();

      setTripData(response);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [refresh]);
  const action = (target: string, id: number, logId: number | null = null) => {
    if (target === "map") {
      navigate(appPaths.singleTrip.replace(":id", id.toString()));
    }
    if (target === "del") {
      openDialog("deleteTrip", { id: id });
    }
    if (target === "log" && logId) {
      navigate(appPaths.singleLog.replace(":id", logId.toString()));
    }
  };

  return (
    <>
       {
        tripData.length === 0 ? (
          <EmptyComponant target="Trips" />
        ) : ( <Container>
          <Grid container spacing={2} marginY={5}>
            {tripData.map((trip) => (
              <SingleGrid
                action={(target) => action(target, trip.id, trip.first_log_day)}
                trip={trip}
              />
            ))}
          </Grid>
        </Container>)
       }
     
    </>
  );
};

const SingleGrid = ({
  trip,
  action,
}: {
  trip: Trip;
  action: (target: string) => void;
}) => {
  return (
    <Grid size={6} sx={{'& .MuiPaper-root': {
            height: '100%',   
          } }} className="grsqdqsdsqitem">
      <Card>
        <CardContent  sx={{height: '100%'}}>
          <Stack  sx={{height: '100%'}} spacing={5}>
            <Box>
              <Typography
                textAlign={"center"}
                fontWeight={600}
                variant="h5"
                color="primary"
              >
                {trip.trip_date }
              </Typography>
            </Box>
            <Divider />
            <Stack  flex={1} spacing={3}>
              <Stack flex={1} direction={"row"}>
                <Typography variant="h6" color="secondary">
                  Start location:
                </Typography>
                <Typography variant="body1">
                  {" "}
                  {trip.current_location_details.address}
                </Typography>
              </Stack>
              <Stack flex={1} direction={"row"}>
                <Typography variant="h6" color="secondary">
                  Pickup:
                </Typography>
                <Typography variant="body1">
                  {" "}
                  {trip.pickup_location_details.address}
                </Typography>
              </Stack>
              <Stack flex={1} direction={"row"}>
                <Typography variant="h6" color="secondary">
                  Dropoff:
                </Typography>
                <Typography variant="body1">
                  {" "}
                  {trip.dropoff_location_details.address}
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={3} justifyContent={"center"} direction={"row"}>
              <Stack spacing={1} direction={"row"}>
                <DateRangeIcon color="primary" />
                <Typography
                  textAlign={"center"}
                  variant="body2"
                  fontWeight={600}
                >
                  Total Days:
                </Typography>
                <Typography>{trip.log_days_count}</Typography>
              </Stack>
              <Stack spacing={1} direction={"row"}>
                <LocalGasStationIcon color="error" />
                <Typography
                  textAlign={"center"}
                  variant="body2"
                  fontWeight={600}
                >
                  Fueling:
                </Typography>
                <Typography>{trip.fuel_count}</Typography>
              </Stack>

              <Stack spacing={1} direction={"row"}>
                <HotelIcon color="warning" />
                <Typography
                  textAlign={"center"}
                  variant="body2"
                  fontWeight={600}
                >
                  Rest:
                </Typography>
                <Typography>{trip.rest_count}</Typography>
              </Stack>
              <Stack spacing={1} direction={"row"}>
                <RouteIcon color="primary" />
                <Typography
                  textAlign={"center"}
                  variant="body2"
                  fontWeight={600}
                >
                  Total Miles:
                </Typography>
                <Typography>{trip?.total_distance}</Typography>
              </Stack>
              <Stack direction={"row"}></Stack>
            </Stack>
            <Divider />

            <Stack spacing={3} justifyContent={"end"} direction={"row"}>
              <Button
                onClick={() => action("del")}
                startIcon={<DeleteIcon />}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
              <Button
                disabled={!trip.first_log_day}
                onClick={() => action("log")}
                startIcon={<ShowChartIcon />}
                variant="contained"
                color="warning"
              >
                Open log
              </Button>
              <Button
                onClick={() => action("map")}
                startIcon={<MapIcon />}
                variant="contained"
                color="primary"
              >
                overview on map
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TripsHistory;
