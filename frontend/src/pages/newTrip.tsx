import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box, useTheme } from "@mui/material";
import TripDetails from "../components/newTrip/tripDetails";
import { headerHeight } from "../utils/constatnts"; 
import L from "leaflet"; 
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactDOMServer from "react-dom/server"; 
import { useMap } from "react-leaflet";
interface Location {
  display_name: string;
  lat: string;
  lon: string;
}
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
  
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 4) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
        )
          .then((res) => res.json())
          .then((data) => setSuggestions(data))
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
    pickup.lat &&
    dropoff.lat
  );




  const MapUpdater = ({ locations }: { locations: { lat: number; lon: number }[] }) => {
    const map = useMap();
  
    useEffect(() => {
      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lon]));
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
        center={[	41.739685, 	-87.554420]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: "100%", height: `calc(100vh - ${headerHeight}px)` }}
      >
         <MapUpdater locations={[currentLocation, pickup, dropoff].filter((loc): loc is Location => loc !== null).map(loc => ({ lat: parseFloat(loc.lat), lon: parseFloat(loc.lon) }))} />
        <TileLayer
          attribution=' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentLocation && (
          <Marker
            position={[
              parseFloat(currentLocation.lat),
              parseFloat(currentLocation.lon),
            ]}
            icon={markerIcon(theme.palette.error.main)}
          >
            <Popup>Current Location: {currentLocation.display_name}</Popup>
          </Marker>
        )}

        {pickup && (
          <Marker icon={markerIcon(theme.palette.secondary.main)} position={[parseFloat(pickup.lat), parseFloat(pickup.lon)]}>
            <Popup>Pickup: {pickup.display_name}</Popup>
          </Marker>
        )}

        {dropoff && (
          <Marker icon={markerIcon(theme.palette.primary.main)} position={[parseFloat(dropoff.lat), parseFloat(dropoff.lon)]}>
            <Popup>Dropoff: {dropoff.display_name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default NewTrip;
