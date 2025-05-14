import axios from 'axios';
import { Note } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Notes API
export const notes = {
  getAll: () => api.get<Note[]>('/notes'),
  getById: (id: string) => api.get<Note>(`/notes/${id}`),
  create: (data: {
    title: string;
    content: string;
    tags?: string[];
    isPublic?: boolean;
  }) => api.post<Note>('/notes', data),
  update: (
    id: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ) => api.put<Note>(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
  share: (id: string, email: string) =>
    api.post<Note>(`/notes/${id}/share`, { email }),
  unshare: (id: string, email: string) =>
    api.delete<Note>(`/notes/${id}/share`, { data: { email } }),
};

export default api; 