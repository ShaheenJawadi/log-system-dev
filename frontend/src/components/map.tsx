import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material";
import { headerHeight } from "../utils/constatnts";
import L from "leaflet";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server";
import { useMap } from "react-leaflet";
import { useMapUtils } from "../context/mapContext";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import HotelIcon from '@mui/icons-material/Hotel';
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
const MapComponant = () => {
  const theme = useTheme();
  const { pinLocations ,decodedCoordinates , tripStops} = useMapUtils();


  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (pinLocations.length > 0) {
        const bounds = L.latLngBounds(
          pinLocations.map((loc) => [loc.latitude, loc.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [pinLocations, map]);

    return null;
  };

  return (
    <MapContainer
      center={[41.739685, -87.55442]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ width: "100%", height: `calc(100vh - ${headerHeight}px)` }}
    >
      <MapUpdater />
      <TileLayer
        attribution=' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pinLocations.map((pin, index) => (
        <Marker
          key={index}
          position={[pin.latitude, pin.longitude]}
          icon={markerIcon(theme.palette[pin.color].main)}
        >
          <Popup>
            {pin.name}: {pin.address}
          </Popup>
        </Marker>
      ))}

{tripStops.map((pin, index) => pin.stop_type!="pickup"&&pin.stop_type!="dropoff"&&(
        <Marker
          key={index}
          position={[pin.location_details.latitude, pin.location_details.longitude]}
          icon={markerIcon(theme.palette.warning.main , pin.stop_type)}
        >
          <Popup>
            {pin.stop_type}: {pin.location_details.address}
          </Popup>
        </Marker>
      ))}

       {decodedCoordinates.length > 0 && (
        <Polyline
          pathOptions={{ color: theme.palette.primary.main }}
          positions={decodedCoordinates}
        />
      )}  
    </MapContainer>
  );
};

const markerIcon = (color: string , type: "rest"|"loc"|"fuel"|"reset"= "loc") =>
  L.divIcon({
    className: "custom-icon",
    html: ReactDOMServer.renderToString(
      type === "loc" ? (
        <LocationOnIcon  style={{ fontSize: 36, color: color }} />
        

      ) : type === "fuel" ? (
        
        <LocalGasStationIcon style={{ fontSize: 30 , color:"#00b9c1"  }} />

      ) : type === "rest" ? (
        
        <HotelIcon    style={{ fontSize: 30,  color:"#FDB528" }} />

      )  : null
    ),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
export default MapComponant;
