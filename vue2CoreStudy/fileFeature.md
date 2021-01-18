## vue 源码对应文件功能作用分析

---

##### 1. vue\src\platforms\web\runtime\index.js

作用

- 1.定义`$mount`方法：`Vue.prototype.$mount=function(){}`
- 内部依赖执行`mountComponent()`
  - 文件位置：vue\src\core\instance\lifecycle.js
  - 作用：
    `const vnode = vm._render();`执行`vm._render()`，根据 render 返回 vnode
    `vm._update(vnode, hydrating);`执行`vm_update()`,根据 vnode 渲染真实 dom
- 2.挂载原型方法 _patch_：`Vue.prototype.__patch__ = inBrowser ? patch : noop;`

##### 2. vue\src\platforms\web\entry-runtime-with-compiler.js

作用

- 重写`$mount`: `Vue.prototype.$mount = function () {}`
- 重写原因：运行时定义`Vue.prototype.$mount`不包含编译器
- 内部执行：依据优先级render>template>el
`options.render`不存在，依据template和el调用`compileToFunctions`创建render函数
`options.render`存在，直接调用运行版本的 `$mount` 函数

##### 3. vue\src\core\instance\index.js

作用
- 1.定义Vue构造函数
```
function Vue(options) {
  this._init(options);
}
```
- 2.实例方法的初始化
```
initMixin(Vue); // 混入_init()
stateMixin(Vue); // 实现$set/$delete/$watch方法
eventsMixin(Vue); // 实现$emit/$on/$off/$once四个方法
lifecycleMixin(Vue); // 实现_update/$forceUpdate/$destory三个方法
renderMixin(Vue); // 实现_render/$nextTick方法
```
