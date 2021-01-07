## vue 总结概括

### 1. Vue 的响应式系统概括

什么是数据响应式？
数据变化可侦测，和数据相关的内容可以更新。

---

- Vue 为 MVVM 框架，当数据模型 data 变化时，页面视图会得到响应更新，其原理对 data 的 getter/setter 方法进行拦截（Object.defineProperty 或者 Proxy），利用发布订阅的设计模式，在 getter 方法中进行订阅，在 setter 方法中发布通知，让所有订阅者完成响应。
- 在响应式系统中，Vue 会为数据模型 data 的每一个属性新建一个订阅中心作为发布者，而监听器 watch、计算属性 computed、视图渲染 template/render 三个角色同时作为订阅者
- 对于监听器 watch，会直接订阅观察监听的属性，对于计算属性 computed 和视图渲染 template/render，如果内部执行获取了 data 的某个属性，就会执行该属性的 getter 方法，然后自动完成对该属性的订阅，当属性被修改时，就会执行该属性的 setter 方法，从而完成该属性的发布通知，通知所有订阅者进行更新。

### 2. computed 与 watch 的区别

---

- 计算属性 computed 和监听器 watch 都可以观察属性的变化从而做出响应，不同的是：
- 计算属性 computed 更多是作为缓存功能的观察者，它可以将一个或者多个 data 的属性进行复杂的计算生成一个新的值，提供给渲染函数使用，当依赖的属性变化时,computed 不会立即重新计算生成新的值，而是先标记为脏数据，当下次 computed 被获取时候，才会进行重新计算并返回。
- 而监听器 watch 并不具备缓存性，监听器 watch 提供一个监听函数，当监听的属性发生变化时，会立即执行该函数。

### 3. 介绍一下 Vue 的生命周期

---

- beforeCreate：
  是 new Vue()之后触发的第一个钩子，在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问。
- created：
  在实例创建完成后发生，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发 updated 函数。可以做一些初始数据的获取，在当前阶段无法与 Dom 进行交互，如果非要想，可以通过 vm.$nextTick 来访问 Dom。
- beforeMount：
  发生在挂载之前，在这之前 template 模板已导入渲染函数编译。而当前阶段虚拟 Dom 已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发 updated。
- mounted：
  在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点，使用$refs 属性对 Dom 进行操作。
- beforeUpdate：
  发生在更新之前，也就是响应式数据发生更新，虚拟 dom 重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染。
- updated：
  发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。
- beforeDestroy：
  发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。
- destroyed：
  发生在实例销毁之后，这个时候只剩下了 dom 空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。

### 4. 为什么组件的 data 必须是一个函数

---

一个组件可能在很多地方使用，也就是会创建很多个实例，如果 data 是一个对象的话，对象是引用类型，一个实例修改了 data 会影响到其他实例，所以 data 必须使用函数，为每一个实例创建一个属于自己的 data，使其同一个组件的不同实例互不影响。

### 5. 组件之间是怎么通信的

---

- 父子组件通信：
  父组件 -> 子组件：prop
  子组件 -> 父组件：$on/$emit
  获取组件实例：使用$parent/$children，$refs.xxx，获取到实例后直接获取属性数据或调用组件方法
- 兄弟组件通信：
  Event Bus：每一个 Vue 实例都是一个 Event Bus，都支持$on/$emit，可以为兄弟组件的实例之间 new 一个 Vue 实例，作为 Event Bus 进行通信。
- 跨级组件通信
  使用 provide/inject
  Event Bus：同兄弟组件 Event Bus 通信
  Vuex：将状态和方法提取到 Vuex，完成共享

### 6.Vue 事件绑定原理

---

每一个 Vue 实例都是一个 Event Bus，当子组件被创建的时候，父组件将事件传递给子组件，子组件初始化的时候是有$on方法将事件注册到内部，在需要的时候使用$emit 触发函数，而对于原生 native 事件，使用 addEventListener 绑定到真实的 DOM 元素上。

### 7. slot 是什么？有什么作用？原理是什么？

---

slot 又名插槽，是 Vue 的内容分发机制，组件内部的模板引擎使用 slot 元素作为承载分发内容的出口。插槽 slot 是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。

slot 又分三类，默认插槽，具名插槽和作用域插槽。

- 默认插槽：又名匿名查抄，当 slot 没有指定 name 属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。
- 具名插槽：带有具体名字的插槽，也就是带有 name 属性的 slot，一个组件可以出现多个具名插槽。
- 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。
- 实现原理：
  当子组件 vm 实例化时，获取到父组件传入的 slot 标签的内容，存放在 vm.$slot中，默认插槽为vm.$slot.default，具名插槽为 vm.$slot.xxx，xxx 为插槽名，当组件执行渲染函数时候，遇到slot标签，使用$slot 中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

