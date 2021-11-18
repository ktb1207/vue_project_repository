### 关于 createApp 流程

##### 1.createApp 定义位置

- packages\runtime-dom\src\index.ts

```js
export const createApp = ((...args) => {
  // ensureRenderer() 返回 render,hydrate,createApp三个方法
  const app = ensureRenderer().createApp(...args)
  // 省略其他代码
  return app
}) as CreateAppFunction<Element>
```

##### 2.ensureRenderer 方法定义

- packages\runtime-dom\src\index.ts

```js
function ensureRenderer() {
  // 调用createRenderer方法创建render,传入rendererOptions（平台相关dom操作方法的封装）
  // 那为什么要在runtime-dom中传入，runtime-core拆解??
  // 是因为在Vue3中runtime-core和runtime-dom的拆分，runtime-core不应该关心实际的操作
  // 这样当新平台要接入时（比如weex）就可以只实现属于自己平台的nodeOps
  // 返回 render,hydrate, createApp: createAppAPI(render, hydrate)
  return (
    renderer || ((renderer = createRenderer < Node), Element > rendererOptions)
  )
}
```

##### 3.createRenderer 方法定义

- packages\runtime-core\src\renderer.ts

```js
/**
 * @describe {options} 平台dom操作相关方法
 * 
*/
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  // 依赖baseCreateRenderer
  // options参数，接受平台相关dom方法
  return baseCreateRenderer<HostNode, HostElement>(options)
}
```

##### 4.baseCreateRenderer 方法定义

- packages\runtime-core\src\renderer.ts
- 作用：
  - 1.定义处理相关 dom diff 相关方法
  - 2.返回 render, hydrate, createApp: createAppAPI(render, hydrate)方法

```js
/**
 * @describe {options} 平台dom操作相关方法
 * 
*/
function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

##### 5.createAppAPI 方法定义

- packages\runtime-core\src\apiCreateApp.ts

- 作用：
  - 1. 声明创建 appContext 对象
  - 2. 生命创建并初始化 保存已注册plugin为 Set()结构类型
  - 3.  定义 app 实例方法 use, mixin, component, directive, mount, unmount, provide
  - 2.  返回 app 实例，支持链式调用

```js
/**
 * @describe {render} vnode-dom
 * @describe {rootComponent} createApp(App) 传入App参数
 * 
*/
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
        if (installedPlugins.has(plugin)) {
          // plugin 注册不能重复
          __DEV__ && warn(`Plugin has already been applied to target app.`)
        } else if (plugin && isFunction(plugin.install)) {
          // plugin是一个对象，对象包含有install:function
          installedPlugins.add(plugin)
          plugin.install(app, ...options)
        } else if (isFunction(plugin)) {
          // plugin 是一个function
          installedPlugins.add(plugin)
          plugin(app, ...options)
        } else if (__DEV__) {
          warn(
            `A plugin must either be a function or an object with an "install" ` +
              `function.`
          )
        }
        return app
      },
      // 注册实例方法app.mixin
      mixin(mixin: ComponentOptions) {
        // mixin只能用于options api
        if (__FEATURE_OPTIONS_API__) {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin)
            // global mixin with props/emits de-optimizes props/emits
            // normalization caching.
            if (mixin.props || mixin.emits) {
              context.deopt = true
            }
          } else if (__DEV__) {
            warn(
              'Mixin has already been applied to target app' +
                (mixin.name ? `: ${mixin.name}` : '')
            )
          }
        } else if (__DEV__) {
          warn('Mixins are only available in builds supporting Options API')
        }
        return app
      },
      // 注册实例方法app.component
      component(name: string, component?: Component): any {
        if (__DEV__) {
          // 验证组件name,不能用html标签作为组件名称
          validateComponentName(name, context.config)
        }
        // component 不能重复注册
        if (!component) {
          return context.components[name]
        }
        if (__DEV__ && context.components[name]) {
          warn(`Component "${name}" has already been registered in target app.`)
        }
        context.components[name] = component
        return app
      },
      // 注册实例方法 app.directive
      directive(name: string, directive?: Directive) {
        if (__DEV__) {
          validateDirectiveName(name)
        }

        if (!directive) {
          return context.directives[name] as any
        }
        if (__DEV__ && context.directives[name]) {
          warn(`Directive "${name}" has already been registered in target app.`)
        }
        context.directives[name] = directive
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

      unmount() {
        if (isMounted) {
          render(null, app._container)
          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsUnmountApp(app)
          }
          delete app._container.__vue_app__
        } else if (__DEV__) {
          warn(`Cannot unmount an app that is not mounted.`)
        }
      },

      provide(key, value) {
        if (__DEV__ && (key as string | symbol) in context.provides) {
          warn(
            `App already provides property with key "${String(key)}". ` +
              `It will be overwritten with the new value.`
          )
        }
        // TypeScript doesn't allow symbols as index type
        // https://github.com/Microsoft/TypeScript/issues/24587
        context.provides[key as string] = value

        return app
      }
    })

    if (__COMPAT__) {
      installAppCompatProperties(app, context, render)
    }
    // 返回app实例
    return app
  }
}
```

##### 7.mount('#app') 流程

mount方法定义

- packages\runtime-dom\src\index.ts
- 作用：
   + 1.获取保存app对象mount方法
   + 2.重新定义mount方法
   + 3.获取挂载元素
   + 4.调用之前保存mount方法进行挂载

```js
  // 保存app实例mount方法
  const { mount } = app
  // 重写实例的mount方法；
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // 调用normalizeContainer获取根元素容器
    const container = normalizeContainer(containerOrSelector)
    if (!container) return

    const component = app._component
    // 渲染优先级：render > template > container.innerHTML
    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML
      // 2.x compat check
      if (__COMPAT__ && __DEV__) {
        for (let i = 0; i < container.attributes.length; i++) {
          const attr = container.attributes[i]
          if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
            compatUtils.warnDeprecation(
              DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
              null
            )
            break
          }
        }
      }
    }

    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container, false, container instanceof SVGElement)
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      // 挂载容器添加app属性标识
      container.setAttribute('data-v-app', '')
    }
    return proxy
  }
