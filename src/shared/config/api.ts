const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  baseUrl: isDevelopment ? 'http://localhost:8080' : '',

  endpoints: {
    // Public endpoints
    services: '/api/services',
    subservices: '/api/subservices',
    serviceTypeProjects: '/api/services-types-projects',
    contacts: '/api/contacts',
    aboutUs: '/api/about-us',
    auth: '/api/auth',

    // Admin endpoints
    admin: {
      services: '/admin/services',
      subservices: '/admin/subservices',
      typeProjects: '/admin/type-projects',
      contacts: '/admin/contacts',
      aboutUs: '/admin/about-us',
    },
  },

  timeout: 10000,
} as const;

export type ApiEndpoints = typeof API_CONFIG.endpoints;
