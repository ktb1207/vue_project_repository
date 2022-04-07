import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '@/styles/reset.css';

import designComponent from '@/designComponents/index';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(designComponent);
app.mount('#app');
