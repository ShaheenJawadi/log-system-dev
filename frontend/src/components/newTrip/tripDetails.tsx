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

import { Trip, TripLocation } from "../../types/trip";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SpeedIcon from "@mui/icons-material/Speed";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMapUtils } from "../../context/mapContext";
import { transparentColor } from "../../utils/constatnts";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../routes/paths";

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
  const { isDispayData } = useMapUtils();

  return (
    <StyledBoxContainer>
      {isDispayData ? <DisplayTripDetails /> : <TripDetailsForm />}
    </StyledBoxContainer>
  );
};
const TripDetailsForm: React.FC = () => {
  const {
    isFormValid,
    setCurrentLocation,
    setPickup,
    setDropoff,
    generateRoute,
  } = useMapUtils();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TripLocation[]>([]);

  const inputBoxing = {
    "& .MuiInputBase-root": {
      marginTop: "-15px",
      paddingTop: "15px",
    },
  };
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
    <Stack mt={10} spacing={8}>
      <Autocomplete
        sx={{ ...inputBoxing }}
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
        sx={{ ...inputBoxing }}
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
        sx={{ ...inputBoxing }}
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

      <FormControl variant="outlined" sx={{ ...inputBoxing }}>
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

      <FormControl sx={{ ...inputBoxing }} variant="outlined">
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

      <FormControl variant="outlined" sx={{ ...inputBoxing }}>
        <InputLabel>Current date-time </InputLabel>
        <OutlinedInput
          type="datetime-local"
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
  );
};

const DisplayTripDetails: React.FC = () => {
  const { tripData,cleanData } = useMapUtils();

  const navigete = useNavigate();
  return (
    <>
      <Stack spacing={4} mb={5}>
        <Stack flexDirection={"row-reverse"}>
          <IconButton size="large" sx={{ color: "red", margin: "-20px" }}>
            <DeleteForeverIcon />
          </IconButton>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <Typography variant="body1">Trip Date: </Typography>
          <Typography fontSize={22} fontWeight={600}>
            04/12/1998
          </Typography>
        </Stack>
        <StyledLocationItem>
          <Typography variant="body1">Current Location: </Typography>
          <Typography fontSize={20}>{/* TT */}</Typography>
        </StyledLocationItem>

        <StyledLocationItem className="pick">
          <Typography variant="body1">Pickup Location: </Typography>
          <Typography fontSize={20}>{/* TT */}</Typography>
        </StyledLocationItem>

        <StyledLocationItem className="drop">
          <Typography variant="body1">Dropoff Location: </Typography>
          <Typography fontSize={20}>{/* TT */}</Typography>
        </StyledLocationItem>

        <Stack direction={"row"} spacing={2}>
          <Typography variant="body1">Current Cycle used (Hrs): </Typography>
          <Typography fontSize={18} fontWeight={600}>
            {/* TT */}
          </Typography>
        </Stack>

        <Stack direction={"row"} spacing={2}>
          <Typography variant="body1">Average Driving speed : </Typography>
          <Typography fontSize={18} fontWeight={600}>
            {/* TT */}
          </Typography>
        </Stack>
        <Button
           onClick={() => navigete(appPaths.singleLog)}
          size="large"
          variant="contained"
          startIcon={<ViewTimelineIcon />}
          color="warning"
        >
          Display ELD LOGS
        </Button>

        <Button
          onClick={() => cleanData()}
          size="large"
          variant="contained"
          startIcon={<ReplayIcon />}
          color="primary"
        >
          Plan new trip
        </Button>
      </Stack>
    </>
  );
};

const StyledLocationItem = styled(Stack)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.error.main, 0.3),
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  "&.drop": {
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
  },
  "&.pick": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.3),
  },
}));

export default TripDetails;
