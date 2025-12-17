import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: For Android emulator, use 'http://10.0.2.2:3000/api'
// For iOS simulator, use 'http://localhost:3000/api'
// For physical device, use your computer's IP address (e.g., 'http://192.168.1.100:3000/api')

const API_BASE_URL = __DEV__
  ? 'http://192.168.1.62:3000/api'
  : 'https://api.careerontrack.ai/api'; // Change to your production URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could logout user here
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

export const goalService = {
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },
  getGoal: async (id: number) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },
  createGoal: async (data: { title: string; description?: string; status?: string }) => {
    const response = await api.post('/goals', data);
    return response.data;
  },
  updateGoal: async (id: number, data: { title?: string; description?: string; status?: string; progress?: number }) => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },
  deleteGoal: async (id: number) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};

export default api;

