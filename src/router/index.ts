import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { showCommonComponents: true },
  },
  {
    path: '/service/:serviceId',
    name: 'service',
    component: () => import('@/pages/ServicePage.vue'),
    props: true,
    meta: { showCommonComponents: true },
  },
  {
    path: '/services/:serviceId/subservices/:subserviceId/types/:typeId',
    name: 'subservice-examples',
    component: () => import('@/pages/ServiceTypePage.vue'),
    props: (route) => ({
      serviceTitle: route.query.serviceTitle,
      subserviceTitle: route.query.subserviceTitle
    }),
    meta: { showCommonComponents: true },
  },
  {
    path: '/authentication',
    name: 'authentication',
    component: () => import('@/pages/AuthenticationPage.vue'),
    meta: { showCommonComponents: false },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;