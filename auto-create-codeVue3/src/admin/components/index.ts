import { App } from 'vue';
// row
import krow from './KRow/index';
// col
import kcol from './KCol/index';
// p
import kp from './KP/index';
// image
import kimage from './KImage/index';
// 单个use
export { default as KRow } from './KRow/index';
export { default as KCol } from './KCol/index';
export { default as KP } from './KP/index';
export { default as KImage } from './KImage/index';
interface ComponentProps {
  [propName: string]: any;
}
const components: ComponentProps = {
  // 重命名
  KRow: krow,
  KCol: kcol,
  KP: kp,
  KImage: kimage
};
const install = (app: App): void => {
  Object.keys(components).forEach((c) => {
    app.use(components[c]);
  });
};
const index = {
  install
};
// 全部use
export default index;
