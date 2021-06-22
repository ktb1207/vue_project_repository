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
  - 1.  定义 app 实例方法 use, mixin, component, directive, mount, unmount, provide
  - 2.  返回 app 实例，支持链式调用

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

##### 6.mount 方法定义
