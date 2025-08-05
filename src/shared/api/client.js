import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for cache busting if needed
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return data directly
    return response.data;
  },
  (error) => {
    // Handle common errors
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear auth token and redirect
        localStorage.removeItem('auth-token');
        window.location.href = '/login';
        break;
      case 403:
        console.error('Forbidden:', message);
        break;
      case 404:
        console.error('Not Found:', message);
        break;
      case 500:
        console.error('Server Error:', message);
        break;
      default:
        console.error('API Error:', message);
    }
    
    // Enhance error object
    const enhancedError = {
      ...error,
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
    
    return Promise.reject(enhancedError);
  }
);

export default apiClient;