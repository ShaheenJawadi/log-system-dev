import { apiService } from '../api/axios'; 
import { LoginCredentials, RegisterCredentials, Token, User } from '../types/auth';
 
export const login = async (data: LoginCredentials) => {
  const response = await apiService.post<{ tokens: Token,user:User }>('/auth/login/', data);
  return response;
};
export const register = async (data: RegisterCredentials) => {
  const response = await apiService.post('/auth/register/', data);
  return response;
};
