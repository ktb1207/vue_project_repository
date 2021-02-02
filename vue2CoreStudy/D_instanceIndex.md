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
    // vm 的生命周期设计用到的相关变量初始化
    /*
    * vm.$parent
    * vm.$children
    * vm.$root
    * $refs
    * vm._isMounted
    * vm._isDestroyed
    * vm._isBeingDestroyed
    */
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
    // options存在el选项，自动挂载，调用 $mount() 挂载
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

##### 3. eventsMixin

- 定义位置： src\core\instance\events.js
- 作用：给组件实例附加`$on, $once, $off, $emit`方法实现

```
export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  // 看来$on同时监听多个事件，调用同一个回调, 'click', ['click', 'hover']应该都可以
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    // 获取实例本身
    const vm: Component = this
    // 如果是数组，就直接递归调用本身的$on方法
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      // 单个事件名称的时候，向组件实例的_events竖向中添加一组监听，一个事件可以有多个监听事件的回调
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      // 处理hook事件
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    // 获取实例自身
    const vm: Component = this
    function on () {
      // 解绑
      vm.$off(event, on)
      // 执行一次回调
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    // all,如果调用$off()没有传参，默认清空_events记录的所有事件监听映射
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events 数组的话就直接遍历之后递归
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    // 没有找到对应的handler就直接返回，没有需要移除的
    if (!cbs) {
      return vm
    }
    // 如果没有传入对应的handler，那就直接把该事件的监听handler置为null
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    如果传入了对应的handler，就从事件监听回调队列中找到对应的handler并移除
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      // 自己发射自己监听
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    /*
    * 初始化的时候把父组件监听子组件发射的事件已经绑定到子组件的_events中了，
    * 所以如果子组件在发射了事件之后，如果发现父组件已经有了对应的处理方法，
    * 就执行对应的回调
    */
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
}
```

- $emit 理解：
  - 事件绑定就是通过原生的事件触发其组件内部已经定义好的句柄
  - emit 看起来是发射了一个事件出去实际只是执行了在初始化就传递过来的父组件绑定的监听回调，相当于一个 ajax 的回调
  - 因为父组件不知道子组件啥时候会发射事件

##### 4. lifecycleMixin

- 定义位置：src\core\instance\lifecycle.js
- 作用：初始化原型方法 `_update, $forceUpdate, $destroy`

```
export function lifecycleMixin(Vue: Class<Component>) {
  /*
  * _update : 更新数据 主要功能在于第一次和后面更新是用的不同__patch__，
  * 根据preveVnode判断是否有vnode
  */
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    // 保存Vue实例
    const vm: Component = this;
    // 获取Vue的el
    const prevEl = vm.$el;
    // 获取Vue的vnode 标志上一个vnode
    const prevVnode = vm._vnode;
    const restoreActiveInstance = setActiveInstance(vm);
    //标志上一个vnode
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    /*
    * 如果prevVnode不存在，表示上一次没有创建vnode，
    * 这个组件或者new Vue 是第一次进来
    */
    if (!prevVnode) {
      // initial render
      // 更新虚拟dom
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      // 更新
      // 如果prevVnode存在,表示已经创建过vnode，所以只要更新数据就行了
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    //如果parent是一个HOC，那么也要更新它的$el
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };
  // $forceUpdate :强制更新数据 观察者数据
  Vue.prototype.$forceUpdate = function () {
    // 保存vue实例
    const vm: Component = this;
    // 如果有_watcher 观察者，就更新
    if (vm._watcher) {
      // 执行update 更新观察者数据
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    // 保存vue实例
    const vm: Component = this;
    // 如果已经销毁过，直接返回
    if (vm._isBeingDestroyed) {
      return;
    }
    // 触发生命周期beforeDestroy钩子函数
    callHook(vm, "beforeDestroy");
    // 将这个标识设为true，表示已经开始销毁
    vm._isBeingDestroyed = true;
    // remove self from parent
    // 从父节点移除self
    const parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    // 如果_watcher还存在 拆卸观察者
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    let i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    // 将这个设为true，表示已经完成销毁 调用最后一个钩子函数
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    // 调用当前渲染树上的销毁钩子
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    // 触发生命周期destroyed钩子函数
    callHook(vm, "destroyed");
    // turn off all instance listeners.
    // 销毁事件监听器
    vm.$off();
    // remove __vue__ reference
    // 删除vue参数
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    // 释放循环引用 销毁父节点
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}
```

总结：

- `_update`：在第一次更新和后面更新使用的是不同的**patch**，重载，传不同参数；
  因为第一次 new Vue()不存在 vnode
- `$destroy`：
  - 1.判断组件是否已经销毁 `vm._isBeingDestroyed`
  - 2.触发生命周期 beforeDestroy 钩子函数
  - 3.`vm._isBeingDestroyed = true`，将这个标识设为 true，表示已经开始销毁
  - 4.从父节点移除组件自身
  - 5.`vm._isDestroyed = true` 表示已经完成销毁
  - 6.调用当前渲染树上的销毁钩子`vm.__patch__(vm._vnode, null)`
  - 7.触发生命周期 destroyed 钩子函数 8.销毁事件监听器 vm.$off()

##### 5. renderMixin

- 定义位置：src\core\instance\render.js
- 作用：
  - 1.  vue 原型挂载$nextTick 方法
  - 2.  vue 原型挂载\_render 方法

```
export function renderMixin (Vue: Class<Component>) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          // _render方法核心，通过执行createElement方法并返回vnode
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
}
```

说明：

- `_render`函数主要通过执行`vnode = render.call(vm._renderProxy, vm.$createElement)`,将`options.render`render 函数调用`createElement`返回 vnode
- `options.render`render 函数是将 template 解析而来
