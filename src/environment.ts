const isDev = import.meta.env.VITE_IS_DEV === 'true';

export const env = {
  isDev,
  apiBaseUrl: isDev
    ? import.meta.env.VITE_API_BASE_URL || '/api/v1'
    : import.meta.env.VITE_API_PROD_URL || 'https://api.busticket.com/api/v1',
  apiDevTarget: import.meta.env.VITE_API_DEV_TARGET || 'http://localhost:8080',
} as const;
