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
      el = vnode.el = hostCloneNode(vnode.el)
    } else {
      el = vnode.el = hostCreateElement(
        vnode.type as string,
        isSVG,
        props && props.is,
        props
      )
      // 元素类型子元素为text类型--文本
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, vnode.children as string)
      // // 元素类型为数组成员--子元素
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
      // full diff----------------diff start
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

---

核心diff开始：承接patchElement()方法内部--patchChildren

[四、patchChildren()方法]()

- 定义

```js
const patchChildren: PatchChildrenFn = (
    n1,
    n2,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    isSVG,
    slotScopeIds,
    optimized = false
  ) => {
    // 获取基本信息
    const c1 = n1 && n1.children
    const prevShapeFlag = n1 ? n1.shapeFlag : 0
    const c2 = n2.children
    const { patchFlag, shapeFlag } = n2
    // fast path
    if (patchFlag > 0) {
      if (patchFlag & PatchFlags.KEYED_FRAGMENT) {
        // key
        patchKeyedChildren(
          c1 as VNode[],
          c2 as VNodeArrayChildren,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
        return
      } else if (patchFlag & PatchFlags.UNKEYED_FRAGMENT) {
        // unkeyed
        patchUnkeyedChildren(
          c1 as VNode[],
          c2 as VNodeArrayChildren,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
        return
      }
    }

    // children 存在 三种可能： 文本节点、数组型、无children

    // 新children文本类型的子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 旧children是数组型，直接卸载
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1 as VNode[], parentComponent, parentSuspense)
      }
      // 新旧都是文本，但是文本不相同直接替换
      if (c2 !== c1) {
        hostSetElementText(container, c2 as string)
      }
    } else {
      // 旧children是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新children是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // two arrays, cannot assume anything, do full diff
          patchKeyedChildren(
            c1 as VNode[],
            c2 as VNodeArrayChildren,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else {
          // 不存在新children，直接卸载旧children
          unmountChildren(c1 as VNode[], parentComponent, parentSuspense, true)
        }
      } else {
        // prev children was text OR null
        // new children is array OR null
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 如果旧children是文本，无论新children是哪个可能都需要先清除文本内容
          hostSetElementText(container, '')
        }
        // mount new if array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 如果新children为数组 直接挂载
          mountChildren(
            c2 as VNodeArrayChildren,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        }
      }
    }
  }
```

- 说明：

首先获取新旧节点基本信息，prevShapeFlag，shapeFlag，patchFlag，新旧节点,children 存在 三种可能： 文本节点、数组型、无children

- 1. 首先判断-新children为文本类型的子节点
   + 1.1 旧children是数组型，直接卸载
   + 1.2 新旧都是文本，但是文本不相同直接替换
- 2. 其次判断-
   + 2.1 旧children也为数组类型，新children为数组类型,--patchKeyedChildren diff
   + 2.2 旧children也为数组类型, 新children为空，卸载旧children
- 3. 最后判断旧children为text or null, 新children为array or null
   + 3.1 如果旧children是文本，无论新children是array or null哪个可能都需要先清除文本内容
   + 3.2 如果新children为数组 直接挂载


[五、patchKeyedChildren]()

- 定义
```js
const patchKeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    parentAnchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => {
    // 索引 i
    let i = 0
    // 新children长度
    const l2 = c2.length
    // 旧children结束索引
    let e1 = c1.length - 1 // prev ending index
    // 新children结束索引
    let e2 = l2 - 1 // next ending index

    // 1. sync from start-----从前
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      // 相同节点
      if (isSameVNodeType(n1, n2)) {
        // 直接patch
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else {
        // 不同跳出
        break
      }
      i++
    }

    // 2. sync from end----从后
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = (c2[e2] = optimized
        ? cloneIfMounted(c2[e2] as VNode)
        : normalizeVNode(c2[e2]))
      // 相同节点
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else {
        // 不同跳出
        break
      }
      e1--
      e2--
    }

    // 3. 同步后 需要mount的情况
    // 3. common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1) {
      // 旧children 同步完毕
      if (i <= e2) {
        // 如果新children还有剩下，说明新增了需要挂载
        const nextPos = e2 + 1
        // 获取插入的相对位置
        const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
        while (i <= e2) {
          // 循环mount
          patch(
            null,
            (c2[i] = optimized
              ? cloneIfMounted(c2[i] as VNode)
              : normalizeVNode(c2[i])),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
          i++
        }
      }
    }

    // 同步后 需要卸载
    // 4. common sequence + unmount
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
      // 新children已经同步完成
      while (i <= e1) {
        // 如果旧children还剩，说明需要卸载
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
      }
    }

    // // 5. 同步后两者都还剩余，需要更细致判断
    // 5. unknown sequence
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      // 新旧开始索引
      const s1 = i // prev starting index
      const s2 = i // next starting index
      // 建立key--->index的哈希表（新children中的对应关系）
      // 5.1 build key:index map for newChildren
      const keyToNewIndexMap: Map<string | number, number> = new Map()
      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`
            )
          }
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      // 5.2 loop through old children left to be patched and try to patch
      // matching nodes & remove nodes that are no longer present
      // 建立新children剩余子序列对应在旧children中的索引
      let j
      // 已经patch的个数
      let patched = 0
      // 待patch的个数
      const toBePatched = e2 - s2 + 1
      // 是否需要移动
      let moved = false
      // used to track whether any node has moved
      let maxNewIndexSoFar = 0
      // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence
      // 新children每个VNode对应索引在旧children中索引的映射表
      // 用来存放新节点索引和老节点索引的数组。
      // 数组的index是新vnode的索引 ， value是老vnode的索引。
      const newIndexToOldIndexMap = new Array(toBePatched)
      // 建立一个数组，每个子元素都是0 [ 0, 0, 0, 0, 0, 0, ]
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
      // 开始遍历旧children同步剩下的序列
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // 已经patch数量大于等于待patch
          // 说明是需要卸载的元素
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex
        // 如果,老节点的key存在 ，通过key找到对应的index
        if (prevChild.key != null) {
          // 获取当前旧child在新children中的索引
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // 老节点的key不存在，遍历剩下的所有新节点
          // key-less node, try to locate a key-less node of the same type
          // 遍历剩下的所有新节点 
          for (j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              // 如果找到与当前老节点对应的新节点那么 ，将新节点的索引，赋值给newIndex 
              newIndex = j
              break
            }
          }
        }
        // 有找到与老节点对应的新节点，删除当前节点，卸载所有的节点
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        } else {
          // 把老节点的索引，记录在存放新节点的数组中
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            // 证明有节点已经移动了
            moved = true
          }
          // 找到新的节点进行patch节点
          patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
          patched++
        }
      }
      // 处理新节点中新增节点和移动位置节点
      // a移动老节点
      // b创建新节点
      // 5.3 move and mount
      // generate longest stable subsequence only when nodes have moved
      // 根据最长稳定序列移动相对应的节点
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1
      // looping backwards so that we can use last patched node as anchor
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex] as VNode
        const anchor =
          nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          // 没有老的节点与新的节点对应，则创建一个新的vnode
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (moved) {
          // move if:
          // There is no stable subsequence (e.g. a reverse)
          // OR current node is not among the stable sequence
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            // 如果没有在长
            move(nextChild, container, anchor, MoveType.REORDER)
          } else {
            j--
          }
        }
      }
    }
  }
