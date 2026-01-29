const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  baseUrl: isDevelopment ? 'http://localhost:8080/api' : '/api',
  adminBaseUrl: isDevelopment ? 'http://localhost:8080' : '',

  endpoints: {
    services: '/services',
    subservices: '/subservices',
    serviceTypeProjects: '/services-types-projects',
    contacts: '/contacts',
    aboutUs: '/about-us',
    auth: '/auth',

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
