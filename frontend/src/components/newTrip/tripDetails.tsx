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
  Card,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { Trip, TripLocation } from "../../types/trip";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SpeedIcon from "@mui/icons-material/Speed";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { useEffect, useState } from "react";
import axios from "axios";
import { TripRequestField, useMapUtils } from "../../context/mapContext";
import { transparentColor } from "../../utils/constatnts";
import { useNavigate } from "react-router-dom";
import { appPaths } from "../../routes/paths";
import { isHosted } from "../../utils/checkHost";

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

  const liveDomains = [
    "log-system-dev.vercel.app",
    "your-app-name.onrender.com",
  ];
  return (
    <StyledBoxContainer>
      {isDispayData ? <DisplayTripDetails /> : <TripDetailsForm />}
    </StyledBoxContainer>
  );
};
const TripDetailsForm: React.FC = () => {
  const { isFormValid, updateTripRequest, generateRoute, loading } =
    useMapUtils();
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
      <LocationAutocomplete
        label="Current Location"
        field="current_location"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        suggestions={suggestions}
        updateTripRequest={(field, value) =>
          updateTripRequest(field, value as TripLocation)
        }
        inputBoxing={inputBoxing}
      />

      <LocationAutocomplete
        label="Pickup Location"
        field="pickup_location"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        suggestions={suggestions}
        updateTripRequest={(field, value) =>
          updateTripRequest(field, value as TripLocation)
        }
        inputBoxing={inputBoxing}
      />

      <LocationAutocomplete
        label="Dropoff Location"
        field="dropoff_location"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        suggestions={suggestions}
        updateTripRequest={(field, value) =>
          updateTripRequest(field, value as TripLocation)
        }
        inputBoxing={inputBoxing}
      />
      <FormControl variant="outlined" sx={{ ...inputBoxing }}>
        <InputLabel>Current Cycle Used (Hrs) </InputLabel>
        <OutlinedInput
          type="number"
          defaultValue={0}
          onChange={(e) =>
            updateTripRequest("current_cycle_hours", parseFloat(e.target.value))
          }
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
          defaultValue={55}
          type="number"
          onChange={(e) =>
            updateTripRequest("average_speed", parseFloat(e.target.value))
          }
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
          onChange={(e) => updateTripRequest("trip_date", e.target.value)}
          type="datetime-local"
          label="Current date-time"
          startAdornment={
            <InputAdornment position="start">
              <AccessTimeFilledIcon color="warning" />
            </InputAdornment>
          }
        />
      </FormControl>
      <LiveServerNotice />

      <Button
        startIcon={<AutoFixHighIcon />}
        onClick={() => generateRoute()}
        size="large"
        variant="contained"
        color="primary"
        disabled={!isFormValid || loading}
      >
        Generate a trip plan
      </Button>
    </Stack>
  );
};

const DisplayTripDetails: React.FC = () => {
  const { tripData, cleanData } = useMapUtils();

  const navigete = useNavigate();

  return (
    <>
      <Stack spacing={4} mb={5}>
        <Stack direction={"row"} spacing={2}>
          <Typography variant="body1">Trip Date: </Typography>
          <Typography fontSize={22} fontWeight={600}>
            {tripData?.trip_date}
          </Typography>
        </Stack>
        <StyledLocationItem>
          <Typography variant="body1">Current Location: </Typography>
          <Typography fontSize={20}>
            {tripData?.current_location_details.address}
          </Typography>
        </StyledLocationItem>

        <StyledLocationItem className="pick">
          <Typography variant="body1">Pickup Location: </Typography>
          <Typography fontSize={20}>
            {tripData?.pickup_location_details.address}
          </Typography>
        </StyledLocationItem>

        <StyledLocationItem className="drop">
          <Typography variant="body1">Dropoff Location: </Typography>
          <Typography fontSize={20}>
            {tripData?.dropoff_location_details.address}
          </Typography>
        </StyledLocationItem>

        <Stack direction={"row"} spacing={2}>
          <Typography variant="body1">Current Cycle used (Hrs): </Typography>
          <Typography fontSize={18} fontWeight={600}>
            {tripData?.current_cycle_hours} Hrs
          </Typography>
        </Stack>

        <Stack direction={"row"} spacing={2}>
          <Typography variant="body1">Average Driving speed : </Typography>
          <Typography fontSize={18} fontWeight={600}>
            {tripData?.average_speed} mph
          </Typography>
        </Stack>
        <Button
          disabled={!tripData?.first_log_day}
          onClick={() =>
            tripData?.id &&
            navigete(
              appPaths.singleLog.replace(
                ":id",
                tripData?.first_log_day?.toString() || ""
              )
            )
          }
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

type LocationAutocompleteProps = {
  label: string;
  field: "current_location" | "pickup_location" | "dropoff_location";
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  suggestions: TripLocation[];
  updateTripRequest: (
    field: TripRequestField,
    value: string | number | TripLocation | null
  ) => void;
  inputBoxing?: object;
};

const iconMap = {
  current_location: <MyLocationIcon color="error" />,
  pickup_location: <NearMeIcon color="secondary" />,
  dropoff_location: <FlagIcon color="primary" />,
};

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  field,
  searchQuery,
  setSearchQuery,
  suggestions,
  updateTripRequest,
  inputBoxing,
}) => {
  return (
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
      onChange={(_, value) => updateTripRequest(field, value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">{iconMap[field]}</InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

const LiveServerNotice = () => {
 
  if (!isHosted()) return null;

  return (
    <Card sx={{ padding: 2, backgroundColor: "#0000005e", color: "#fff" }}>
      <Typography fontSize={18} fontWeight={600} color="warning" variant="h5">
        ⚠️ Notice
      </Typography>
      <Typography variant="body1" fontSize={14} fontWeight={600}>
        This app’s backend is hosted on Render’s free plan, which may cause
        issues like out-of-memory errors, especially for long trips. For the
        full experience, I recommend testing it locally. Thank you for your
        understanding!
      </Typography>
    </Card>
  );
};
export default TripDetails;
