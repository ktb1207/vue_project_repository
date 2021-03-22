import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './styles/reset.css';
import './styles/main.scss';

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app');
