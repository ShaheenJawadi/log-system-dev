import { apiService } from '../api/axios'; 
import { TripData, TripDetailsRequest } from '../types/trip';
 
export const plan = async (data: TripDetailsRequest) => {
  const response = await apiService.post<TripData>('/trip/plan/', data);
  return response;
};
 