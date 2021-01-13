### src\core\instance\index.js 文件分析

---

文件作用：

- 定义 Vue 构造函数
- 实例方法初始化

代码分析

```

// 真正的VUE构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化
  this._init(options)
}

// 实例方法的初始化

initMixin(Vue) // 混入_init()
stateMixin(Vue) // 实现$set/$delete/$watch方法
eventsMixin(Vue) // 实现$emit/$on/$off/$once四个方法
lifecycleMixin(Vue) // 实现_update/$forceUpdate/$destory三个方法
renderMixin(Vue) // 实现_render/$nextTick方法

export default Vue
```

#### 重点函数

##### 1. initMixin

- 定义位置：src\core\instance\init.js
- 作用：
  - 1.  定义\_init 方法
  - 2.  merge options
  - 3.  生命周期相关变量初始化:initLifecycle(vm)
  - 4.  事件监听初始化:initEvents(vm)
  - 5.  编译 render 初始化:initRender(vm)
  - 6.  beforeCreate 生命钩子的回调
  - 7.  把 inject 的成员注入到 vm 上: initInjections(vm)
  - 8.  初始化 vm 的 \_props/methods/\_data/computed/watch: initState(vm)
  - 9.  初始化 provide: initProvide(vm)
  - 10. created 生命钩子的回调
  - 11. // 调用 $mount() 挂载: vm.$mount(vm.$options.el)

```
let uid = 0
export function initMixin (Vue: Class<Component>) {
  // 给 Vue 实例增加 _init() 方法
  Vue.prototype._init = function (options?: Object) {
    // 合并 options / 初始化操作
    const vm: Component = this
    // a uid
    //每个vue new之后 uid++
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    // 如果是 Vue 实例不需要被 observe，本来就是响应式数据
    vm._isVue = true
    // merge options
    // 合并 options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      //优化内部组件实例化
      // since dynamic options merging is pretty slow, and none of the
      //因为动态选项合并是非常缓慢的，而且没有
      // internal component options needs special treatment.
      //内部组件选项需要特殊处理
      // 把组件依赖于父组件的props、listeners也挂载到options上，方便子组件调用
      initInternalComponent(vm, options)
    } else {
      //合并配置,.vue单文件组件注册到 options.components[options.name] = Ctor
      vm.$options = mergeOptions(
        // 解析constructor上的options属性的
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // vm 的生命周期相关变量初始化
    // $children/$parent/$root/$refs
    initLifecycle(vm)
    // vm 的事件监听初始化, 父组件绑定在当前组件上的事件
    initEvents(vm)
    // vm 的编译render初始化
    initRender(vm)
    // beforeCreate 生命钩子的回调
    callHook(vm, 'beforeCreate')
    // 把 inject 的成员注入到 vm 上
    initInjections(vm) // resolve injections before data/props
    // 初始化 vm 的 _props/methods/_data/computed/watch
    initState(vm)
    // 初始化 provide
    initProvide(vm) // resolve provide after data/props
    // created 生命钩子的回调
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    // 调用 $mount() 挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

##### 2. stateMixin

- 定义位置：src\core\instance\state.js
- 作用: 实现 `$set, $delete, $watch`方法

```
export function stateMixin (Vue: Class<Component>) {

  const dataDef = {}
  // 返回this._data 只有get，作为只读属性
  dataDef.get = function () { return this._data }
  // 返回this._props 只有get，作为只读属性
  const propsDef = {}
  propsDef.get = function () { return this._props }
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      // 避免替换根实例$data
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      )
    }
    // 警告只读
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  // 给vue原型定义$data属性
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  // 给vue原型定义$props属性
  Object.defineProperty(Vue.prototype, '$props', propsDef)
  // $set方法 :todo 添加一个数组数据或对象数据
  Vue.prototype.$set = set
  // $delete方法 :todo 删除一个数组数据或对象数据
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any, // 回调函数
    options?: Object // 参数 可选
  ): Function {
    // 获取实例
    const vm: Component = this
    if (isPlainObject(cb)) {
      // 如果回调是个对象，递归深层监听，直到不是对象跳出
      return createWatcher(vm, expOrFn, cb, options)
    }
    // 参数
    options = options || {}
    options.user = true
    // 实例化一个watcher 观察者
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        // 触发回调
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    // 卸载watcher 观察者
    return function unwatchFn () {
      // 从所有依赖项的订阅方列表中删除self。
      watcher.teardown()
    }
  }
}
```
