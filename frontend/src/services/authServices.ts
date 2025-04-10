import { ref } from 'yup';
import { apiService } from '../api/axios'; 
import { LoginCredentials, RegisterCredentials, Token, User } from '../types/auth';
import { getRefreshToken } from '../utils/token';
 
export const login = async (data: LoginCredentials) => {
  const response = await apiService.post<{ tokens: Token,user:User }>('/auth/login/', data);
  return response;
};
export const register = async (data: RegisterCredentials) => {
  const response = await apiService.post('/auth/register/', data);
  return response;
};
export const logout = async () => {
  const response = await apiService.post('/auth/logout/', {refresh:getRefreshToken()});
  return response;
};

export const me = async (data: Token) => {
  const response = await apiService.post<{user:User }>('/auth/me/', data);
  return response;
};
