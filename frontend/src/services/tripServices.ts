import { apiService } from '../api/axios'; 
import { TripDetailsRequest } from '../types/trip';
 
export const plan = async (data: TripDetailsRequest) => {
  const response = await apiService.post('/trip/plan/', data);
  return response;
};
 