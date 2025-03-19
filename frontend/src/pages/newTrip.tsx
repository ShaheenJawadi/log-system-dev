import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box, useTheme } from "@mui/material";
import TripDetails from "../components/newTrip/tripDetails";
import { headerHeight } from "../utils/constatnts";
import L from "leaflet";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server";
import { useMap } from "react-leaflet";
import { TripLocation } from "../types/trip";

const markerIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: ReactDOMServer.renderToString(
      <LocationOnIcon style={{ fontSize: 36, color: color }} />
    ),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

const NewTrip: React.FC = () => {
  const theme = useTheme();

  const [currentLocation, setCurrentLocation] = useState<TripLocation | null>(
    null
  );
  const [pickup, setPickup] = useState<TripLocation | null>(null);
  const [dropoff, setDropoff] = useState<TripLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TripLocation[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 4) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
        )
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(
              data.map((item: any) => ({
                address: item.display_name,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
              }))
            );
          })
          .catch((err) => console.error("Error fetching location data:", err));
      } else {
        setSuggestions([]);
      }
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const isFormValid = !!(
    currentLocation &&
    pickup &&
    dropoff &&
    pickup.latitude &&
    dropoff.longitude
  );

  const MapUpdater = ({
    locations,
  }: {
    locations: { lat: number; lon: number }[];
  }) => {
    const map = useMap();

    useEffect(() => {
      if (locations.length > 0) {
        const bounds = L.latLngBounds(
          locations.map((loc) => [loc.lat, loc.lon])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [locations, map]);

    return null;
  };

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <TripDetails
        setCurrentLocation={setCurrentLocation}
        setPickup={setPickup}
        setDropoff={setDropoff}
        setSearchQuery={setSearchQuery}
        suggestions={suggestions}
        isFormValid={isFormValid}
        searchQuery={searchQuery}
      />

      <MapContainer
        center={[41.739685, -87.55442]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: "100%", height: `calc(100vh - ${headerHeight}px)` }}
      >
        <MapUpdater
          locations={[currentLocation, pickup, dropoff]
            .filter((loc): loc is TripLocation => loc !== null)
            .map((loc) => ({ lat: loc.latitude, lon: loc.longitude }))}
        />
        <TileLayer
          attribution=' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentLocation && (
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={markerIcon(theme.palette.error.main)}
          >
            <Popup>Current Location: {currentLocation.address}</Popup>
          </Marker>
        )}

        {pickup && (
          <Marker
            icon={markerIcon(theme.palette.secondary.main)}
            position={[pickup.latitude, pickup.longitude]}
          >
            <Popup>Pickup: {pickup.address}</Popup>
          </Marker>
        )}

        {dropoff && (
          <Marker
            icon={markerIcon(theme.palette.primary.main)}
            position={[dropoff.latitude, dropoff.longitude]}
          >
            <Popup>Dropoff: {dropoff.address}</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default NewTrip;
