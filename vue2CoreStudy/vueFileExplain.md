## vue 源码对应文件功能作用分析

---

##### 1. vue\src\platforms\web\runtime\index.js
依赖：【3】

作用:

- 1.注册平台特性方法
```
Vue.config.mustUseProp = mustUseProp; // 表单组件 input,textarea,option,select,progress
Vue.config.isReservedTag = isReservedTag; // html元素或者svg元素
Vue.config.isReservedAttr = isReservedAttr; // style class属性
Vue.config.getTagNamespace = getTagNamespace; // svg / math
Vue.config.isUnknownElement = isUnknownElement; // 是否是未知的html元素，
```
- 2.浏览器平台注册directives和components
```
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);
```
- 3.定义`$mount`方法：`Vue.prototype.$mount=function(){}`
- 内部依赖执行`mountComponent()`
  - 文件位置：vue\src\core\instance\lifecycle.js
  - 作用：
    `const vnode = vm._render();`执行`vm._render()`，根据 render 返回 vnode
    `vm._update(vnode, hydrating);`执行`vm_update()`,根据 vnode 渲染真实 dom
- 4.挂载原型方法 _patch_：`Vue.prototype.__patch__ = inBrowser ? patch : noop;`

##### 2. vue\src\platforms\web\entry-runtime-with-compiler.js
依赖：【1】
作用:

- 重写`$mount`: `Vue.prototype.$mount = function () {}`
- 重写原因：运行时定义`Vue.prototype.$mount`不包含编译器
- 内部执行：依据优先级 render>template>el
  `options.render`不存在，依据 template 和 el 调用`compileToFunctions`创建 render 函数
  `options.render`存在，直接调用运行版本的 `$mount` 函数

##### 3.vue\src\core\index.js
依赖：【4】
作用:
- 1.初始化全局qpi:`initGlobalAPI(Vue)`;
- 2.添加vue版本信息:`Vue.version = "__VERSION__"`

重点说明：`initGlobalAPI(Vue)`
- 1.注册内部辅助函数
```
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };
```
- 2.Vue实例添加set,delete,nextTick方法
```
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;
```
- 3.初始化Vue.options属性为空对象
```
Vue.options = Object.create(null);
```

- 4.扩展options.components属性，加入内建组件
```
extend(Vue.options.components, builtInComponents);
```

- 5.初始化Vue.use()方法:`initUse(Vue)`;
- 6.初始化Vue.mixin()方法：`initMixin(Vue)`，其实质通过执行mergeOptions:`this.options = mergeOptions(this.options, mixin)`;
- 7.初始化Vue.extend()方法：`initExtend(Vue)`;


##### 4. vue\src\core\instance\index.js
依赖：【5，6，7，8，9】
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

##### 5. vue\src\core\instance\init.js

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

##### 6. vue\src\core\instance\state.js

作用

- 1.定义原型方法`$set`,`Vue.prototype.$set = set`;
- 2.定义原型方法`$delete`,` Vue.prototype.$delete = del`;
- 3.定义原型方法`$watch`,`Vue.prototype.$watch = function(){}`;

##### 7. vue\src\core\instance\events.js

作用
-1.定义`$on`,`Vue.prototype.$on= function(){}`;
-1.定义`$oncs`,`Vue.prototype.$oncs= function(){}`;
-1.定义`$off`,`Vue.prototype.$off= function(){}`;
-1.定义`$emit`,`Vue.prototype.$emit= function(){}`;

##### 8. vue\src\core\instance\lifecycle.js

作用

- 1.定义`_update`,`Vue.prototype._update = function(){}`;
- 2.定义`$forceUpdate`,`Vue.prototype.$forceUpdate = function(){}`;
- 2.定义`$destroy`,`Vue.prototype.$destroy = function(){}`;

##### 9. vue\src\core\instance\render.js

作用

- 1.定义`$nextTick`,`Vue.prototype.$nextTick = function(){}`;
- 2.定义`_render`,`Vue.prototype._render = function (){}`;
  - 执行 createElement 方法并返回 vnode
