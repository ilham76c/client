import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { LoginRequest, RegisterRequest, User } from '@/lib/types';

/**
 * Auth API functions
 */
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<{ user: User; token: string }>(API_ENDPOINTS.auth.login, data),

  register: (data: RegisterRequest) =>
    apiClient.post<User>(API_ENDPOINTS.auth.register, data),

  logout: () => apiClient.post(API_ENDPOINTS.auth.logout),

  getSession: () => apiClient.get(API_ENDPOINTS.auth.session),

  refreshToken: () => apiClient.post(API_ENDPOINTS.auth.refresh),
};