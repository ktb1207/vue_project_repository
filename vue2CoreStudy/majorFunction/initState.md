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
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    // options data存在，初始化data
    initData(vm);
  } else {
    // options data不存在，初始化data为空对象
    observe((vm._data = {}), true /* asRootData */);
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
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

#### 3. initData

```

function initData(vm: Component) {
  // 获取$options里的data
  let data = vm.$options.data;
  // 判断data是不是个方法，因为data在创建Vue实例的时候可以传入对象也可以传入方法
  // 传入的data是个方法，则执行该方法获取真实的data
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (process.env.NODE_ENV !== "production") {
      // 判断data key不能与methods key重名
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    // // 判断data key不能与props key重名
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(key)) {
      // 则将data[key]使用proxy代理到vm上,方便使用this.key访问data
      proxy(vm, `_data`, key);
    }
  }
  // observe data
  // 使用observe方法将整个data变为可响应的
  observe(data, true /* asRootData */);
}
```

说明：

- 首先获取 options 里面 data
- 判断 data 是否为 function,如果是 function 则执行 function 获取 data,否则获取 options 属性 data
- 判断 data key 值不能与 methods key 值重名
- 判断 data key 值不能与 props key 值重名
- 则将 data[key]使用 proxy 代理到 vm 上,方便使用 this.key 访问 data
- 使用 observe 方法将整个 data 变为可响应的

#### 4. initComputed

```
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  // 定义空对象存放Watcher实例对象
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  for (const key in computed) {
    const userDef = computed[key];
    // 处理computed为函数和指定get/set对象
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      // 为每一个计算属性定义一个Watcher观察者对象
      // 这个对象是lazy的，不会立即就去执行计算（即get方法）
      // 等到用的时候才会去计算
      // 这个时候就会去读取这个计算属性依赖的可观察属性的值来计算
      // 读取的时候就会把这些依赖添加进这个计算watcher里
      // 所以当依赖变化时，通知到他的所有订阅watcher
      // 计算watcher接到依赖发生变化了，不会立即计算新值，而是标记dirty为true
      // 读取这个计算属性的时候，发现dirty为true，就是说数据已经不是最新的了，需要重新计算
      // 然后才去计算，否则直接取上一次计算的值value
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      // computed key 不能与data或props key 重名
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `The computed property "${key}" is already defined as a prop.`,
          vm
        );
      }
    }
  }
}
```

说明：

- 首先定义了一个空对象存放创建的 Watcher 对象实例
- 循环处理 computed 每一个 key
- 判断生命 computed 是否为 function 或者对象声明 get/set, 并获取 getter
- 为每一个计算属性定义一个 Watcher 观察着对象
- 检测 computed key 不能与 data 或者 props key 重名
- 使用 defineComputed 方法将 userDef 放到 vm 实例上，让我们可以直接通过 this 调用

#### 5. initWatch

```
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        // 为每个watch属性创建一个观察者对象
        createWatcher(vm, key, handler[i]);
      }
    } else {
      // 为每个watch属性创建一个观察者对象
      createWatcher(vm, key, handler);
    }
  }
}
```

说明：

- 初始化 watch，就是为每个 watch 属性创建一个观察者对象
- createWatcher 其实质还是通过`new Watcher()`创建观察者对象
- 调用相关 data/prop 属性的 get 方法
- get 方法又会在他的观察者列表里加上该 watcher
- 一旦这些依赖属性值变化就会通知该 watcher 执行 update 方法
- 也就是 watch 属性的 handler 方法
