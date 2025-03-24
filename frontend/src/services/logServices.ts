import { apiService } from '../api/axios'; 
import { LogDay } from '../types/logs';
 
 
export const getListLogs = async () => {
  const response = await apiService.get<LogDay[]>(`/logs/`);
  return response;
};


export const singleLog = async (id: number) => {
  const response = await apiService.get<LogDay>(`/logs/${id}/`);
  return response;
};
 
 
export const updateLog = async (data: LogDay) => {
  const response = await apiService.put<LogDay>(`/logs/` , data);
  return response;
};

export const createLog = async (data: LogDay) => {
  const response = await apiService.post<LogDay>(`/logs/` , data);
  return response;
};

export const deleteLog = async (id: number) => {
  const response = await apiService.delete(`/logs/${id}/`);
  return response;
};
 
 