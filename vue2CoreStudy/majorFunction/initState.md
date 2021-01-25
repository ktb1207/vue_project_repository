### 关于 initState 源码分析

---

定义：vue\src\core\instance\state.js
初始化调用：vue\src\core\instance\init.js

```
// 初始化 props,methods,data,computed,watch,
initState(vm)
```

源码：

```
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

作用说明：

- 初始化 vue 实例属性 props,methods,data,computed,watch
- 该方法介于 beforeCreate 和 created 两个钩子之间
- 所以在 beforeCreate 的时候我们还无法访问到 Vue 实例上的 data，props，methods 等属性

---

#### 1. initProps

```
function initProps (vm: Component, propsOptions: Object) {
  // 存放父组件传入子组件的props
  const propsData = vm.$options.propsData || {}
  // 存放经过转换后的最终的props的对象
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  // 一个存放props的key的数组，就算props的值是空的，key也会存在里面
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    // 校验props，包括对类型的校验以及产生最后的属性值
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      // 非生产环境中, 将props变成可响应的，，如果用户修改props，发出警告
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      // 生产环境中, 将props变成可响应
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      // 使用proxy将不在vm上的属性代理到Vue实例上
      // 让我们在组件里可以使用this[key]的方式调用props[key]的值
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
```

说明：

- 首先遍历 propsOptions 也就是 options 中的 props，将 key 字段 push 到 keys 数组里
- 然后通过 validateProp 方法对 prop 进行校验
- 主要是对 prop 的类型校验，以及判断父组件是否有传入相应的值
- 如果没有，则查看子组件中有没有声明 default 属性，有则将 default 产生的值作为 props 的 value
- 校验完 props 之后就是使用 defineReactive 将 prop 变成可响应
- 最后使用 proxy 将不在 vm 上的属性代理到 Vue 实例上
- 让我们在组件里可以使用 this[key]的方式调用 props[key]的值

#### 2.initMethods

```
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        // methods key必须为function
        warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        // methods key不能与props key 重复
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        // methods key 不能以$或_开头
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    // 把每个methods[key]绑定到vm上，并将methods[key]的this指向vm
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}
```

说明：

- 首先检查 methods key 值必须为 function
- 再检查 methods key 不能与 props key 重复
- 其次检查 methods key 命名规范不能以$或\_开头
- 最后把每个 methods[key]绑定到 vm 上，并将 methods[key]的 this 指向 vm
