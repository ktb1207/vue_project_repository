import { App } from 'vue';
import KRow from './KRow';

interface ComponentType {
  install: (app: App) => void;
  [propName: string]: any;
}
// const _KRow: ComponentType = {
//   install: (app: App): void => {
//     app.component(KRow.name, KRow);
//   },
//   ...KRow
// };

const install: ComponentType = {
  install: (app: App): void => {
    app.component(KRow.name, KRow);
  }
};
const component = KRow;
const _KRow = Object.assign(install, component);

// 单个注册use调用
export { _KRow };
// 作为全局注册use调用
export default _KRow;
