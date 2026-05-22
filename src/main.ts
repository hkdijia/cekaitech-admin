import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/global.css';
import App from './App.vue';
import { router } from './router';
import { unauthorizedEventName } from './api/http';

window.addEventListener(unauthorizedEventName, () => {
  if (router.currentRoute.value.path === '/login') {
    return;
  }
  router.push('/login');
});

createApp(App)
  .use(createPinia())
  .use(router)
  .use(ElementPlus)
  .mount('#app');
