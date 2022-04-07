import { App } from 'vue';
import KCol from './KCol';
import { IInstalType } from '../shareType';

const install: IInstalType = {
  install: (app: App): void => {
    app.component(KCol.name, KCol);
  }
};

const component = KCol;
const _KCol = Object.assign(install, component);

// 单个注册use调用
export { _KCol };
// 作为全局注册use调用
export default _KCol;
