import { createApp } from 'vue';
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { store, mainStorekey } from './store';
import './assets/iconfont/iconfont.css';
import 'element-plus/lib/theme-chalk/index.css';
import './styles/reset.css';
import './styles/style.scss';
import './styles/resetElement.scss';
// import 'ant-design-vue/dist/antd.css';

// 设置Element+组件语言为中文
import lang from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale';
locale.use(lang);

console.log(process.env.VUE_APP_BASE_URL);
const elComponent = [ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu];
const app = createApp(App);
app.use(store, mainStorekey);
app.use(router);
// 批量注册
elComponent.forEach((item) => {
  app.use(item);
});
app.mount('#app');
