import React, { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { TripDetailsRequest, TripLocation } from "../types/trip";
import axios from "axios";
import { decode } from "@mapbox/polyline";
import * as tripService from "../services/tripServices";

const MapContext = createContext<{
  isFormValid: boolean;
  setCurrentLocation: (loc: TripLocation| null) => void;
  setPickup: (loc: TripLocation| null) => void;
  setDropoff: (loc: TripLocation| null) => void;
  generateRoute: () => void;
}>({
  isFormValid: false,
  setCurrentLocation: (loc: TripLocation| null) => {},
  setPickup: (loc: TripLocation| null) => {},
  setDropoff: (loc: TripLocation| null) => {},
  generateRoute: () => {},
});

export const useMapUtils = () => useContext(MapContext);

export const MapUtilsProvider = ({ children }: { children: ReactNode }) => {
  const [decodedCoordinates, setDecodedCoordinates] = useState<
    [number, number][]
  >([]);

  const [currentLocation, setCurrentLocation] = useState<TripLocation | null>(
    null
  );
  const [pickup, setPickup] = useState<TripLocation | null>(null);
  const [dropoff, setDropoff] = useState<TripLocation | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isFormValid = !!(
    currentLocation &&
    pickup &&
    dropoff &&
    pickup.latitude &&
    dropoff.longitude
  );

  const generateRoute = async () => {
    if (isFormValid) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const data: TripDetailsRequest = {
          current_location: currentLocation,
          pickup_location: pickup,
          dropoff_location: dropoff,
          current_cycle_hours: 5.5,
          status: "planned",
        };

        const response = await tripService.plan(data);

        if (response.trip.polyline) {
          setDecodedCoordinates(decode(response.trip.polyline));
        }
        setSuccessMessage("Route generated successfully!");
      } catch (error) {
        console.error("Error generating route:", error);
        setError("Failed to generate route. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MapContext.Provider
      value={{
        isFormValid,
        setCurrentLocation,
        setPickup,
        setDropoff,
        generateRoute,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
