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
    list: '/investors',
    detail: (id: string) => `/investors/${id}/detail`,
    create: '/investors',
    update: (id: string) => `/investors/${id}/update`,
    delete: (id: string) => `/investors/${id}/delete`,
    portfolio: (id: string) => `/investors/${id}/portfolio`,
    search: '/investors/search',
    holdings: (investorUid: string) => `/investors/${investorUid}/holdings`,
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

  emiten: {
    search: '/emiten/search',
    detail: (ticker: string) => `/emiten/${ticker}`,
    profile: (ticker: string) => `/emiten/${ticker}/profile`,
    prices: (ticker: string) => `/emiten/${ticker}/prices`,
    market: (ticker: string) => `/emiten/${ticker}/market`,
  },

  announcements: {
    list: (ticker?: string) =>
      `/announcements${ticker ? `?ticker=${ticker}` : ''}`,
    analysis: (announcement_uuid: string) =>
      `/announcements/${announcement_uuid}/analysis`,
  },

  insider: {
    activity: (ticker) => `/insider/${ticker}`
  }
} as const;
