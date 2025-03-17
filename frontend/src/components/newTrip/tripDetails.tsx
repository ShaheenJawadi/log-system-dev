import NearMeIcon from "@mui/icons-material/NearMe";
import {
  styled,
  Box,
  alpha,
  TextField,
  Stack,
  Button,
  InputAdornment,
  Typography,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import FlagIcon from "@mui/icons-material/Flag";
const StyledBoxContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha("#6f5157", 0.4),
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 9999,
  width: "30%",
  maxWidth: 350,
  margin: theme.spacing(2),
  backdropFilter: "blur(2px)",
}));

const TripDetails = () => {
  return (
    <StyledBoxContainer>
      <Stack spacing={4}>
        <Box>
            <Typography variant="h5" textAlign={"center"} color="secondary">Start a new trip</Typography>
        </Box>
        <Box>
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MyLocationIcon color="error" />
                  </InputAdornment>
                ),
              },
            }}
            label="Current Location"
            variant="outlined"
          />
        </Box>

        <Box>
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <NearMeIcon color="error" />
                  </InputAdornment>
                ),
              },
            }}
            label="Pickup location"
            variant="outlined"
          />
        </Box>
        <Box>
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagIcon color="error" />
                  </InputAdornment>
                ),
              },
            }}
            label="Dropoff location"
            variant="outlined"
          />
        </Box>
        <Button size="large" variant="contained" color="primary">
          Generate an optimized route
        </Button>
      </Stack>
    </StyledBoxContainer>
  );
};

export default TripDetails;
