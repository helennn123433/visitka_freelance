import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@pages/home/ui/HomePage.vue'),
    meta: { showCommonComponents: true },
  },
  {
    path: '/service/:serviceId',
    name: 'service',
    component: () => import('@pages/service/ui/ServicePage.vue'),
    props: true,
    meta: { showCommonComponents: true },
  },
  {
    path: '/services/:serviceId/subservices/:subserviceId/types/:typeId',
    name: 'subservice-examples',
    component: () => import('@pages/service-type/ui/ServiceTypePage.vue'),
    props: (route) => ({
      serviceTitle: route.query.serviceTitle,
      subserviceTitle: route.query.subserviceTitle
    }),
    meta: { showCommonComponents: true },
  },
  {
    path: '/authentication',
    name: 'authentication',
    component: () => import('@pages/authentication/ui/AuthenticationPage.vue'),
    meta: { showCommonComponents: false },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
