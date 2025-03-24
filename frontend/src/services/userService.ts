
import { apiService } from '../api/axios'; 
 
import { SettingsType } from '../types/user';
 
export const getSettings = async () => {
  const response = await apiService.get<SettingsType>('/auth/settings/');
  return response;
};
export const putSettings = async (data: SettingsType) => {
  const response = await apiService.put<SettingsType>('/auth/settings/', data);
  return response;
};
 