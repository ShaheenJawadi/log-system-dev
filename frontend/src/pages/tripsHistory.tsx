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
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MapIcon from '@mui/icons-material/Map';
import DeleteIcon from '@mui/icons-material/Delete';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
const TripsHistory = () => {
  return (
    <Container>
      <Grid container spacing={2} marginY={5}>
        <Grid size={6}>
          <Card>
            <CardContent>
              <Stack spacing={5}>
                <Box>
                  <Typography textAlign={"center"} fontWeight={600} variant="h5" color="primary">
                    04/12/1998
                  </Typography>
                </Box>
                <Divider/>
                <Stack spacing={3}  >
                <Stack flex={1} >
                    <Typography variant="h6" color="secondary">
                      Start location:  
                    </Typography>
                    <Typography variant="body1"> {/* TT */} 
                    </Typography>
                  </Stack>
                  <Stack flex={1} direction={"row"}>
                    <Typography variant="h6" color="secondary">
                      Pickup:  
                    </Typography>
                    <Typography variant="body1"> {/* TT */} 
                    </Typography>
                  </Stack>
                  <Stack flex={1} direction={"row"}>
                    <Typography variant="h6" color="secondary">
                      Dropoff:  
                    </Typography>
                    <Typography variant="body1"> {/* TT */} 
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
                    <Typography>500</Typography>
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
                    <Typography>2</Typography>
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
                    <Typography>4</Typography>
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
                    <Typography>500</Typography>
                  </Stack>
                  <Stack direction={"row"}></Stack>
                </Stack>
                <Divider/>

                <Stack spacing={3} justifyContent={"end"} direction={"row"}>
                  <Button startIcon={<DeleteIcon/>} variant="contained" color="error">
                    Delete
                  </Button>
                  <Button startIcon={<ShowChartIcon/>} variant="contained" color="warning">
                    Open log
                  </Button>
                  <Button startIcon={<MapIcon/>} variant="contained" color="primary">
                  overview on map
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TripsHistory;
