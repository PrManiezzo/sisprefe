import axios from 'axios';
import { API_URL } from './config';
import type { Issue, IssueFormData } from '../types';

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

export async function createIssue(data: IssueFormData & { location: { latitude: number; longitude: number } }) {
  try {
    const response = await api.post<Issue>('/issues', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error creating issue');
    }
    throw error;
  }
}

export async function getIssues() {
  try {
    const response = await api.get<Issue[]>('/issues');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching issues');
    }
    throw error;
  }
}

export async function getIssue(id: string) {
  try {
    const response = await api.get<Issue>(`/issues/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching issue');
    }
    throw error;
  }
}

export async function updateIssueStatus(id: string, status: Issue['status']) {
  try {
    const response = await api.patch<Issue>(`/issues/${id}/status`, { status });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error updating status');
    }
    throw error;
  }
}