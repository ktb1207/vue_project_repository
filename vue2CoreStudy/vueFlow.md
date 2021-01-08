简要分析在引入 vue.js 后，vue 框架做的初始化工作流程分析；
vue 框架做的初始化工作包括：创建 vue 类，并往 Vue 类上添加类属性，类方法，实例属性，实例方法；

### new Vue()初始化流程分析：

---

##### 1.new Vue()

- 实例化创建

##### 2. init()

- 首先在 new Vue 之后，对生命周期、事件中心、data、props 等进行了初始化。

##### 3. $mount

- 调用$mount函数对$el 节点进行渲染

##### 4. compile

- 渲染的过程中，Vue 只认 render 函数，那么就会先将 template 转换为 render 函数(mountComponent 函数的功能)

##### 5. render

- 调用 render 函数生成 vnode
- 怎么生成？主要是利用 createELement 函数，先将 vnode 的 children 处理为一维数组，然后通过判断 tag 来生成 vnode。

##### 6. vnode

- 生成 vnode 之后，就是通过 patch 函数转换为 dom 节点，渲染在视图上

##### 7.patch

- 将 vnode 进行新旧 vnode 对比（diff）,

##### 8.dom

- patch 之后得到最新 vnode，调用\_update 方法生成真实 dom 并渲染浏览器视图

### 文件流程分析

---

##### 1. 入口文件：platforms/web/entry-runtime-with-compiler.js

- 引入 platforms/web/runtime/index.js 得到 Vue 类
- 缓存 Vue 的原型链上添加$mount 方法，并重写该方法

##### 2. platforms/web/runtime/index.js

- 引入 core/index.js 得到 Vue 类
- 往 Vue 类的 config 属性上添加 mustUseProp，isReservedTag，isReservedAttr，getTagNamespace，isUnknownElement
- 扩展 Vue 类 options 属性的 directives，components
- 给 Vue 类添加实例方法**patch**，$mount

##### 3. core/index.js

- 引入 core/instance/index.js 得到 Vue 类
- 为 Vue 类添加添加全局 API
- 设置 Vue 实例属性 isServer，isServer，ssrContext
- 设置 Vue 类属性 FunctionalRenderContext
- 添加 Vue 类的版本号

##### 4. core/instance/index.js

- 声明 Vue 类
- 将 Vue 类传入各种初始化方法 initMixin，stateMixin，eventsMixin，lifecycleMixin，renderMixin
