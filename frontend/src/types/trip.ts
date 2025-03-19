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

const tripData: TripDetailsRequest = {
    current_location: {
        address: '123 Street Name',
        latitude: 12.34,
        longitude: 56.78,
    },
    pickup_location: {
        address: '456 Pickup St',
        latitude: 12.56,
        longitude: 56.89,
    },
    dropoff_location: {
        address: '789 Dropoff Ave',
        latitude: 12.78,
        longitude: 56.90,
    },
    current_cycle_hours: 5.5,
    status: 'planned',
};
