import { createApp } from 'vue';
import App from './App.vue';
import { pinia, router } from './providers';
import './styles/fonts.scss';
import './styles/global.scss';
import { initializeAuth } from '@features/auth';

const app = createApp(App);

app
  .use(pinia)
  .use(router);

initializeAuth().then(() => {
  app.mount('#app');
});
