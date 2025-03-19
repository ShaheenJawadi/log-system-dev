import NearMeIcon from "@mui/icons-material/NearMe";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import FlagIcon from "@mui/icons-material/Flag";
import {
  styled,
  Box,
  alpha,
  TextField,
  Stack,
  Button,
  InputAdornment,
  Typography,
  Autocomplete,
} from "@mui/material";

const StyledBoxContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha("#1f2537", 0.4),
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

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

interface TripDetailsProps {
  setCurrentLocation: (location: Location | null) => void;
  setPickup: (location: Location | null) => void;
  setDropoff: (location: Location | null) => void;
  setSearchQuery: (query: string) => void;
  suggestions: Location[];
  isFormValid: boolean;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  setCurrentLocation,
  setPickup,
  setDropoff,
  setSearchQuery,
  suggestions,
  isFormValid,
}) => {
  return (
    <StyledBoxContainer>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" textAlign="center" fontWeight={"bold"} color="white">
            Start a new trip
          </Typography>
        </Box>

        <Autocomplete
          options={suggestions}
          getOptionLabel={(option) => option.display_name}
          onInputChange={(_, value) => setSearchQuery(value)}
          onChange={(_, value) => setCurrentLocation(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Current Location"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <MyLocationIcon color="error" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          options={suggestions}
          getOptionLabel={(option) => option.display_name}
          onInputChange={(_, value) => setSearchQuery(value)}
          onChange={(_, value) => setPickup(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pickup location"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <NearMeIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          options={suggestions}
          getOptionLabel={(option) => option.display_name}
          onInputChange={(_, value) => setSearchQuery(value)}
          onChange={(_, value) => setDropoff(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dropoff location"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Button
          size="large"
          variant="contained"
          color="primary"
          disabled={!isFormValid}
        >
          Generate an optimized route
        </Button>
      </Stack>
    </StyledBoxContainer>
  );
};

export default TripDetails;
