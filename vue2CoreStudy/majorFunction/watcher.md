### watcher分析
---
Watcher分为三种：
- Computed Watcher
- 用户 Watcher (监听器)
- 渲染 Watcher

创建顺序：
计算属性 Watcher、用户 Watcher (监听器)、渲染 Watcher


---
#### 1.渲染Watcher
- 渲染watcher的创建位置：vue\src\core\instance\lifecycle.js的mountComponent函数中
```js
new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
```
- 渲染watcher会在组件实例化时创建一个watcher，并挂载到vm_watchers上
- 这个Watcher最终会回调Vue的渲染函数从而完成Vue的更新渲染

#### 2.Computed Watcher
computed其数据来源是在props或data中定义好的数据
- computed初始化
定义位置：vue\src\core\instance\state.js
```js
function initComputed(vm: Component, computed: Object) {
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
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }
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
- 遍历options中的computed属性并在非服务器渲染方式的情况下，依次为每一个计算属性产生一个Watcher
- 即computed就是依赖Watcher实现的
- 但是具体和普通的Watcher有什么不同？继续看defineComputed实现：
```js
export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering();
  // 区分computed两种类型，function和object
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key) 
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop; // 空函数
  } else {
    // 对象方式
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      );
    };
  }
  // 数据劫持
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```
defineComputed的作用，主要是区分computed属性为function或者object，分别设置数据劫持操作的getter方法

createComputedGetter方法如下：
```js
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      // dirty标志数据是否发生变化
      if (watcher.dirty) {
        // 执行watcher.get()方法，并设置dirty为false 
        watcher.evaluate();
      }
      // // 收集依赖
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

##### 重点：这里就找到了computed与watcher的区别了
- computed就是依赖Watcher实现，为每一个计算属性定义一个Watcher观察者对象，这个对象是lazy的，不会立即就去执行计算（即get方法），等到用的时候才会去计算
- 当依赖变化时，通知到他的所有订阅watcher
- 计算watcher接到依赖发生变化了，不会立即计算新值，而是标记dirty为true
- 读取这个计算属性的时候，发现dirty为true，就是说数据已经不是最新的了，需要重新计算，然后才去计算，否则直接取上一次计算的值value

#### 3.用户 Watcher (监听器)
- 定义位置：vue\src\core\instance\state.js
```js
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
- initWatch在initState初始化时执行初始化
- 遍历options定义watcher对象属性key
- 区分watcher属性值定义为函数或者object为每一个对应key创建watcher

继续看createWatcher实现

```js
function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // 如果指定的参数为纯对象如：
  // a: {
  //       hander: 'methodName',
  //       deep: Boolean
  //    }
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  // 如果handler是字符串，则表示方法名，需要根据方法名来获取到该方法的句柄
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  // 内部调用$watch
  return vm.$watch(expOrFn, handler, options);
}
```

继续看vm.$watcher方法
- 定义位置：vue\src\core\instance\state.js

```js
Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this;
    // 纯对象递归调用
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    // 用户自定义Watcher标志
    options.user = true;
    // 创建一个Watcher实例
    const watcher = new Watcher(vm, expOrFn, cb, options);
    // 立即执行回调？
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(
          error,
          vm,
          `callback for immediate watcher "${watcher.expression}"`
        );
      }
    }
    return function unwatchFn() {
      watcher.teardown();
    };
  };
```


