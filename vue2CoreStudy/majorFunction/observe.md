### 关于 vue 的响应式系统重要的函数 observe()

- 定义位置：vue\src\core\observer\index.js
- 调用位置：vue\src\core\instance\state.js

```
export function initState(vm: Component) {
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

---

#### 1.observe

```
export function observe(value: any, asRootData: ?boolean): Observer | void {
  // 判断如果数据不是一个对象或者是一个VNode实例，直接返回
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  // 判断了数据对象是否包含__ob__属性，并且判断属性值是否是Observer的实例
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    // 条件为真的话，就把value.__ob__的值赋给ob
    ob = value.__ob__;
    // 为什么会有这个判断呢？
    // 每个数据对象被观测后都会在该对象上定义一个__ob__属性,
    // 这个判断是为了防止重复观测一个对象。
  } else if (
    shouldObserve &&
    !isServerRendering() && // 判断是否是服务端渲染,只有当不是服务端渲染的时候才会进行观测
    (Array.isArray(value) || isPlainObject(value)) && // 只有当数据对象是数组或者纯对象时才进行观测
    Object.isExtensible(value) &&
    !value._isVue // Vue实例含有_isVue属性，这个判断是为了防止Vue实例被观测
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

说明：

- observe 观察的如果不是对象或者是 Vnode，不做处理直接返回，即只能观察对象数据(object/array)
- 判断数据对象是否包含**ob**属性,防止重复观观测
- 返回 ob 实例

#### 2. Observe 类

```
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    // 属性初始化
    this.value = value;
    this.dep = new Dep(); // 依赖收集容器
    this.vmCount = 0;
    // 为数据对象添加了__ob__属性，它的值就是当前Observer实例对象
    def(value, "__ob__", this);
    // 来区分数组和对象，因为对数组和对象的处理不同
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      // 数组
      this.observeArray(value);
    } else {
      // object
      this.walk(value);
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  // 遍历了对象的属性
  // 对每个属性都调用了defineReactive方法
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * Observe a list of Array items.
   */
  // 遍历数组成员，observe数组成员
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

说明：

- 初始化依赖收集容器`this.dep = new Dep()`
- 观测对象添加**ob**属性，它的值就是当前 Observer 实例对象
- 调用 defineReactive 进行对象属性访问和修改劫持

#### 3. defineReactive

```
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 定义dep收集对应字段访问的依赖
  const dep = new Dep();
  // 判断该字段是否是可配置
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    // 如果不可配置，直接返回
    // 因为不可配置的属性是不能通过Object.defineProperty改变其属性定义的。
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }
  // 性值val也可能是一个对象，所以调用observe继续观测
  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // get函数首先是要返回属性值，还有就是在这里收集依赖
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        // 在get中收集依赖
        dep.depend(); // depend方法执行就是收集依赖
        if (childOb) {
          childOb.dep.depend(); // 深层对象添加依赖收集
          if (Array.isArray(value)) {
            // 如果属性值是数组，调用dependArray函数逐个触发数组元素的依赖收集
            dependArray(value);
          }
        }
      }
      return value;
    },
    // set函数主要是设置属性值和触发依赖。
    set: function reactiveSetter(newVal) {
      // 首先也是获取原来的属性值
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      // 新旧值相等，就可以直接返回不用接下来的操作了
      // newVal !== newVal && value !== value 这个比较主要处理NaN NaN === NaN // false
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      // 如果存在getter不存在setter的话，直接返回
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 如果新值也是一个数组或纯对象的话，这个新值是未观测的。所以在需要深度观测的情况下，要调用observe对新值进行观测
      childOb = !shallow && observe(newVal);
      // 触发依赖
      dep.notify();
    },
  });
}
```

说明：

- 判断观测对象是否是可配置
- 观测对象属性值如果为 object 则调用 observe 递归进行观测
- get 函数进行返回属性值和在这里进行收集依赖
- set 函数主要是设置属性值和触发依赖。

---

### 关于对 vue 双向数据绑定的总结：

- ##### Vue 的双向数据绑定是采用的数据劫持和发布者-订阅者模式
- ##### 数据劫持是通过 Object.defineProperty
- ##### Observer 类用来监视数据的，也就是发布者
- ##### Dep 类存储了一些与 Watcher 有关的东西，起到了一个收集器的作用
- ##### Watcher 就是订阅者

---

- 钩子函数 beforeCreate 和 created 之间会调用 initState,初始化 methods，data，props 等；
- 在初始化 data 时，会完成数据代理，vm.xx = vm.\_data.xx = vm.data.xx，之后会调用 observe 方法，初始化一个 Observer 实例，所谓发布者；
- 初始化 Observer 实例会对 data 的每个属性设置 setter/getter，同时每个属性都会初始化一个 Dep 实例，用来收集订阅者(Watcher)；
- 模板编译中会对指令{{}}数据绑定初始化 Watcher 实例，初始化时会调用 get 方法，触发对应属性的 getter 将自身添加到对应属性的对应的 Dep 实例 dep 的 subs 数组中
- 属性的值变化的时候，触发 setter，调用属性对应的 Dep 实例 dep 的 notify（）方法，notify 方法会去遍历 subs 数组中存放的 Watcher 实例，通知每个实例调用 update 对数据变化做出反应