```

##### 8.app.mount方法定义

- packages\runtime-core\src\apiCreateApp.ts
- 作用：
   + 1.方法定义位于createAppAPI方法内部，其内部创建app对象，并添加use,mixin,component,directive,mount,unmount,provide
   + 2.mount
   + 3.调用createVNode方法获取vnode
   + 4.vnode.appContext = context,往vnode追加appContext对象
   + 5.调用render依据vnode创建真实dom
   + 6.app._container = rootContainer保存挂载父元素标识

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

      provide(key, value) {}
    })
    // 返回app实例
    return app
  }
}
```

##### 9.render方法分析

定义：
- packages\runtime-core\src\renderer.ts

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

##### 10.patch方法定义

定义：
- packages\runtime-core\src\renderer.ts

```js
const patch: PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    isSVG = false,
    slotScopeIds = null,
    optimized = false
  ) => {
    // patching & not same type, unmount old tree
    // 旧节点与新节点类型不一致，卸载旧节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1)
      unmount(n1, parentComponent, parentSuspense, true)
      n1 = null
    }
    // PatchFlag 是 BAIL 类型，则跳出优化模式
    if (n2.patchFlag === PatchFlags.BAIL) {
      optimized = false
      n2.dynamicChildren = null
    }

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

    // set ref
    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2)
    }
  }
  const processText = () => {}
  const processCommentNode = () => {}
  const mountStaticNode = () => {}
  const patchStaticNode = () => {}
  const moveStaticNode = () => {}
  const processElement = () => {}
  const mountElement = () => {}
  const setScopeId = () => {}
  const mountChildren = () => {}
  const patchElement = () => {}
  const patchBlockChildren = () => {}
  const patchProps = () => {}
  const processFragment = () => {}
  const processComponent = () => {}
  const mountComponent = () => {}
  const updateComponent = () => {}

  const setupRenderEffect = () => {}
  const updateComponentPreRender = () => {}
  const patchChildren = () => {}
  const patchUnkeyedChildren = () => {}
  const patchKeyedChildren = () => {}
  const move = () => {}

  const unmount = () => {}
  const remove = () => {}
  const removeFragment = () => {}
  const unmountComponent = () => {}
  const unmountChildren = () => {}
  const getNextHostNode = () => {}
  const render = () => {}

  const internals = () => {}
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

