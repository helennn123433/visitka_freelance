import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/Pages/HomePage.vue'),
  },
  {
    path: '/service/:id',
    name: 'servicePage',
    component: () => import('@/Pages/ServicePage.vue'),
    props: true,
  },
  {
    path: '/serviceType',
    name: 'serviceTypePage',
    component: () => import('@/Pages/ServiceTypePage.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;