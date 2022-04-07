import { App } from 'vue';
import KInput from './KInput';
import { IInstalType } from '../shareType';

const install: IInstalType = {
  install: (app: App): void => {
    app.component(KInput.name, KInput);
  }
};

const component = KInput;
const _KInput = Object.assign(install, component);

// 单个注册use调用
export { _KInput };
// 作为全局注册use调用
export default _KInput;
