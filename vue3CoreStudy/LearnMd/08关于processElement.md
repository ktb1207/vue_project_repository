### 关于 processElement 处理元素类型的分析

---

[一、方法定义]()

```js
const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => {
    isSVG = isSVG || (n2.type as string) === 'svg'
    if (n1 == null) {
      // 旧节点不存在，否则直接挂载新节点
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
    } else {
      // 如果存在旧节点，则继续通过 patch 比较新旧两个节点
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
    }
  }
```

> 解析

- 旧节点不存在，否则直接挂载新节点
- 如果存在旧节点，则继续通过 patch 比较新旧两个节点

[二、mountElement]()

> 方法定义

```js
  const mountElement = (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => {
    let el: RendererElement
    let vnodeHook: VNodeHook | undefined | null
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode
    if (
      !__DEV__ &&
      vnode.el &&
      hostCloneNode !== undefined &&
      patchFlag === PatchFlags.HOISTED
    ) {
      // If a vnode has non-null el, it means it's being reused.
      // Only static vnodes can be reused, so its mounted DOM nodes should be
      // exactly the same, and we can simply do a clone here.
      // only do this in production since cloned trees cannot be HMR updated.
      el = vnode.el = hostCloneNode(vnode.el)
    } else {
      el = vnode.el = hostCreateElement(
        vnode.type as string,
        isSVG,
        props && props.is,
        props
      )

      // mount children first, since some props may rely on child content
      // being already rendered, e.g. `<select value>`
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 元素类型子元素为text类型
        hostSetElementText(el, vnode.children as string)
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 元素类型子元素为数组成员
        mountChildren(
          vnode.children as VNodeArrayChildren,
          el,
          null,
          parentComponent,
          parentSuspense,
          isSVG && type !== 'foreignObject',
          slotScopeIds,
          optimized || !!vnode.dynamicChildren
        )
      }

      if (dirs) {
        // 指令钩子 created
        invokeDirectiveHook(vnode, null, parentComponent, 'created')
      }
      // props
      if (props) {
        for (const key in props) {
          // 如果prop 不是key ref,则patch prop
          if (!isReservedProp(key)) {
            hostPatchProp(
              el,
              key,
              null,
              props[key],
              isSVG,
              vnode.children as VNode[],
              parentComponent,
              parentSuspense,
              unmountChildren
            )
          }
        }
        if ((vnodeHook = props.onVnodeBeforeMount)) {
          // 调用声明周期函数BeforeMount
          invokeVNodeHook(vnodeHook, parentComponent, vnode)
        }
      }
      // scopeId
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent)
    }
    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      // 保存vnode作为旧vnode
      Object.defineProperty(el, '__vnode', {
        value: vnode,
        enumerable: false
      })
      // 保存旧父信息
      Object.defineProperty(el, '__vueParentComponent', {
        value: parentComponent,
        enumerable: false
      })
    }
    if (dirs) {
      // 指令钩子beforeMount
      invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount')
    }
    // #1583 For inside suspense + suspense not resolved case, enter hook should call when suspense resolved
    // #1689 For inside suspense + suspense resolved case, just call it
    const needCallTransitionHooks =
      (!parentSuspense || (parentSuspense && !parentSuspense.pendingBranch)) &&
      transition &&
      !transition.persisted
    if (needCallTransitionHooks) {
      transition!.beforeEnter(el)
    }
    hostInsert(el, container, anchor)
    if (
      (vnodeHook = props && props.onVnodeMounted) ||
      needCallTransitionHooks ||
      dirs
    ) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode)
        needCallTransitionHooks && transition!.enter(el)
        dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted')
      }, parentSuspense)
    }
  }
```

> 解析

- 1. 根据 vnode.el 创建元素标签
- 2. 如果 vnode 子元素为 text 类型，hostSetElementText()创建元素文本内容
- 3. 如果 vnode 子元素类型为数组成员，mountChildren()挂载子元素
- 4. 如果 当前元素存在绑定指令，触发指令钩子 created
- 5. 如果 当前 vnode 元素存在 props,for...in 遍历 props,当 props 不为 key,ref 情况，则 hostPatchProp
- 6. 如果 当前 vnode 声明有 BeforeMount，则调用 BeforeMount 钩子函数
- 7. 保存 \_\_vnode 为当前 node 值，作为再下一个更新中旧 vnode
- 8. 保存 \_\_vueParentComponent 为父元素信息
- 9. 如果 当前元素绑定指令，触发指令钩子 beforeMount
- 10. 触发 vnode 组件声明周期 mounted
- 11. 如果有绑定指令，触发指令生命周期 mounted


[三、patchElement()方法]()

说明，processElement方法内部通过判断n1旧vnode是否存在，存在n1情况下，则调用patchElement方法进行新旧vnode patch

> 方法定义

