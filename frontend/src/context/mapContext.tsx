import React, { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { Stop, Trip, TripDetailsRequest, TripLocation } from "../types/trip";
import axios from "axios";
import { decode } from "@mapbox/polyline";
import * as tripService from "../services/tripServices";
import { MapPin } from "../types/map";
import { useLocation } from "react-router-dom";

const MapContext = createContext<{
  isFormValid: boolean;
  setCurrentLocation: (loc: TripLocation | null) => void;
  setPickup: (loc: TripLocation | null) => void;
  setDropoff: (loc: TripLocation | null) => void;
  generateRoute: () => void;
  pinLocations: MapPin[];
  decodedCoordinates: [number, number][];
  tripStops: Stop[];
  fetchSingleTrip: (id: number) => void;
  isDispayData: boolean;
  tripData:Trip|null,
  cleanData:()=>void
}>({
  cleanData:()=>{},
  tripData:null,
  isDispayData: false,
  fetchSingleTrip: (id: number) => {},
  isFormValid: false,
  setCurrentLocation: (loc: TripLocation | null) => {},
  setPickup: (loc: TripLocation | null) => {},
  setDropoff: (loc: TripLocation | null) => {},
  generateRoute: () => {},
  pinLocations: [],
  decodedCoordinates: [],
  tripStops: [],
});

export const useMapUtils = () => useContext(MapContext);

export const MapUtilsProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [decodedCoordinates, setDecodedCoordinates] = useState<
    [number, number][]
  >([]);

  const [currentLocation, setCurrentLocation] = useState<TripLocation | null>(
    null
  );
  const [pickup, setPickup] = useState<TripLocation | null>(null);
  const [dropoff, setDropoff] = useState<TripLocation | null>(null);
  const [pinLocations, setPinLocations] = useState<MapPin[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const[isDispayData , setDisplayData] = useState<boolean>(true);
  const [tripStops, setTripStops] = useState<Stop[]>([]);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [tripData, setTripData] = useState<Trip|null>(null);


  const generateRoute = async () => {
    if (currentLocation && pickup && dropoff) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const data: TripDetailsRequest = {
          current_location: currentLocation,
          pickup_location: pickup,
          dropoff_location: dropoff,
          current_cycle_hours: 5.5,
        
        };

        const response = await tripService.plan(data);

        if (response.trip.polyline) {
          setDecodedCoordinates(decode(response.trip.polyline));
        }
        if (response.stops) {
          setTripStops(response.stops);
        }
        setDisplayData(true);
        

        setSuccessMessage("Route generated successfully!");
      } catch (error) {
        console.error("Error generating route:", error);
        setError("Failed to generate route. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const cleanData = () => {
    setDecodedCoordinates([]);
    setCurrentLocation(null);
    setDropoff(null);
    setPickup(null);
    setTripStops([]);
    setIsFormValid(false);
    setDisplayData(false);
    setTripData(null);
  };

  useEffect(() => {
    return () => {
      cleanData();
    };
  }, [location]);
  const fetchSingleTrip = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await tripService.getSingleTrip(5);
      setCurrentLocation(response.trip.current_location_details);
      setDropoff(response.trip.dropoff_location_details);
      setPickup(response.trip.pickup_location_details);

      if (response.trip.polyline) {
        setDecodedCoordinates(decode(response.trip.polyline));
      }
      if (response.stops) {
        setTripStops(response.stops);
      }
      setTripData(response.trip);
      setDisplayData(true);

      setSuccessMessage("Route generated successfully!");
    } catch (error) {
      console.error("Error generating route:", error);
      setError("Failed to generate route. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPinLocations(() => {
      const pins: MapPin[] = [];
      if (currentLocation) {
        pins.push({
          ...currentLocation,
          name: "Current Location",
          color: "error",
        });
      }
      if (pickup) {
        pins.push({
          ...pickup,
          name: "Pickup Location",
          color: "secondary",
        });
      }
      if (dropoff) {
        pins.push({
          ...dropoff,
          name: "Dropoff Location",
          color: "primary",
        });
      }
      return pins;
    });
    if (currentLocation && pickup && dropoff) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [currentLocation, pickup, dropoff]);

  return (
    <MapContext.Provider
      value={{
        cleanData,
        tripData,
        isDispayData,
        fetchSingleTrip,
        tripStops,
        isFormValid,
        setCurrentLocation,
        setPickup,
        setDropoff,
        generateRoute,
        pinLocations,
        decodedCoordinates,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
