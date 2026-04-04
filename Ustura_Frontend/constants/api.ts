// API endpoint sabitleri

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  SALONS: {
    LIST: '/salons',
    DETAIL: (id: string) => `/salons/${id}`,
    STAFF: (salonId: string) => `/salons/${salonId}/staff`,
    SLOTS: (salonId: string) => `/salons/${salonId}/slots`,
  },
  RESERVATIONS: {
    CREATE: '/reservations',
    MY: '/reservations/my',
    BY_SALON: (salonId: string) => `/reservations/salon/${salonId}`,
    CANCEL: (id: string) => `/reservations/${id}`,
  },
};