```js
const patchElement = (
    n1: VNode,
    n2: VNode,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => {
    // 检查节点是否属于不同的标签
    const el = (n2.el = n1.el!)
    let { patchFlag, dynamicChildren, dirs } = n2
    // #1426 take the old vnode's patch flag into account since user may clone a
    // compiler-generated vnode, which de-opts to FULL_PROPS
    patchFlag |= n1.patchFlag & PatchFlags.FULL_PROPS
    // 将新旧节点的 props 声明提取出来，因为之后需要对 props 进行 patch 比较。
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    let vnodeHook: VNodeHook | undefined | null
    // 触发钩子onVnodeBeforeUpdate
    if ((vnodeHook = newProps.onVnodeBeforeUpdate)) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1)
    }
    // 触发指令钩子
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate')
    }

    if (__DEV__ && isHmrUpdating) {
      // HMR updated, force full diff
      patchFlag = 0
      optimized = false
      dynamicChildren = null
    }
    // 如果此时元素被标记过 patchFlag，则会通过 patchFlag 进行按需比较
    if (patchFlag > 0) {
      if (patchFlag & PatchFlags.FULL_PROPS) {
        // 如果元素的 props 中含有动态的 key，则需要全量比较
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        )
      } else {
        // class
        // 当 patchFlag 为 CLASS 时
        if (patchFlag & PatchFlags.CLASS) {
          // 当新旧节点的 class 不一致时，此时会对 class 进行 patch
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, 'class', null, newProps.class, isSVG)
          }
        }
        // style
        // 当 patchFlag 为 STYLE 时，会对 style 进行更新
        if (patchFlag & PatchFlags.STYLE) {
          // 这时每次 patch 都会进行的，这个 Flag 会在有动态 style 绑定时被加入
          hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG)
        }
        // props
        // 当 patchFlag 为 PROPS 时
        // 需要注意这个 Flag 会在元素拥有动态的属性或者 attrs 绑定时添加
        // 不同于 class 和 style，这些动态的prop 或 attrs 的 key 会被保存下来以便于更快速的迭代。
        if (patchFlag & PatchFlags.PROPS) {
          // if the flag is present then dynamicProps must be non-null
          const propsToUpdate = n2.dynamicProps!
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i]
            const prev = oldProps[key]
            const next = newProps[key]
            if (
              next !== prev ||
              (hostForcePatchProp && hostForcePatchProp(el, key))
            ) {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                isSVG,
                n1.children as VNode[],
                parentComponent,
                parentSuspense,
                unmountChildren
              )
            }
          }
        }
      }

      // text
      // This flag is matched when the element has only dynamic text children.
      if (patchFlag & PatchFlags.TEXT) {
        // 新旧节点文本发生变化
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children as string)
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      // unoptimized, full diff
      // 全量比较
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        isSVG
      )
    }

    const areChildrenSVG = isSVG && n2.type !== 'foreignObject'
    // 是否存在动态子节点
    if (dynamicChildren) {
      // 调用 patchBlockChildren 仅仅更新动态的子节点
      patchBlockChildren(
        n1.dynamicChildren!,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds
      )
      if (__DEV__ && parentComponent && parentComponent.type.__hmrId) {
        traverseStaticChildren(n1, n2)
      }
    } else if (!optimized) {
      // full diff
      // 对子节点进行全量更新。
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds,
        false
      )
    }

    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1)
        dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated')
      }, parentSuspense)
    }
  }
```

> 解析

说明：patchElement分为对新旧vnode自身元素属性和子节点分别进行patch

+ 首先调用执行生命周期beforeUpdate钩子函数
+ 如果有绑定指令则执行指令生命周期beforeUpdate钩子函数
+ 依据patchFlag属性是否大于0区分对属性进行全量更行or靶向更新
+ 首先判断patchFlag大于0情况
   + PatchFlags.FULL_PROPS，即patchFlag=16说明包含有动态key，则需要进行全量更新
   + PatchFlags.CLASS，即patchFlag=2，判断当新旧节点的 class 不一致时，此时会对 class 进行 patch
   + PatchFlags.STYLE，即patchFlag=4，对style进行patch
   + PatchFlags.PROPS,即patchFlag=8，说明包含有动态属性如:href="value"
      - 获取新vnode动态属性const propsToUpdate = n2.dynamicProps!
      - 遍历动态属性，当新旧动态属性值不相等情况下，更新
   + PatchFlags.TEXT，即patchFlag=1,即元素子节点为动态文本情况
      - 判断新旧文本是否相等，不相等则更新文本内容
+ 其次为patchFlag小于等于0，则进行全量更新
+ 根据dynamicChildren处理元素子节点不为文本情况
   + 如果dynamicChildren为真，则调用patchBlockChildren仅更新动态子节点
   + 否则调用patchChildren对子节点进行全量更新
+ 执行组件生命周期钩子updated
+ 如果有绑定指令，则执行指令生命周期updated