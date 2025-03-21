import NearMeIcon from "@mui/icons-material/NearMe";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import FlagIcon from "@mui/icons-material/Flag";
import ReplayIcon from "@mui/icons-material/Replay";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
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
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { TripLocation } from "../../types/trip";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SpeedIcon from "@mui/icons-material/Speed";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMapUtils } from "../../context/mapContext";
import { transparentColor } from "../../utils/constatnts";

const StyledBoxContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(transparentColor, 0.4),
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
      <Stack spacing={4} mb={5}>
        <Stack flexDirection={"row-reverse"}>
          <IconButton size="large" sx={{ color: "red" }}>
            <DeleteForeverIcon />
          </IconButton>
        </Stack>

        <Button
          onClick={() => generateRoute()}
          size="large"
          variant="contained"
          startIcon={<ViewTimelineIcon />}
          color="secondary"
        >
          Display ELD LOGS
        </Button>

        <Button
          onClick={() => generateRoute()}
          size="large"
          variant="contained"
          startIcon={<ReplayIcon />}
          color="warning"
        >
          Plan new trip
        </Button>
      </Stack>
      <Stack spacing={4}>
        <Autocomplete
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "8px",
              marginTop: "-13px",
              paddingTop: "15px",
            },
          }}
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

        <FormControl variant="outlined">
          <InputLabel>Current Cycle Used (Hrs) </InputLabel>
          <OutlinedInput
            type="text"
            name="username"
            label="Current Cycle Used (Hrs)"
            startAdornment={
              <InputAdornment position="start">
                <HourglassBottomIcon color="warning" />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl
          sx={{
            "& .MuiInputBase-root": {
              marginTop: "-15px",
              paddingTop: "15px",
            },
          }}
          variant="outlined"
        >
          <InputLabel>Average driving speed </InputLabel>
          <OutlinedInput
            type="text"
            label="Average driving speed"
            startAdornment={
              <InputAdornment position="start">
                <SpeedIcon color="warning" />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel>Current date-time </InputLabel>
          <OutlinedInput
            type="text"
            name="username"
            label="Current date-time"
            startAdornment={
              <InputAdornment position="start">
                <AccessTimeFilledIcon color="warning" />
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          startIcon={<AutoFixHighIcon />}
          onClick={() => generateRoute()}
          size="large"
          variant="contained"
          color="primary"
          disabled={!isFormValid}
        >
          Generate a trip plan
        </Button>
      </Stack>
    </StyledBoxContainer>
  );
};

export default TripDetails;
