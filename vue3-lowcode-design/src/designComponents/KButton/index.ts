import { App } from 'vue';
import KButton from './KButton';
import { IInstalType } from '../shareType';

const install: IInstalType = {
  install: (app: App): void => {
    app.component(KButton.name, KButton);
  }
};

const component = KButton;
const _KButton = Object.assign(install, component);

// 单个注册use调用
export { _KButton };
// 作为全局注册use调用
export default _KButton;