### 8. Vue 模板渲染的原理是什么？

---

vue 中的模板 template 无法被浏览器解析并渲染，因为这不属于浏览器的标准，不是正确的 HTML 语法，所以需要将 template 转化成一个 JavaScript 函数，这样浏览器就可以执行这一个函数并渲染出对应的 HTML 元素，就可以让视图跑起来了，这一个转化的过程，就成为模板编译。

模板编译又分三个阶段，解析 parse，优化 optimize，生成 generate，最终生成可执行函数 render。

- parse 阶段：使用大量的正则表达式对 template 字符串进行解析，将标签、指令、属性等转化为抽象语法树 AST。
- optimize 阶段：遍历 AST，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行 diff 比较时，直接跳过这一些静态节点，优化 runtime 的性能。
- generate 阶段：将最终的 AST 转化为 render 函数字符串。

### 9. template 预编译是什么？

---

对于 Vue 组件来说，模板编译只会在组件实例化的时候编译一次，生成渲染函数之后在也不会进行编译。因此，编译对组件的 runtime 是一种性能损耗。

而模板编译的目的仅仅是将 template 转化为 render function，这个过程，正好可以在项目构建的过程中完成，这样可以让实际组件在 runtime 时直接跳过模板渲染，进而提升性能，这个在项目构建的编译 template 的过程，就是预编译。

### 10. 那 template 和 jsx 的有什么分别？

对于 runtime 来说，只需要保证组件存在 render 函数即可，而我们有了预编译之后，我们只需要保证构建过程中生成 render 函数就可以。

在 webpack 中，我们使用 vue-loader 编译.vue 文件，内部依赖的 vue-template-compiler 模块，在 webpack 构建过程中，将 template 预编译成 render 函数。

与 react 类似，在添加了 jsx 的语法糖解析器 babel-plugin-transform-vue-jsx 之后，就可以直接手写 render 函数。

所以，template 和 jsx 的都是 render 的一种表现形式，不同的是：

JSX 相对于 template 而言，具有更高的灵活性，在复杂的组件中，更具有优势，而 template 虽然显得有些呆滞。但是 template 在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。

### 11. 说一下什么是 Virtual DOM？

---

Virtual DOM 是 DOM 节点在 JavaScript 中的一种抽象数据结构，之所以需要虚拟 DOM，是因为浏览器中操作 DOM 的代价比较昂贵，频繁操作 DOM 会产生性能问题。虚拟 DOM 的作用是在每一次响应式数据发生变化引起页面重渲染时，Vue 对比更新前后的虚拟 DOM，匹配找出尽可能少的需要更新的真实 DOM，从而达到提升性能的目的。

### 12. 介绍一下 Vue 中的 Diff 算法

---

在新老虚拟 DOM 对比时：

- 首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
- 如果为相同节点，进行 patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的 children 没有子节点，将旧的子节点移除)
- 比较如果都有子节点，则进行 updateChildren，判断如何对这些新老节点的子节点进行操作（diff 核心）。
- 匹配时，找到相同的子节点，递归比较子节点

在 diff 中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从 O(n^3)降低值 O(n)，也就是说，只有当新旧 children 都为多个子节点时才需要用核心的 Diff 算法进行同层级比较。

### 13. key 属性的作用是什么？

---

在对节点进行 diff 的过程中，判断是否为相同节点的一个很重要的条件是 key 是否相等，如果是相同节点，则会尽可能的复用原有的 DOM 节点。所以 key 属性是提供给框架在 diff 的时候使用的，而非开发者。

### 14. 说说 Vue2.0 和 Vue3.0 有什么区别？

vue2:
1.vue2 需要遍历对象所有 key，这会影响初始化速度。
2.vue2 对于数组要做特殊处理，修改数据时也不能使⽤索引和长度。
3.vue2 中动态添加或删除对象属性需要使⽤额外 API：Vue.set()/delete()

vue3:
vue3 中利⽤ Proxy 可以很好的解决以上的问题

---

1. 重构响应式系统：
   - 使用 Proxy 替换 Object.defineProperty，使用 Proxy 优势：
   - 可直接监听数组类型的数据变化,不需要重写数组操作方法；
   - 监听的目标为对象本身，不需要像 Object.defineProperty 一样遍历每个属性，有一定的性能提升
   - 可拦截 apply、ownKeys、has 等 13 种方法，而 Object.defineProperty 不行
   - 直接实现对象属性的新增/删除
