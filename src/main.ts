import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'
import '@/styles/fonts.scss';
import '@/styles/global.scss';
import { initializeApp } from './utils/authInit'

const pinia = createPinia()
const app = createApp(App)

app
  .use(pinia)
  .use(router);

initializeApp().then(() => {
  app.mount('#app')
})  

