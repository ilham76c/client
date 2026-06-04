// API Endpoints constants
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    session: '/auth/session',
    refresh: '/auth/refresh',
  },

  // Users
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },

  // Financials
  financials: {
    list: '/financials',
    detail: (id: string) => `/financials/${id}`,
    create: '/financials',
    update: (id: string) => `/financials/${id}`,
    delete: (id: string) => `/financials/${id}`,
    report: (id: string) => `/financials/${id}/report`,
  },

  // Investor
  investor: {
    list: '/investor',
    detail: (id: string) => `/investor/${id}`,
    create: '/investor',
    update: (id: string) => `/investor/${id}`,
    delete: (id: string) => `/investor/${id}`,
    portfolio: (id: string) => `/investor/${id}/portfolio`,
  },

  // Ownership
  ownership: {
    list: '/ownership',
    detail: (id: string) => `/ownership/${id}`,
    create: '/ownership',
    update: (id: string) => `/ownership/${id}`,
    delete: (id: string) => `/ownership/${id}`,
  },

  // Dashboard
  dashboard: {
    summary: '/dashboard/summary',
    stats: '/dashboard/stats',
  },
} as const;