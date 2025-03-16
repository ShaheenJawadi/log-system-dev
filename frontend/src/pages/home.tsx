import React from "react"; 
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; 
const Home: React.FC = () => {
  return (
    <Stack minHeight={1500} spacing={25}>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Next Fuel /stop /rest </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Alert/ Next break </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Driving cycle </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={25}>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">BTN* My logs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">BTN* Display Map</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">BTN* New Trip</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Home;
