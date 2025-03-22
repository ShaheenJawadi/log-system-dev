import { apiService } from '../api/axios'; 
import { Trip, TripData, TripDetailsRequest } from '../types/trip';
 
export const plan = async (data: TripDetailsRequest) => {
  const response = await apiService.post<TripData>('/trip/plan/', data);
  return response;
};
 

export const getSingleTrip = async (id: number) => {
  const response = await apiService.get<TripData>(`/trip/${id}/`);
  return response;
};
 
export const getListTrip = async () => {
  const response = await apiService.get<Trip[]>(`/trip/`);
  return response;
};


export const deleteTrip = async (id: number) => {
  const response = await apiService.delete(`/trip/${id}/`);
  return response;
};
 
 
