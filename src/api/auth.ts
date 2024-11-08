import axios from 'axios';
import { API_URL } from './config';
import type { LoginData, RegisterData, User } from '../types';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(data: LoginData) {
  try {
    const response = await api.post<{ user: User; token: string }>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error logging in');
    }
    throw error;
  }
}

export async function register(data: RegisterData) {
  try {
    const response = await api.post<{ user: User; token: string }>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error creating account');
    }
    throw error;
  }
}

export async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}