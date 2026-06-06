import apiClient, { setAuthToken } from '@/api/client';
import { fromBackendAuthRole, toBackendAuthRole, type AuthRole, type BackendAuthRole } from '@/config/auth';
import type { AuthUser } from '@/types';

type BackendAuthUser = {
  id: string;
  name: string;
  email: string;
  role: BackendAuthRole;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  data: {
    user: BackendAuthUser;
    token?: string;
  };
};

const mapAuthUser = (user: BackendAuthUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: fromBackendAuthRole(user.role),
  backendRole: user.role
});

export const login = async (payload: { email: string; password: string }) => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  setAuthToken(response.data.data.token ?? null);
  return mapAuthUser(response.data.data.user);
};

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
}) => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', {
    ...payload,
    role: toBackendAuthRole(payload.role)
  });

  setAuthToken(response.data.data.token ?? null);
  return mapAuthUser(response.data.data.user);
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get<{ success: boolean; data: { user: BackendAuthUser } }>('/auth/me');
  return mapAuthUser(response.data.data.user);
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    setAuthToken(null);
  }
};
