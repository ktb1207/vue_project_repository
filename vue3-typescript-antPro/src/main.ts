import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { store, mainStorekey } from './store';
import './styles/reset.css';
import './styles/style.scss';
import 'ant-design-vue/dist/antd.css';

console.log(process.env.VUE_APP_BASE_URL);
createApp(App)
  .use(store, mainStorekey)
  .use(router)
  .mount('#app');
