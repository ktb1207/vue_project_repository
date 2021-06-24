### 04关于mount流程分析
---
[一、mount开始调用]()

> 调用位置

```js
createApp(App).mount("#app")
```

[二、mount方法定义]()

> 定义位置

- 文件位置：packages\runtime-core\src\apiCreateApp.ts

```js
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject(rootProps)) {
      __DEV__ && warn(`root props passed to app.mount() must be an object.`)
      rootProps = null
    }
    // appContext对象
    const context = createAppContext()
    // 保存当前注册plugin
    const installedPlugins = new Set()
    // 当前未挂载标识
    let isMounted = false

    const app: App = (context.app = {
      _uid: uid++,
      _component: rootComponent as ConcreteComponent,
      _props: rootProps,
      _container: null,
      _context: context,

      version,

      get config() {
        return context.config
      },

      set config(v) {
        if (__DEV__) {
          warn(
            `app.config cannot be replaced. Modify individual options instead.`
          )
        }
      },
      // 注册实例方法，app.use(plugin)
      use(plugin: Plugin, ...options: any[]) {
        return app
      },
      // 注册实例方法app.mixin
      mixin(mixin: ComponentOptions) {
        return app
      },
      // 注册实例方法app.component
      component(name: string, component?: Component): any {
        return app
      },
      // 注册实例方法 app.directive
      directive(name: string, directive?: Directive) {
        return app
      },
      // 注册app.mount()方法
      mount(
        rootContainer: HostElement,
        isHydrate?: boolean,
        isSVG?: boolean
      ): any {
        if (!isMounted) {
          // 获取vnode
          const vnode = createVNode(
            rootComponent as ConcreteComponent,
            rootProps
          )
          // store app context on the root VNode.
          // this will be set on the root instance on initial mount.
          vnode.appContext = context

          // HMR root reload
          if (__DEV__) {
            context.reload = () => {
              render(cloneVNode(vnode), rootContainer, isSVG)
            }
          }

          if (isHydrate && hydrate) {
            hydrate(vnode as VNode<Node, Element>, rootContainer as any)
          } else {
            // vnode渲染真实dom
            render(vnode, rootContainer, isSVG)
          }
          // 挂载标志位
          isMounted = true
          app._container = rootContainer
          // for devtools and telemetry
          ;(rootContainer as any).__vue_app__ = app

          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsInitApp(app, version)
          }

          return vnode.component!.proxy
        } else if (__DEV__) {
          warn(
            `App has already been mounted.\n` +
              `If you want to remount the same app, move your app creation logic ` +
              `into a factory function and create fresh app instances for each ` +
              `mount - e.g. \`const createMyApp = () => createApp(App)\``
          )
        }
      },
      unmount() {},
      provide(key, value) {
        return app
      }
    })
    // 返回app实例
    return app
  }
}
```
> 分析
- createAppAPI()方法接受render方法作为参数
- 声明app对象，mount作为app对象的方法
- mount方法首先调用createVNode方法获取最新vnode
- 给vnode添加vnode.appContext = context
- 调用render将vnode创建真实dom
- 修改挂载标识isMounted = true
- 保存挂载宿主容器app._container = rootContainer

[三、render方法]()

> 定义
- 位置：packages\runtime-core\src\renderer.ts

```js
  const render: RootRenderFunction = (vnode, container, isSVG) => {
    if (vnode == null) {
      // new vnode null
      if (container._vnode) {
        // old vnode存在，卸载
        unmount(container._vnode, null, null, true)
      }
    } else {
      // old vnode new vonde patch
      patch(container._vnode || null, vnode, container, null, null, null, isSVG)
    }
    flushPostFlushCbs()
    // 保存vnode
    container._vnode = vnode
  }
```

> 分析

- 首先,判断vnode== null情况， 如果当前新vnode为null,container._vnode存在情况下，则卸载旧vnode
- 其次，当新旧vnode都存在情况下，调用patch方法进行新旧vnode diff

[四、patch方法]()

> 定义
- 位置：packages\runtime-core\src\renderer.ts

```js
  const patch: PatchFn = (
    n1, // 旧vnode节点
    n2, // 新vnode
    container, // 宿主容器
    anchor = null, // 是一个锚点，用来标识当我们对新旧节点做增删或移动等操作时，以哪个节点为参照物
    parentComponent = null, // 父组件
    parentSuspense = null, // 父suspense
    isSVG = false, // 是否svg标识
    slotScopeIds = null,
    optimized = false // 是否开启优化标识
  ) => {
    // 旧节点与新节点类型不一致，卸载旧节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1)
      unmount(n1, parentComponent, parentSuspense, true)
      n1 = null
    }
    // PatchFlag == -2，则跳出优化模式
    if (n2.patchFlag === PatchFlags.BAIL) {
      optimized = false
      n2.dynamicChildren = null
    }
    // 获取新vnode对象type,ref, shapeFlag
    const { type, ref, shapeFlag } = n2
    // 根据 Vnode 类型判断
    switch (type) {
      // 文本类型
      case Text:
        processText(n1, n2, container, anchor)
        break
      // 注释
      case Comment:
        processCommentNode(n1, n2, container, anchor)
        break
      // 静态节点类型
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG)
        } else if (__DEV__) {
          patchStaticNode(n1, n2, container, isSVG)
        }
        break
      // Fragment 类型
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
        break
      // 元素类型、组件类型、teleport、supense
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 按位与运算，判断是一个元素类型
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          // 按位与运算，判断是一个组件类型
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (shapeFlag & ShapeFlags.TELEPORT) {
          ;(type as typeof TeleportImpl).process(
            n1 as TeleportVNode,
            n2 as TeleportVNode,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          )
        } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
          ;(type as typeof SuspenseImpl).process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          )
        } else if (__DEV__) {
          warn('Invalid VNode type:', type, `(${typeof type})`)
        }
    }
  }
```

> 分析
- 1.首先判断旧vnode存在情况下，如果新旧vnode不是同一类型，则卸载旧节点
- 2.其次判断n2.patchFlag值，如果不等于0并且等于-2，优化模式表示符号为false
- 3.获取新vnode type，依据type类型判断做出不同处理
   + 3.1 type 为Text类型，processText()处理
   + 3.2 type为Comment注释，processCommentNode()
   + 3.3 type为Static静态类型，如果不存在旧vnode,则直接mountStaticNode创建静态节点挂载
      + 旧节点存在情况下，patchStaticNode()处理
   + 3.4 type为Fragment，processFragment（）
   + 3.5 其余类型，包括--元素类型、组件类型、teleport、supense
      + 元素类型：processElement
      + 组件类型：processComponent
      + teleport
      + supense