/* @flow */

import config from "../config";
import Watcher from "../observer/watcher";
import { mark, measure } from "../util/perf";
import { createEmptyVNode } from "../vdom/vnode";
import { updateComponentListeners } from "./events";
import { resolveSlots } from "./render-helpers/resolve-slots";
import { toggleObserving } from "../observer/index";
import { pushTarget, popTarget } from "../observer/dep";

import {
  warn,
  noop,
  remove,
  emptyObject,
  validateProp,
  invokeWithErrorHandling,
} from "../util/index";

export let activeInstance: any = null;
export let isUpdatingChildComponent: boolean = false;
// 设置active实例
export function setActiveInstance(vm: Component) {
  // 记录之前的activeInstance
  const prevActiveInstance = activeInstance;
  // 将传入的赋给activeInstance
  activeInstance = vm;
  return () => {
    // 返回之前的
    activeInstance = prevActiveInstance;
  };
}

// 初始化生命周期相关的属性 以及为一些属性赋值
export function initLifecycle(vm: Component) {
  // 获取选项
  const options = vm.$options;

  // locate first non-abstract parent
  // <keep-alive> 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。
  let parent = options.parent;
  // 定位第一个非抽象父组件
  // 判断parent父亲节点是否存在，并且判断是否存在抽象节点
  if (parent && !options.abstract) {
    // 如果父实例parent是抽象组件，则继续找parent上的parent，直到找到非抽象组件为止
    while (parent.$options.abstract && parent.$parent) {
      // 如果有父亲抽象组件，则把父或爷爷节点给当前节点的父亲节点
      parent = parent.$parent;
    }
    // 子节点添加vm
    // 把当前vm实例push到定位的第一个非抽象parent的$children属性上
    parent.$children.push(vm);
  }
  // 初始化一些属性
  // 这里的parent可以告诉我们，子组件创建时，父组件已经存在了
  // 添加$parent
  vm.$parent = parent;
  // 判断parent是否是root 如果是 则把parent.$root赋给$root
  vm.$root = parent ? parent.$root : vm;
  // 当前实例的直接子组件。需要注意 $children 并不保证顺序，也不是响应式的。
  vm.$children = [];
  // 获取节点的key 一个对象，持有已注册过 ref 的所有子组件。
  vm.$refs = {};

  // 内部属性，不希望被访问的
  vm._watcher = null; //组件实例相应的 watcher 实例对象
  vm._inactive = null; // 表示keep-alive中组件状态，如被激活，该值为false,反之为true。
  vm._directInactive = false; // 也是表示keep-alive中组件状态的属性。
  vm._isMounted = false; // 当前实例是否完成挂载(对应生命周期图示中的mounted)。
  vm._isDestroyed = false; // 当前实例是否已经被销毁(对应生命周期图示中的destroyed)。
  vm._isBeingDestroyed = false; // 是否已经销毁的组件 如果为true 则不触发 beforeDestroy 钩子函数 和destroyed 钩子函数 当前实例是否正在被销毁,还没有销毁完成(介于生命周期图示中deforeDestroy和destroyed之间)。
}

export function lifecycleMixin(Vue: Class<Component>) {
  // _update : 更新数据 主要功能在于第一次和后面更新是用的不同__patch__，根据preveVnode判断是否有vnode
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

export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el;
  if (!vm.$options.render) {
    /*render函数不存在的时候创建一个空的VNode节点*/
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== "production") {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== "#") ||
        vm.$options.el ||
        el
      ) {
        warn(
          "You are using the runtime-only build of Vue where the template " +
            "compiler is not available. Either pre-compile the templates into " +
            "render functions, or use the compiler-included build.",
          vm
        );
      } else {
        warn(
          "Failed to mount component: template or render function not defined.",
          vm
        );
      }
    }
  }
  /*触发beforeMount钩子*/
  callHook(vm, "beforeMount");
  /*updateComponent作为Watcher对象的getter函数，用来依赖收集*/
  let updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const startTag = `vue-perf-start:${id}`;
      const endTag = `vue-perf-end:${id}`;

      mark(startTag);
      // 获得最新的一份的VNode节点树
      const vnode = vm._render();
      mark(endTag);
      measure(`vue ${name} render`, startTag, endTag);

      mark(startTag);
      // _update 方法的作用是把 VNode 渲染成真实的 DOM
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(`vue ${name} patch`, startTag, endTag);
    };
  } else {
    updateComponent = () => {
      // _update 方法的作用是把 VNode 渲染成真实的 DOM
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  /*这里对该vm注册一个Watcher实例，Watcher的getter为updateComponent函数，
  用于触发所有渲染所需要用到的数据的getter，进行依赖收集，该Watcher实例会存在所有
  渲染所需数据的闭包Dep中*/
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
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    /*标志位，代表该组件已经挂载*/
    vm._isMounted = true;
    /*调用mounted钩子*/
    callHook(vm, "mounted");
  }
  return vm;
}

export function updateChildComponent(
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== "production") {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  const newScopedSlots = parentVnode.data.scopedSlots;
  const oldScopedSlots = vm.$scopedSlots;
  const hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  const needsForceUpdate = !!(
    renderChildren || // has new static slots
    vm.$options._renderChildren || // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    const props = vm._props;
    const propKeys = vm.$options._propKeys || [];
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i];
      const propOptions: any = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  const oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== "production") {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) return true;
  }
  return false;
}

export function activateChildComponent(vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, "activated");
  }
}

export function deactivateChildComponent(vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return;
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, "deactivated");
  }
}

export function callHook(vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  const handlers = vm.$options[hook];
  const info = `${hook} hook`;
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit("hook:" + hook);
  }
  popTarget();
}
