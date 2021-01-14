## vue 源码对应文件功能作用分析

---

##### 1. vue\src\platforms\web\runtime\index.js

作用

- 定义`$mount`方法：`Vue.prototype.$mount=function(){}`
- 内部依赖执行`mountComponent()`
  - 文件位置：vue\src\core\instance\lifecycle.js
  - 作用：
    `const vnode = vm._render();`执行`vm._render()`，根据 render 返回 vnode
    `vm._update(vnode, hydrating);`执行`vm_update()`,根据 vnode 渲染真实 dom

##### 2. vue\src\platforms\web\entry-runtime-with-compiler.js

作用

- 重写`$mount`
- 重写原因：运行时定义`Vue.prototype.$mount`不包含编译器

```
Vue.prototype.$mount = function () {}
```
