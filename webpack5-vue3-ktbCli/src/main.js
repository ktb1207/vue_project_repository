import { createApp } from 'vue';
import App from '@/App.vue';
import router from './route/index';
import '@/style/reset.css';
import '@/style/style.scss';
const app = createApp(App);
app.use(router);
app.mount('#app');