```

- diff 总结如下：

> 创建diff相关变量

```js
// 循环索引变量
let i = 0
// 新children长度
const l2 = c2.length
// 旧children结束索引
let e1 = c1.length - 1
// 新children结束索引
let e2 = l2 - 1
```

+ 1. 从前同步比对是否为相同节点
   + 1.1 新旧节点为相同节点，则调用patch
   + 1.2 不相同则跳出

```js
// old： (a b) c
// new： (a b) d e
```

+ 2. 从后同步比对是否为相同节点
   + 2.1 新旧节点为相同节点，则调用patch
   + 2.2 不相同则跳出

```js
// new：a (b c)
// old：d e (b c)
```

+ 3. 旧children 同步完毕
   + 3.1 如果新children还有剩下，说明新增了需要挂载

```js
// 同步后，需要mount情况
// (a b)
// (a b) c
// 或者
// (a b)
// c (a b)
```

+ 4. 新children已经同步完成
   + 4.1 如果旧children还剩，说明需要卸载

```js
// 同步后，需要unmount
// (a b) c
// (a b)
// 或者
// a (b c)
// (a b)
```

+ 5. 同步后两者都还剩余，需要更细致判断

```js
// old: (a,b) c,d,e,f(g,h)
// new: (a,b) d,e,c,i(g,h)
```

+ 把没有比较过的新的vnode节点,通过map保存
+ 记录已经patch的新节点的数量 patched
+ 没有经过 path 新的节点的数量 toBePatched
```js
{
  key1: index1,
  key2: index2
}
```

+ newIndexToOldIndexMap,用来存放新节点索引和老节点索引的数组,数组的index是新vnode的索引 ， value是老vnode的索引。

+ 开始遍历老节点
   + 1. 已经patch数量大于等于toBePatched新的节点数量为0 ，那么统一卸载老的节点
   + 2. 如果,老节点的key存在 ，通过key找到旧节点对应新节点的索引index
   + 3. 如果,老节点的key不存在，遍历剩下的所有新节点，找到与当前老节点对应的新节点，找出旧节点在新节点中的位置索引index
   + 4. 没有找到与老节点对应的新节点，删除当前节点

---
核心： 最长稳定序列

+ 遍历结束---对于新节点中的新增节点和移动处理：最长稳定序列

   + 1.首选通过getSequence得到一个最长稳定序列，根据 newIndexToOldIndexMap 新老节点索引列表找到最长稳定序列
   + 2.对于 newIndexToOldIndexMap -item =0 证明不存在老节点 ，从新形成新的vnode
   + 3.对于发生移动的节点进行移动处理。

[六、key的作用，如何正确使用key]()

+ 1. key的作用：
diff算法中，通过isSameVNodeType方法判断，来判断key是否相等判断新老节点。
在v-for循环中，key的作用是：通过判断newVnode和OldVnode的key是否相等，从而复用与新节点对应的老节点，节约性能的开销。

+ 2. 如何正确使用key？
   + 2.1 错误用法 1：用index做key。
   用index做key的效果实际和没有用diff算法是一样的
   + 2.2 错误用法2 ：用index拼接其他值作为key。
   实际结果，和直接使用index一样
   + 2.3 正确用法 ：用唯一值id做key


