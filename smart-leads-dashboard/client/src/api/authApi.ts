import axiosInstance from './axiosInstance';
import { AuthResponse, User } from '../types/auth.types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    '/auth/register',
    payload
  );
  return data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    '/auth/login',
    payload
  );
  return data;
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('user');
  return stored ? (JSON.parse(stored) as User) : null;
};
