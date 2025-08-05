// API endpoint constants
export const ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_METRICS: '/dashboard/metrics',
  DASHBOARD_CHARTS: '/dashboard/charts',
  
  // Requests
  REQUESTS: '/requests',
  REQUEST_BY_ID: (id) => `/requests/${id}`,
  REQUEST_CREATE: '/requests',
  REQUEST_UPDATE: (id) => `/requests/${id}`,
  REQUEST_DELETE: (id) => `/requests/${id}`,
  
  // Deliveries
  DELIVERIES: '/deliveries',
  DELIVERY_BY_ID: (id) => `/deliveries/${id}`,
  DELIVERY_CREATE: '/deliveries',
  DELIVERY_UPDATE: (id) => `/deliveries/${id}`,
  DELIVERY_COMPLETE: (id) => `/deliveries/${id}/complete`,
  
  // Drivers
  DRIVERS: '/drivers',
  DRIVER_BY_ID: (id) => `/drivers/${id}`,
  DRIVER_PERFORMANCE: (id) => `/drivers/${id}/performance`,
  DRIVER_RATINGS: (id) => `/drivers/${id}/ratings`,
  
  // Analytics
  ANALYTICS: '/analytics',
  ANALYTICS_PERFORMANCE: '/analytics/performance',
  ANALYTICS_COSTS: '/analytics/costs',
  ANALYTICS_REPORTS: '/analytics/reports',
  
  // Auth (if needed)
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_PROFILE: '/auth/profile',
};