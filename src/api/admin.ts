import axios from 'axios';
import { API_URL } from './config';
import type { User } from '../types';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getUsers() {
  try {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching users');
    }
    throw error;
  }
}

export async function getUser(id: string) {
  try {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching user');
    }
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    const response = await api.put<User>(`/admin/users/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error updating user');
    }
    throw error;
  }
}