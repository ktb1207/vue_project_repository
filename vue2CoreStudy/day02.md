### 寻找入口文件

### 1. 入口点

- `"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"`
- 关键词：
  - scripts/config.js
  - web-full-dev
- 根据以上信息，在 scripts/config.js 文件寻找关键词 web-full-dev,找到 rollup 打包配置信息

```
'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
```

- entry: 入口文件
- dest: 打包输出位置
- format: 'umd',输出格式
- env: 指定环境
- 根据 entry 指定 resolve('web/entry-runtime-with-compiler.js')，找到 resolve 定义

```
const aliases = require('./alias')
const resolve = p => {
  // web/entry-runtime-with-compiler.js
  const base = p.split('/')[0] // web
  if (aliases[base]) {
    // src/platforms/web/entry-runtime-with-compiler.js
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

### 2. 确定最终入口文件

- 位置：src/platforms/web/entry-runtime-with-compiler.js
- 文件作用：
  - 扩展 Vue.prototype.$mount 方法，处理 template 和 el 选项，尝试编译他们为 render 函数
  - 依赖：`import Vue from './runtime/index'`
- 继续向上寻找依赖文件：import Vue from './runtime/index'

### 3.web 端运行时入口

- 位置：src/platforms/web/runtime/index.js
- 作用：
  - 定义了$mount 方法
  - 执行挂载 mountComponent(this, el, hydrating)方法
- 依赖 `import Vue from 'core/index'`

### 4. src/core/index.js

- 作用：定义全局 api:initGlobalAPI(vue)
  - vue.set
  - vue.delete
  - vue.nextTick
  - vue.use
  - vue.mixin
  - vue.extend
- 依赖：`import Vue from './instance/index'`

### 5. src/core/instance/index.js

- 作用：Vue 构造函数定义

```
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
initMixin(Vue) // 实现了_init()方法
stateMixin(Vue) // 组件状态相关$data $props,$set,$watch,$delete
eventsMixin(Vue) // $on $once $off $emit
lifecycleMixin(Vue) // _updata,$forceudate,$destory
renderMixin(Vue) // $nextTick,_render
```

### 6. src/core/instance/init.js

- 作用:
  - 定义\_init()函数
  - 初始化函数实现

```
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    // 存储当前实例
    const vm: Component = this
    // // 确认自身为Vue实例
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // 对于组件传入的options的合并
      initInternalComponent(vm, options)
    } else {
      // mergeOptions 将传入的options和构造函数的options合并到实例本身的$options
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    vm._self = vm
    // new Vue()实例化执行了哪些操作？？
    initLifecycle(vm)  // 声明周期初始哈
    initEvents(vm)  // 事件初始化
    initRender(vm) // 渲染器初始化
    callHook(vm, 'beforeCreate') // 调用生命周期钩子
    initInjections(vm) / 获取注入数据-父传递来的数据 // resolve injections before data/props
    initState(vm) // 初始化组件中props, methods,data,computed watch
    initProvide(vm) // 提供数据-传递给子 // resolve provide after data/props
    callHook(vm, 'created') // 调用生命周期钩子

    if (vm.$options.el) {
      // 如果合并之后的选项中有 el，则将其进行挂载
      vm.$mount(vm.$options.el)
    }
  }
}
```
