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
  Popper,
} from "@mui/material";
import { TripLocation } from "../../types/trip";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMapUtils } from "../../context/mapContext";

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
 

const TripDetails: React.FC = () => {
  const {
    isFormValid,
    setCurrentLocation,
    setPickup,
    setDropoff,
    generateRoute,
  } = useMapUtils();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TripLocation[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 4) {
        try {
          const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: {
                format: "json",
                q: searchQuery,
              },
              headers: {
                "Accept-Language": "en",
              },
            }
          );

          console.log(response.data);
          setSuggestions(
            response.data.map((item: any) => ({
              address: item.display_name,
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lon),
            }))
          );
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 1050);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <StyledBoxContainer>
      <Stack spacing={4}>
        <Box>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={"bold"}
            color="white"
          >
            Start a new trip
          </Typography>
        </Box>

        <Autocomplete
          noOptionsText={
            searchQuery.length < 4
              ? "Type at least 4 characters..."
              : "No results found"
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.elements.popper.style.zIndex = "9999";
                  },
                },
              ],
            },
          }}
          options={suggestions}
          getOptionLabel={(option) => option.address}
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
          noOptionsText={
            searchQuery.length < 4
              ? "Type at least 4 characters..."
              : "No results found"
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.elements.popper.style.zIndex = "9999";
                  },
                },
              ],
            },
          }}
          options={suggestions}
          getOptionLabel={(option) => option.address}
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
          noOptionsText={
            searchQuery.length < 4
              ? "Type at least 4 characters..."
              : "No results found"
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: ({ state }) => {
                    state.elements.popper.style.zIndex = "9999";
                  },
                },
              ],
            },
          }}
          options={suggestions}
          getOptionLabel={(option) => option.address}
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
