import { App } from 'vue';
import KImage from './KImage';

interface ComponentType {
  install: (app: App) => void;
  [propName: string]: any;
}

const install: ComponentType = {
  install: (app: App): void => {
    app.component(KImage.name, KImage);
  }
};
const component = KImage;
const _KImage = Object.assign(install, component);

// 单个注册use调用
export { _KImage };
// 作为全局注册use调用
export default _KImage;
