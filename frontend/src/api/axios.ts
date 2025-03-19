import axios, { AxiosRequestConfig } from 'axios';


const API_BASE_URL = process.env.APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
 
    const errorMessage =
      error.message ||
      'Something went wrong';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  post: async <T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig) => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  put: async <T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig) => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await api.delete<T>(url, config);
    return response.data;
  }
};
