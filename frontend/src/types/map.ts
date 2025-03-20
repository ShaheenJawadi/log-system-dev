import { TripLocation } from "./trip";

export type MapPin =TripLocation&{
    name : string;
    color: "primary" | "secondary" | "error"  |"success" | "warning" | "info";
}