import { App } from 'vue';
// row
import krow from './KRow/index';
// col
import kcol from './KCol/index';
// 单个use
export { default as KRow } from './KRow/index';
export { default as KCol } from './KCol/index';
interface ComponentProps {
  [propName: string]: any;
}
const components: ComponentProps = {
  // 重命名
  KRow: krow,
  KCol: kcol
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
