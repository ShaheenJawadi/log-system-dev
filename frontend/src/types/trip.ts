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
      
}




export type Trip = {
    id: number;
    current_location_details: TripLocation;
    pickup_location_details: TripLocation;
    dropoff_location_details: TripLocation;
    current_cycle_hours: number;  
    trip_date: string;
    polyline: string;  
    first_log_day?: number|null;
    log_days_count?: number|null;
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



  