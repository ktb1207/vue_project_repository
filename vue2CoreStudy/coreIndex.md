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

##### 2. initUse

- 定义位置：src\core\global-api\use.js

```
// 导入toArray辅助函数
import { toArray } from '../util/index'
// 定义并导出initUse函数
export function initUse (Vue: GlobalAPI) {
  // 定义Vue类静态方法use，接受插件函数或对象
  Vue.use = function (plugin: Function | Object) {
    // 定义内部属性installedPlugins，存放已安装插件
    // 首次应用时定义为空数组
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // // 检测是否安装过传入的插件，已存在则返回
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    // 处理附加参数，加入参数Vue
    // 插入Vue类本身为第一个元素
    args.unshift(this)
    // 如果插件有install方法，则在plugin对象上调用并传入新参数
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      // 如果plugin本身是函数，则直接调用并传入新参数
      plugin.apply(null, args)
    }
    // 向缓存插件数组中添加此插件并返回
    installedPlugins.push(plugin)
    return this
  }
}
```

- 作用：Vue.use()全局安装插件
- 说明：

- 在内部定义了数组来缓存已经注册过的插件，并在下一次注册前检验是否已注册过，避免重复注册
- 接受参数为 object 或者 function
- 如果插件是 object，则必须有 install 方法，否则没有任何行为

##### 3. initMixin

- 定义位置：src\core\global-api\mixin.js

```
// 导入mergeOptions辅助函数
import { mergeOptions } from '../util/index'
// 定义并导出initMixin函数
export function initMixin (Vue: GlobalAPI) {
  // 定义Vue的静态方法mixin
  Vue.mixin = function (mixin: Object) {
    / 合并配置对象，重置Vue类的静态属性options
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

- 作用：Vue.mixin()扩展重用
- 说明：其内部实质是通过调用 mergeOptions 将 options 进行合并

##### 4. set

- 定义位置：src\core\observer\index.js

```
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 开发环境 且 null ｜ string ｜ number ｜ symbol ｜ boolean 提示
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 当 target 为数组 且 key 为有效 key 的时候
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    // 替换对应的值 并返回
    target.splice(key, 1, val)
    return val
  }
  // 当 key 存在 target 的属性中
  if (key in target && !(key in Object.prototype)) {
    // 替换对应的值 并返回
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  // 非响应式对象 直接返回
  if (!ob) {
    target[key] = val
    return val
  }
  // 新增加对应 key 的响应事件，添加响应式
  defineReactive(ob.value, key, val)
  // 推送对应的订阅消息
  // 返回结果
  ob.dep.notify()
  return val
}
```

- 说明：
- 数组，替换 key 对应的 val 并返回最新结果
- 对象：
  - key 存在对象的属性上时，替换 key 对应的 val 并返回最新结果
  - vue 实例 或者 存在 vmCount 属性时，直接返回 val
  - 非响应式对象时，直接返回 val
  - 响应式对象，且 key 不存在 prototype 上时，增加对应的事件，返回对应的 val

##### 5. delete

- 定义位置：src\core\observer\index.js

```
export function del (target: Array<any> | Object, key: any) {
  // 开发环境 且 null ｜ string ｜ number ｜ symbol ｜ boolean 提示
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  // 判断是否是数组，以及 key 是否合法
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 如果是数组通过 splice 删除
    // splice 做过响应式处理
    target.splice(key, 1)
    return
  }
  // 获取 target 的ob 对象
  const ob = (target: any).__ob__
  // target 如果是 Vue 实例或者是 $data 对象，直接返回
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  // 如果 target 对象没有 key 属性直接返回
  if (!hasOwn(target, key)) {
    return
  }
  // target存在key,删除属性
  delete target[key]
  if (!ob) {
    return
  }
  // 通过 ob 发送通知
  ob.dep.notify()
}
```
