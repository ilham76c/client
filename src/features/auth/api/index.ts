import { apiGet, apiPost } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { LoginRequest, RegisterRequest, User } from '@/lib/types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiPost<{ user: User; token: string }>(API_ENDPOINTS.auth.login, data),

  register: (data: RegisterRequest) =>
    apiPost<User>(API_ENDPOINTS.auth.register, data),

  logout: () => apiPost(API_ENDPOINTS.auth.logout),

  getSession: () => apiGet(API_ENDPOINTS.auth.session),

  refreshToken: () => apiPost(API_ENDPOINTS.auth.refresh),
};
