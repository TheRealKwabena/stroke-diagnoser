
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Use an environment variable or update this with your actual backend URL
// If you're using the Lovable preview, you need to use an absolute URL that allows CORS
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'; 

// Create a configured axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable sending cookies cross-domain
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear token from storage
      localStorage.removeItem('token');
      // Redirect to login page or show auth modal
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Generic request method with types
async function apiRequest<T>(
  method: string,
  url: string,
  data?: any,
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.request({
      method,
      url,
      data,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error(`API ${method.toUpperCase()} request failed:`, error);
    throw error;
  }
}

// Export utility methods
export const api = {
  get: <T>(url: string, options?: AxiosRequestConfig) => 
    apiRequest<T>('get', url, undefined, options),
  post: <T>(url: string, data: any, options?: AxiosRequestConfig) => 
    apiRequest<T>('post', url, data, options),
  put: <T>(url: string, data: any, options?: AxiosRequestConfig) => 
    apiRequest<T>('put', url, data, options),
  delete: <T>(url: string, options?: AxiosRequestConfig) => 
    apiRequest<T>('delete', url, undefined, options),
  patch: <T>(url: string, data: any, options?: AxiosRequestConfig) => 
    apiRequest<T>('patch', url, data, options),
};

export default apiClient;
