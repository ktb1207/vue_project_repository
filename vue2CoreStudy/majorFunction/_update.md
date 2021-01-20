### 关于vue中_update()方法的源码分析
---
1.定义位置：vue\src\core\instance\lifecycle.js
2.注册位置：vue\src\core\instance\index.js
```
lifecycleMixin(Vue); // 实现_update/$forceUpdate/$destory三个方法
```
2.说明：
- Vue 的 _update 是实例的一个私有方法，它被调用的时机有 2 个
- 一个是首次渲染
- 一个是数据更新的时候
3.作用：
- _update 方法的作用是通过调用vm.__patch__把 VNode 渲染成真实的 DOM
```
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
    // 如果prevVnode不存在，表示上一次没有创建vnode，这个组件或者new Vue 是第一次进来
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
```