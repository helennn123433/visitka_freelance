import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { showCommonComponents: true },
  },
  {
    path: '/service/:id',
    name: 'service',
    component: () => import('@/pages/ServicePage.vue'),
    props: true,
    meta: { showCommonComponents: true },
  },
  {
    path: '/serviceType',
    name: 'serviceType',
    component: () => import('@/pages/ServiceTypePage.vue'),
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