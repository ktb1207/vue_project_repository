import { App } from 'vue';

interface ComponentProps {
  [propName: string]: any;
}

// krow
import krow from './KRow/index';
// kcol
import kcol from './KCol/index';
// kbutton
import kbutton from './KButton/index';
//
import kinput from './KInput/index';

// 单个use
export { default as KRow } from './KRow/index';
export { default as KCol } from './KCol/index';
export { default as KButton } from './KButton/index';
export { default as KInput } from './KInput/index';

const components: ComponentProps = {
  // 重命名
  KRow: krow,
  KCol: kcol,
  KButton: kbutton,
  KInput: kinput
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
