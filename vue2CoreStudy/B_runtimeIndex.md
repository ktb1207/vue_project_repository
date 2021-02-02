### vue\src\platforms\web\runtime\index.js 文件分析

#### 说明：在 Vue 原型定义 mount 方法并扩展 vue.options 实例 directives 和 components

代码分析

```
// install platform specific utils
// 注册平台特殊工具方法

Vue.config.mustUseProp = mustUseProp; // 表单组件 input,textarea,option,select,progress
Vue.config.isReservedTag = isReservedTag; // html元素或者svg元素
Vue.config.isReservedAttr = isReservedAttr; // style class属性
Vue.config.getTagNamespace = getTagNamespace; // svg / math
Vue.config.isUnknownElement = isUnknownElement; // 是否是未知的html元素，

// vue实例注册directives，components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
// 浏览器平台，挂载原型方法 _patch_
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// 定义mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean // 是否服务端渲染
): Component {
  el = el && inBrowser ? query(el) : undefined;
  // 组件挂载
  return mountComponent(this, el, hydrating);
};
```

##### 重点函数

##### 1. mountComponent（挂载组件）

- 定义位置：src/core/instance/lifecycle.js

```
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean // 是否服务端渲染，浏览器为false
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    // /*render函数不存在的时候创建一个空的VNode节点*/
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      ...
    }
  }
  // /*触发beforeMount钩子*/
  callHook(vm, 'beforeMount')
  /*updateComponent作为Watcher对象的getter函数，用来依赖收集*/
  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const startTag = `vue-perf-start:${id}`;
      const endTag = `vue-perf-end:${id}`;

      mark(startTag);
      // 调用_render函数，render函数返回vnode
      const vnode = vm._render();
      mark(endTag);
      measure(`vue ${name} render`, startTag, endTag);

      mark(startTag);
      // _update 方法的作用是根据传入vnode进行新旧vnode diff生成真实dom
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(`vue ${name} patch`, startTag, endTag);
    };
  } else {
    updateComponent = () => {
      // _update 方法的作用是根据传入vnode进行新旧vnode diff生成真实dom
      vm._update(vm._render(), hydrating)
    }
  }

  /*这里对该vm注册一个Watcher实例，Watcher的getter为updateComponent函数，
  用于触发所有渲染所需要用到的数据的getter，进行依赖收集，该Watcher实例会存在所有
  渲染所需数据的闭包Dep中*/
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    /*标志位，代表该组件已经挂载*/
    vm._isMounted = true
    /*调用mounted钩子*/
    callHook(vm, 'mounted')
  }
  return vm
}
```

- 函数所做事情描述：
  - 判断实例上是否存在渲染函数，如果不存在，则设置一个默认的渲染函数 createEmptyVNode，、该渲染函数会创建一个注释类型的 VNode 节点；
  - 然后调用 callHook 函数来触发 beforeMount 生命周期钩子函数，beforeMount 生命周期在这里触发。
    这里就可以理解生命周期中说的，判断模板格式是否正确（上述所描述），也可以理解此时只是 render 函数并没有形成虚拟 dom，也没有将页面内容真正渲染上；
  - 定义了'updateComponent',其中这个定义函数中参数'vm.\_render()'将会为我们得到一份最新的 VNode 节点树,'如果调用了 updateComponent 函数，就会将最新的模板内容渲染到视图页面中'；
  - 接下来到了 watcher 这部分，updateComponent 函数作为第二个参数传给 Watcher 类从而创建了 watcher 实例，那么 updateComponent 函数中读取的所有数据都将被 watcher 所监控；
  - 挂载阶段才算是全部完成了，接下来调用挂载完成的生命周期钩子函数 mounted

##### 2. update（VNode-DOM）

- 定义位置：src/core/instance/lifecycle.js
- 作用：把 VNode 渲染成真实的 DOM
- 说明：Vue 的 \_update 是实例的一个私有方法，它被调用的时机有 2 个
  - 一个是首次渲染
  - 一个是数据更新的时候

```
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this;
    // 保存旧元素
    const prevEl = vm.$el;
    // 保存旧虚拟dom
    const prevVnode = vm._vnode;
    const restoreActiveInstance = setActiveInstance(vm);
    // 当前虚拟dom
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      // 初次渲染，不存在旧vnode
      // diff vnode并返回真实dom
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      // 更新过程，新旧vnode进行diff并返回真实dom
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
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };
```
