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
- 内部执行：依据优先级 render>template>el
  `options.render`不存在，依据 template 和 el 调用`compileToFunctions`创建 render 函数
  `options.render`存在，直接调用运行版本的 `$mount` 函数

##### 3. vue\src\core\instance\index.js

作用

- 1.定义 Vue 构造函数

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

##### 4. vue\src\core\instance\init.js

作用

- 1.定义原型方法`_init`，`Vue.prototype._init = function(){}`;
- vm 属性定义：`vm._isVue = true`,`vm._self = vm`
- 2.`initLifecycle(vm)`:生命周期相关变量初始化,
  `vm.$parent,vm.$children,vm.$root,$refs,vm._isMounted,vm._isDestroyed,vm._isBeingDestroyed`
- 3.`initEvents(vm)`: 事件监听初始化；
- 4.`initRender(vm)`: vm 的编译 render 初始化;
- 5.`callHook(vm, 'beforeCreate')`: beforeCreate 生命钩子的回调;
- 6.`initInjections(vm)`: 把 inject 的成员注入到 vm 上;
- 7.`initState(vm)`: 初始化 vm 的 \_props/methods/\_data/computed/watch;
- 8.`initProvide(vm)`: 初始化 provide
- 9.`callHook(vm, 'created')`: created 生命钩子的回调

##### 5. vue\src\core\instance\state.js

作用

- 1.定义原型方法`$set`,`Vue.prototype.$set = set`;
- 2.定义原型方法`$delete`,` Vue.prototype.$delete = del`;
- 3.定义原型方法`$watch`,`Vue.prototype.$watch = function(){}`;

##### 6. vue\src\core\instance\events.js

作用
-1.定义`$on`,`Vue.prototype.$on= function(){}`;
-1.定义`$oncs`,`Vue.prototype.$oncs= function(){}`;
-1.定义`$off`,`Vue.prototype.$off= function(){}`;
-1.定义`$emit`,`Vue.prototype.$emit= function(){}`;

##### 7. vue\src\core\instance\lifecycle.js

作用

- 1.定义`_update`,`Vue.prototype._update = function(){}`;
- 2.定义`$forceUpdate`,`Vue.prototype.$forceUpdate = function(){}`;
- 2.定义`$destroy`,`Vue.prototype.$destroy = function(){}`;

##### 8. vue\src\core\instance\render.js

作用

- 1.定义`$nextTick`,`Vue.prototype.$nextTick = function(){}`;
- 2.定义`_render`,`Vue.prototype._render = function (){}`;
  - 执行 createElement 方法并返回 vnode
