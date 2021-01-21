### 关于 vue 中*patch*的源码分析

---

1.定义位置：vue\src\core\vdom\patch.js 2.初始化位置：vue\src\platforms\web\runtime\index.js

```
// install platform patch function
Vue.prototype.__patch__ = patch
```

##### 1.patch 源码

```
  function patch (oldVnode, vnode, hydrating, removeOnly) {
    // 判断新节点是否存在 v === undefined || v === null
    if (isUndef(vnode)) {
      // 新节点不存在
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode) // 旧节点存在，销毁旧节点
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []
    // 新节点存在情况下
    // 判断旧节点是否存在
    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      // 旧节点不存在，根据新节点创建dom
      isInitialPatch = true // 组件初始加载
      createElm(vnode, insertedVnodeQueue)
    } else {
      // 新旧节点，同时存在

      const isRealElement = isDef(oldVnode.nodeType) // 获取旧节点是否是真实dom
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // 旧节点不是真实dom元素并且和新节点相似
        // 执行patchVnode 修改现有节点（旧）
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {

        if (isRealElement) {
          // 旧节点是dom元素
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          // 如果oldVnode是元素节点，且含有data-server-rendered属性时，移除该属性，
          // 并设置hydrating为true。
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode) // 将 vm.$el 转为 VNode 格式
        }

        // 如果oldVnode是真实节点时或vnode和oldVnode不是同一节点时
        // 找到oldVnode.elm的父节点

        // replacing existing element
        // 获取旧节点元素自身
        const oldElm = oldVnode.elm
        // 获取旧节点父元素
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        // 根据vnode创建一个真实的DOM节点，并插入到该父节点中的oldVnode.elm位置
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm) // 获取紧跟的弟弟元素
        )

        // update parent placeholder node element, recursively
        // 如果组件根节点被替换，遍历更新父节点element。然后移除旧节点。
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          // 销毁旧节点以及DOM元素
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    // 返回 vnode.elm
    return vnode.elm
  }
```

### 总结：

##### 1.首先判断新节点是否存在

- 新节点不存在，旧节点存在则销毁 oldVnode

##### 2.新节点存在情况下，判断旧节点是否存在

- 旧节点不存在，说明需要创建新节点，调用 createElm 创建新节点

##### 3.当新 vnode 和旧 oldVnode 都存在情况下

- 3.1 首先判断旧节点是否是真实 dom 元素

  - 如果 oldVnode 不是真实节点,并且 vnode 和 oldVnode 是同一节点时，说明是需要比较新旧节点，则调用 patchVnode 进行 patch。
  - 如果 oldVnode 是真实节点时，调用 hydrate 方法，将 Virtural DOM 与真实 DOM 进行映射，然后将 oldVnode 设置为对应的 Virtual DOM

- 3.2 如果 oldVnode 是真实节点时或 vnode 和 oldVnode 不是同一节点时：
  - 如果 oldVnode 是真实 DOM 节点，则先把真实 DOM 节点转为 Vnode
  - 找到 oldVnode.elm 的父节点，根据 vnode 创建一个真实的 DOM 节点，并插入到该父节点中的 oldVnode.elm 位置,同时调用 removeVnodes 将旧的节点从父节点中移除
  - 如果组件根节点被替换，遍历更新父节点 element。然后移除旧节点。

### 说明：

当 vnode 和 oldVnode 都存在、oldVnode 不是真实节点并且 vnode 和 oldVnode 是同一节点时，才会调用 patchVnode 进行 patch。

### 核心作用函数

---

##### 1.判断节点不存在 isUndef()

```
function isUndef(v) {
  return v === undefined || v === null
}
```

##### 2.判断节点存在

```
function isDef(v) {
  return v !== undefined || v !== null
}
```

##### 3.是否同一个节点

```
function sameVnode (a, b) {
  return (
    a.key === b.key && ( // key相同
      (
        a.tag === b.tag && // 标签类型相同
        a.isComment === b.isComment && // 注释节点标识相同，都是注释节点或者都不是注释节点
        isDef(a.data) === isDef(b.data) && // data的值状态相同
        sameInputType(a, b) // input type相同
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

##### 2.patchVnode 源码

```
  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      // 如果oldVnode和vnode完全一致，则可认为没有变化，return；
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    const elm = vnode.elm = oldVnode.elm
    // 如果oldVnode的isAsyncPlaceholder属性为true时，跳过检查异步组件，return；
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }


    // oldVnode跟vnode都是静态节点，且具有相同的key
    // 并且当vnode是克隆节点或是v-once指令控制的节点
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      // 只需要把oldVnode.elm和oldVnode.child都复制到vnode上
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }

    if (isUndef(vnode.text)) {
      // 如果vnode不是文本节点或注释节点
      if (isDef(oldCh) && isDef(ch)) {
        // 如果vnode的children和oldVnode的children都存在，且不完全相等，则调用updateChildren更新子节点
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        // 如果只有vnode存在子节点
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // 则调用addVnodes添加这些子节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 如果只有oldVnode存在子节点，则调用removeVnodes移除这些子节点
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        // 如果oldVnode和vnode都不存在子节点，但是oldVnode为文本节点或注释节点，则把oldVnode.elm的文本内容置为空
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 如果vnode是文本节点或注释节点，并且vnode.text和oldVnode.text不相等，则更新oldVnode的文本内容为vnode.text
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```

### 总结

- 在 patch 过程中：
  当 vnode 和 oldVnode 都存在、oldVnode 不是真实节点，并且 vnode 和 oldVnode 是同一节点时，才会调用 patchVnode 进行 patch

- patchVnode 原理如下：

##### 1.首先判断 oldVnode 和 vnode 是否完全一致

- 一致则可认为没有变化直接返回

##### 2.判断 oldVnode 是否为异步组件

- 如果 oldVnode 的 isAsyncPlaceholder 属性为 true 时，跳过检查异步组件，return；

##### 3.判断 oldVnode 和 vnode 是否为静态节点

- oldVnode 跟 vnode 都是静态节点，且具有相同的 key 并且当 vnode 是克隆节点或是 v-once 指令控制的节点，把 oldVnode.elm 和 oldVnode.child 都复制到 vnode 上

##### 4.vnode 不是文本节点或注释节点情况

- ##### 4.1 如果 vnode 的 children 和 oldVnode 的 children 都存在，且不完全相等，则调用 updateChildren 更新子节点
- ##### 4.2 如果只有 vnode 存在子节点，调用 addVnodes 添加这些子节点
- ##### 4.3 如果只有 oldVnode 存在子节点，则调用 removeVnodes 移除这些子节点
- ##### 4.4 如果 oldVnode 和 vnode 都不存在子节点，但是 oldVnode 为文本节点或注释节点，则把 oldVnode.elm 的文本内容置为空

##### 5. vnode 是文本节点或注释节点

- ##### 如果 vnode 是文本节点或注释节点，并且 vnode.text 和 oldVnode.text 不相等，则更新 oldVnode 的文本内容为 vnode.text
