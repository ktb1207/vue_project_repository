import { App } from 'vue';
import KP from './KP';

interface ComponentType {
  install: (app: App) => void;
  [propName: string]: any;
}

const install: ComponentType = {
  install: (app: App): void => {
    app.component(KP.name, KP);
  }
};
const component = KP;
const _KP = Object.assign(install, component);

// 单个注册use调用
export { _KP };
// 作为全局注册use调用
export default _KP;
