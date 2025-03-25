import React, { createContext, useContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import { Stop, Trip, TripDetailsRequest, TripLocation } from "../types/trip";
import axios from "axios";
import { decode } from "@mapbox/polyline";
import * as tripService from "../services/tripServices";
import { MapPin } from "../types/map";
import { useLocation } from "react-router-dom";

 
type TripRequestField = "current_cycle_hours" | "average_speed" | "trip_date" | "current_location" | "pickup_location" | "dropoff_location";

const MapContext = createContext<{
  isFormValid: boolean;
  updateTripRequest: (field: TripRequestField, value: string | TripLocation) => void;
 
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
  updateTripRequest: (field: TripRequestField, value: string | TripLocation) => {},
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


  const [tripRequest, setTripRequest] = useState<TripDetailsRequest>({current_cycle_hours:5.5} as TripDetailsRequest);
 
  const [pinLocations, setPinLocations] = useState<MapPin[]>([]);


  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const[isDispayData , setDisplayData] = useState<boolean>(false);
  const [tripStops, setTripStops] = useState<Stop[]>([]);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [tripData, setTripData] = useState<Trip|null>(null);


  const generateRoute = async () => {
    if (tripRequest.current_location && tripRequest.pickup_location && tripRequest.dropoff_location) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
         

        const response = await tripService.plan(tripRequest);

        if (response.trip.polyline) {
          setDecodedCoordinates(decode(response.trip.polyline));
        }
        if (response.stops) {
          setTripStops(response.stops);
        }
        setDisplayData(true);
        setTripData(response.trip);

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
    setTripRequest({} as TripDetailsRequest);
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
      const response = await tripService.getSingleTrip(id);
      setTripRequest({
        ...tripRequest,
        current_location: response.trip.current_location_details,
        dropoff_location: response.trip.dropoff_location_details,
        pickup_location: response.trip.pickup_location_details,
      }); 

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
      if (tripRequest?.current_location) {
        pins.push({
          ...tripRequest?.current_location,
          name: "Current Location",
          color: "error",
        });
      }
      if (tripRequest?.pickup_location) {
        pins.push({
          ...tripRequest?.pickup_location,
          name: "Pickup Location",
          color: "secondary",
        });
      }
      if (tripRequest?.dropoff_location) {
        pins.push({
          ...tripRequest?.dropoff_location,
          name: "Dropoff Location",
          color: "primary",
        });
      }
      return pins;
    });
    if (tripRequest.current_location && tripRequest.pickup_location && tripRequest.dropoff_location) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [tripRequest.current_location, tripRequest.pickup_location,  tripRequest.dropoff_location]);


  const updateTripRequest= (field: TripRequestField, value: string | TripLocation)  => {
    
    setTripRequest({
      ...tripRequest,
      [field]: value,
    });
    
  };


  return (
    <MapContext.Provider
      value={{
        cleanData,
        tripData,
        isDispayData,
        fetchSingleTrip,
        tripStops,
        isFormValid,
        updateTripRequest,
        generateRoute,
        pinLocations,
        decodedCoordinates,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
