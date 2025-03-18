import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box } from "@mui/material";
import TripDetails from "../components/newTrip/tripDetails";
import { headerHeight } from "../utils/constatnts";

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

const NewTrip: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        })
        .catch((err) => console.error("Error fetching location data:", err));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const isFormValid = !!(
    currentLocation &&
    pickup &&
    dropoff &&
    pickup.lat &&
    dropoff.lat
  );

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <TripDetails
        setCurrentLocation={setCurrentLocation}
        setPickup={setPickup}
        setDropoff={setDropoff}
        setSearchQuery={setSearchQuery}
        suggestions={suggestions}
        isFormValid={isFormValid}
      />

      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: `calc(100vh - ${headerHeight}px)` }}
      >
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
          >
            <Popup>Current Location: {currentLocation.display_name}</Popup>
          </Marker>
        )}

        {pickup && (
          <Marker position={[parseFloat(pickup.lat), parseFloat(pickup.lon)]}>
            <Popup>Pickup: {pickup.display_name}</Popup>
          </Marker>
        )}

        {dropoff && (
          <Marker position={[parseFloat(dropoff.lat), parseFloat(dropoff.lon)]}>
            <Popup>Dropoff: {dropoff.display_name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default NewTrip;
