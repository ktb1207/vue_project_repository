### src\core\index.js 文件分析

#### 说明：引入 vue 构造器，定义全局 api，添加 vue 版本号信息

代码分析

```
// 引入vue构造器
import Vue from "./instance/index";
// 调用initGlobalAPI方法，定义全局资源
import { initGlobalAPI } from "./global-api/index";
// 是否服务端渲染工具方法
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";
// 安装vue_api接口到Vue
initGlobalAPI(Vue);

// 添加vue版本信息

Vue.version = "__VERSION__";

export default Vue;
```

##### 重点函数

##### 1. initGlobalAPI（）

--- 定义位置：src\core\global-api\index.js

```
export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;

  // 定义Vue类的静态属性config
  Object.defineProperty(Vue, "config", configDef);

  // 导入内部辅助函数
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  // vue.set
  Vue.set = set;
  // vue.delete
  Vue.delete = del;
  // vue.nextTick
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj);
    return obj;
  };

  // 初始化Vue.options属性为空对象
  Vue.options = Object.create(null);
  // 初始化options属性的各个子属性为空对象
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  Vue.options._base = Vue;

  // 扩展options.components属性，加入内建组件
  extend(Vue.options.components, builtInComponents);

  // vue.use
  initUse(Vue);
  // vue.mixin
  initMixin(Vue);
  // vue.extend
  initExtend(Vue);
  // directive, component, filter
  initAssetRegisters(Vue);
}
```

--- 作用：

- 定义静态属性：
  - config:在最开始的部分定义了 Vue 的静态属性 config，这是全局配置对象。
  - options:存放初始化的数据，我们平时在创建 Vue 实例时传入的配置对象最终要与这份配置属性合并
- 定义静态方法：
  - util: 虽然暴露了一些辅助方法，但官方并不将它们列入公共 API 中，不鼓励外部使用。
  - set: 设置响应式对象的响应式属性，强制触发视图更新
  - delete: 删除响应式属性强制触发视图更新
  - nextTick: 结束此轮循环后执行回调
  - use: 安装插件，自带规避重复安装
  - mixin: 常用于混入插件功能
  - extend: 创建基于 Vue 的子类并扩展初始内容
  - directive：注册全局指令。
  - component：注册全局组件。
  - filter：注册全局过滤器。