2. 新增 Composition API，更好的逻辑复用和代码组织
3. 重构 Virtual DOM
   - 模板编译时的优化，将一些静态节点编译成常量
   - slot 优化，将 slot 编译为 lazy 函数，将 slot 的渲染的决定权交给子组件
   - 模板中内联事件的提取并重用
4. 代码结构调整，更便于 Tree shaking，使得体积更小
5. 使用 Typescript 替换 Flow

### 15. 为什么要新增 Composition API，它能解决什么问题？

---

Vue2.0 中，随着功能的增加，组件变得越来越复杂，越来越难维护，而难以维护的根本原因是 Vue 的 API 设计迫使开发者使用 watch，computed，methods 选项组织代码，而不是实际的业务逻辑。

另外 Vue2.0 缺少一种较为简洁的低成本的机制来完成逻辑复用，虽然可以 minxis 完成逻辑复用，但是当 mixin 变多的时候，会使得难以找到对应的 data、computed 或者 method 来源于哪个 mixin，使得类型推断难以进行。

所以 Composition API 的出现，主要是也是为了解决 Option API 带来的问题

第一个是代码组织问题，Compostion API 可以让开发者根据业务逻辑组织自己的代码，让代码具备更好的可读性和可扩展性，也就是说当下一个开发者接触这一段不是他自己写的代码时，他可以更好的利用代码的组织反推出实际的业务逻辑，或者根据业务逻辑更好的理解代码。

第二个是实现代码的逻辑提取与复用，当然 mixin 也可以实现逻辑提取与复用，但是像前面所说的，多个 mixin 作用在同一个组件时，很难看出 property 是来源于哪个 mixin，来源不清楚，另外，多个 mixin 的 property 存在变量命名冲突的风险。而 Composition API 刚好解决了这两个问题。

### 16. 都说 Composition API 与 React Hook 很像，说说区别

---

从 React Hook 的实现角度看，React Hook 是根据 useState 调用的顺序来确定下一次重渲染时的 state 是来源于哪个 useState，所以出现了以下限制

- 不能在循环、条件、嵌套函数中调用 Hook
- 必须确保总是在你的 React 函数的顶层调用 Hook
- useEffect、useMemo 等函数必须手动确定依赖关系

而 Composition API 是基于 Vue 的响应式系统实现的，与 React Hook 的相比：

- 声明在 setup 函数内，一次组件实例化只调用一次 setup，而 React Hook 每次重渲染都需要调用 Hook，使得 React 的 GC 比 Vue 更有压力，性能也相对于 Vue 来说也较慢
- Compositon API 的调用不需要顾虑调用顺序，也可以在循环、条件、嵌套函数中使用
- 响应式系统自动实现了依赖收集，进而组件的部分的性能优化由 Vue 内部自己完成，而 React Hook 需要手动传入依赖，而且必须必须保证依赖的顺序，让 useEffect、useMemo 等函数正确的捕获依赖变量，否则会由于依赖不正确使得组件性能下降。

虽然 Compositon API 看起来比 React Hook 好用，但是其设计思想也是借鉴 React Hook 的。

### 17. SSR 有了解吗？原理是什么？

---

在客户端请求服务器的时候，服务器到数据库中获取到相关的数据，并且在服务器内部将 Vue 组件渲染成 HTML，并且将数据、HTML 一并返回给客户端，这个在服务器将数据和组件转化为 HTML 的过程，叫做服务端渲染 SSR。

而当客户端拿到服务器渲染的 HTML 和数据之后，由于数据已经有了，客户端不需要再一次请求数据，而只需要将数据同步到组件或者 Vuex 内部即可。除了数据意外，HTML 也结构已经有了，客户端在渲染组件的时候，也只需要将 HTML 的 DOM 节点映射到 Virtual DOM 即可，不需要重新创建 DOM 节点，这个将数据和 HTML 同步的过程，又叫做客户端激活。

使用 SSR 的好处：

- 有利于 SEO：其实就是有利于爬虫来爬你的页面，因为部分页面爬虫是不支持执行 JavaScript 的，这种不支持执行 JavaScript 的爬虫抓取到的非 SSR 的页面会是一个空的 HTML 页面，而有了 SSR 以后，这些爬虫就可以获取到完整的 HTML 结构的数据，进而收录到搜索引擎中。
- 白屏时间更短：相对于客户端渲染，服务端渲染在浏览器请求 URL 之后已经得到了一个带有数据的 HTML 文本，浏览器只需要解析 HTML，直接构建 DOM 树就可以。而客户端渲染，需要先得到一个空的 HTML 页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。