import axios from 'axios';
import { Note } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔑 Request Interceptor - Token:', token);
    console.log('🔑 Request URL:', config.url);
    console.log('🔑 Request Method:', config.method);
    console.log('🔑 Request Data:', config.data);
    console.log('🔑 Request Headers:', config.headers);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response Interceptor - Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Interceptor - Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - removing token and redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    console.log('🔐 Login attempt for:', email);
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('🔐 Login response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string) => {
    console.log('🔐 Register attempt for:', email);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      console.log('🔐 Register response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  },
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Notes API
export const notes = {
  getAll: async () => {
    console.log('📝 Fetching all notes');
    try {
      const response = await api.get<Note[]>('/notes');
      console.log('📝 Get all notes response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Get all notes error:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    console.log('📝 Fetching note:', id);
    try {
      const response = await api.get<Note>(`/notes/${id}`);
      console.log('📝 Get note response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Get note error:', error);
      throw error;
    }
  },
  create: async (data: {
    title: string;
    content: string;
    tags?: string[];
    isPublic?: boolean;
    category?: string;
    color?: string;
    isPinned?: boolean;
  }) => {
    console.log('📝 Creating note with data:', data);
    try {
      const response = await api.post<Note>('/notes', data);
      console.log('📝 Create note response:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ Create note error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  update: async (
    id: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      isPublic?: boolean;
      category?: string;
      color?: string;
      isPinned?: boolean;
    }
  ) => {
    console.log('📝 Updating note:', id, 'with data:', data);
    try {
      const response = await api.patch<Note>(`/notes/${id}`, data);
      console.log('📝 Update note response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Update note error:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    console.log('📝 Deleting note:', id);
    try {
      const response = await api.delete(`/notes/${id}`);
      console.log('📝 Delete note response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Delete note error:', error);
      throw error;
    }
  },
  share: async (id: string, email: string) => {
    console.log('📝 Sharing note:', id, 'with:', email);
    try {
      const response = await api.post<Note>(`/notes/${id}/share`, { email });
      console.log('📝 Share note response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Share note error:', error);
      throw error;
    }
  },
  unshare: async (id: string, email: string) => {
    console.log('📝 Unsharing note:', id, 'from:', email);
    try {
      const response = await api.delete<Note>(`/notes/${id}/share`, { data: { email } });
      console.log('📝 Unshare note response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Unshare note error:', error);
      throw error;
    }
  },
};

export default api; 