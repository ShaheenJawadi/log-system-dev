import { LogDay } from "./logs";

export type TripLocation = {
    address: string;
    latitude: number;
    longitude: number;
}

export type TripDetailsRequest  ={
    current_location: TripLocation;
    pickup_location: TripLocation;
    dropoff_location: TripLocation;
    current_cycle_hours: number;
    status: 'planned' | 'in_progress' | 'completed';  
}




export type Trip = {
    id: number;
    current_location_details: TripLocation;
    pickup_location_details: TripLocation;
    dropoff_location_details: TripLocation;
    current_cycle_hours: number;
    status: string;
    created_at: string;
    polyline: string; 
  };

  export type Stop = {
    id: number;
    location_details: TripLocation;
    stop_type: 'pickup' | 'dropoff' |'fuel' | 'rest';
    arrival_time: string;
    departure_time: string;
    trip: number;
    location: number;
  };
  

export type TripData = {
    trip: Trip;
    log_days: LogDay[];
    stops: Stop[];
  };



  