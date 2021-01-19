### 关于 vue 中\_render()的分析

---

1.定义位置：vue\src\core\instance\render.js 2.注册位置：vue\src\core\instance\index.js 3.作用：执行 compile 生成的 render 函数，然后得到返回的 vnode 节点

```
renderMixin(Vue)
```

---

源码如下

```
Vue.prototype._render = function (): VNode {
    // 获取实例自身
    const vm: Component = this
    // 获取render,_parentVnode
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
      // render函数执行，绑定模板对应的实例上下文对象
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          // render函数执行，绑定模板对应的实例上下文对象
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
```

源码重点分析

- 1.通过 vm.$options 获取 render 函数

```
const { render, _parentVnode } = vm.$options
```

- 2.执行 render 函数并绑定模板对应的实例上下文对象
  - 说明：自动绑定模板对应的实例上下文对象，使得在模板内正确访问实例数据和方法

```
vnode = render.call(vm._renderProxy, vm.$createElement)
```

- 3.render 函数两个参数：vm.\_renderProxy 和 vm.$createElement

  - ##### vm.\_renderProxy 是什么？
  - 定义：见 vue\src\core\instance\init.js 之中 initMixin

  ```
   if (process.env.NODE_ENV !== 'production') {
     initProxy(vm)
   } else {
     vm._renderProxy = vm
   }
  ```

  - 作用：
    生产环境代表实例自身
    开发环境通过判断浏览器 proxy 环境支持，对 vm 实例属性读取进行代理拦截，开发者错误调用 vm 属性时提供错误信息

  - ##### $createElement
    定义：vue\src\core\instance\render.js 之中 initRender

  ```
   // 通过template编译的情况下调用
   vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
   // 手写render函数情况下调用
   vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  ```

  注册：vue\src\core\instance\init.js

  ```
   initRender(vm)
  ```
