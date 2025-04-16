<<<<<<< HEAD
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
//import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  /*{
    path: "/",
    name: "home",
    component: HomeView,
  },*/
=======
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/aboutUs/AboutUs.vue'),
  },
>>>>>>> master
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
