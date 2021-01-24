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
  首次渲染：`vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);`,旧节点传入参数为真是 dom 节点
  更新渲染：`vm.__patch__(prevVnode, vnode);`,旧节点为 vnode

  - 如果 oldVnode 不是真实节点,并且 vnode 和 oldVnode 是同一节点时，说明是需要比较新旧节点，则调用 patchVnode 进行 patch。
  - 如果 oldVnode 是真实节点时，调用 hydrate 方法，将 Virtural DOM 与真实 DOM 进行映射，然后将 oldVnode 设置为对应的 Virtual DOM

- 3.2 如果 oldVnode 是真实节点时或 vnode 和 oldVnode 不是同一节点时：
  - 如果 oldVnode 是真实 DOM 节点，则先把真实 DOM 节点转为 Vnode
  - 找到 oldVnode.elm 的父节点，根据 vnode 创建一个真实的 DOM 节点，并插入到该父节点中的 oldVnode.elm 位置,同时调用 removeVnodes 将旧的节点从父节点中移除
  - 如果组件根节点被替换，遍历更新父节点 element。然后移除旧节点。

### 说明：

当 vnode 和 oldVnode 都存在、oldVnode 不是真实节点并且 vnode 和 oldVnode 是同一节点时，才会调用 patchVnode 进行 patch。

### 核心作用函数

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

---

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

##### 4.vnode 不是文本节点或注释节点情况-（元素节点）

- ##### 4.1 如果 vnode 的 children 和 oldVnode 的 children 都存在，且不完全相等，则调用 updateChildren 更新子节点
- ##### 4.2 如果只有 vnode 存在子节点，调用 addVnodes 添加这些子节点
- ##### 4.3 如果只有 oldVnode 存在子节点，则调用 removeVnodes 移除这些子节点
- ##### 4.4 如果 oldVnode 和 vnode 都不存在子节点，但是 oldVnode 为文本节点或注释节点，则把 oldVnode.elm 的文本内容置为空

##### 5. vnode 是文本节点或注释节点

- ##### 如果 vnode 是文本节点或注释节点，并且 vnode.text 和 oldVnode.text 不相等，则更新 oldVnode 的文本内容为 vnode.text

---

### 3.updateChildren 源码

说明：
在 patchVnode 过程中，如果 vnode 的 children 和 oldVnode 的 children 都存在，且不完全相等，则调用 updateChildren 更新子节点

```
  function updateChildren(
    parentElm,
    oldCh,
    newCh,
    insertedVnodeQueue,
    removeOnly
  ) {
    let oldStartIdx = 0; // 表示当前正在处理的旧起始节点序号
    let newStartIdx = 0; // 表示当前正在处理的新起始节点序号
    let oldEndIdx = oldCh.length - 1; // 表示当前正在处理的旧结尾节点序号
    let oldStartVnode = oldCh[0]; // 表示当前正在处理的旧起始节点
    let oldEndVnode = oldCh[oldEndIdx]; // 表示当前正在处理的旧结尾节点
    let newEndIdx = newCh.length - 1; // 表示当前正在处理的新结尾节点序号
    let newStartVnode = newCh[0]; // 示当前正在处理的新起始节点
    let newEndVnode = newCh[newEndIdx]; // 表示当前正在处理的新结尾节点
    let oldKeyToIdx, // 尚未处理的旧节点key值映射
      idxInOld, // 与新节点key值相同的旧节点序号
      vnodeToMove, // 与新节点key值相同的旧节点
      refElm; // 指向当前正在处理的新结尾节点的后一个节点（已处理）的DOM元素

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly;

    if (process.env.NODE_ENV !== "production") {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        // 旧起始节点undefined, 旧起始节点右边移动一位
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        // 旧结尾节点undefined,旧结尾节点左边移动一位
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 新旧子节点的起始节点相同，patchVnode更新dom内容
        patchVnode(
          oldStartVnode,
          newStartVnode,
          insertedVnodeQueue,
          newCh,
          newStartIdx
        );
        // 旧起始节点右边移动一位
        oldStartVnode = oldCh[++oldStartIdx];
        // 新起始节点右边移动一位
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 新旧子节点的结尾节点相同，patchVnode更新dom内容
        patchVnode(
          oldEndVnode,
          newEndVnode,
          insertedVnodeQueue,
          newCh,
          newEndIdx
        );
        // 旧结尾节点左边移动一位
        oldEndVnode = oldCh[--oldEndIdx];
        // 新结尾节点右边移动一位
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        // 旧起始节点和新结尾节点相同，patchVnode更新dom内容
        patchVnode(
          oldStartVnode,
          newEndVnode,
          insertedVnodeQueue,
          newCh,
          newEndIdx
        );
        // 将旧起始节点DOM添加到旧结尾节点DOM前面
        canMove &&
          nodeOps.insertBefore(
            parentElm,
            oldStartVnode.elm,
            nodeOps.nextSibling(oldEndVnode.elm)
          );
        // 旧起始节点右边移动一位
        oldStartVnode = oldCh[++oldStartIdx];
        // 新结尾节点左边移动一位
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        // 旧结尾节点和新起始节点相同，patchVnode更新dom内容
        patchVnode(
          oldEndVnode,
          newStartVnode,
          insertedVnodeQueue,
          newCh,
          newStartIdx
        );
        // 将旧结尾节点DOM添加到旧起始节点DOM前面
        canMove &&
          nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        // 旧结尾节点左边移动一位
        oldEndVnode = oldCh[--oldEndIdx];
        // 新起始节点右边移动一位
        newStartVnode = newCh[++newStartIdx];
      } else {
        // 其他情况

        if (isUndef(oldKeyToIdx))
          // 缓存尚未处理的旧节点key值
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          // 寻找新起始节点key值在未处理旧节点相同key值节点
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        // 未处理的旧节点中不存在与新起始节点相同的节点
        if (isUndef(idxInOld)) {
          // New element
          // 创建新节点DOM并添加到旧起始节点DOM的前面
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            false,
            newCh,
            newStartIdx
          );
        } else {
          // 旧节点中存在与新起始节点key相同的节点

          // 缓存与新节点key值相同的旧节点
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 未处理旧节点和新起始节点是相同节点
            patchVnode(
              vnodeToMove,
              newStartVnode,
              insertedVnodeQueue,
              newCh,
              newStartIdx
            );
            // 将相同的旧节点置为undefined
            oldCh[idxInOld] = undefined;
            // 将相同的旧节点DOM添加到旧起始节点DOM前面
            canMove &&
              nodeOps.insertBefore(
                parentElm,
                vnodeToMove.elm,
                oldStartVnode.elm
              );
          } else {
            // key相同,但标签类型不同的节点
            // same key but different element. treat as new element
            // 创建新节点DOM并添加到旧起始节点DOM的前面
            createElm(
              newStartVnode,
              insertedVnodeQueue,
              parentElm,
              oldStartVnode.elm,
              false,
              newCh,
              newStartIdx
            );
          }
        }
        // // 新起始节点右边移动一位
        newStartVnode = newCh[++newStartIdx];
      }
    }
    // 循环结束
    if (oldStartIdx > oldEndIdx) {
      // 旧节点遍历完
      // 把剩余未处理新节点DOM添加到上一个新结尾节点DOM前面（从新起始节点到新结尾节点，都未处理过）
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(
        parentElm,
        refElm,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue
      );
    } else if (newStartIdx > newEndIdx) {
      // 新节点遍历完
      // 移除旧起始和结尾节点以及他们之间的节点的DOM(从旧起始节点到旧结尾节点，可能存在处理过的节点，但处理过已被置为undefined)
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }
```

### 总结

- updateChildren 按照新旧 vnode 进行由两侧向中间的比对，以新节点 vnode 为主导，此过程并不改变旧节点 vnode 排序
- 将新旧 vnode 分别标记起始和结尾对比位置标识

#### 1.首先判断新旧节点的起始序号不大于结尾序号(循环未结束)

##### 1.1 判断旧起始节点是否存在

- 旧起始节点不存在，则旧起始节点向右移动一位

##### 1.2 判断旧结尾节点是否存在

- 旧结尾节点不存在，则旧结尾节点向左移动一位

##### 1.3 判断新旧节点的起始位置节点是否相同(sameVnode)

- 新旧节点起始位置节点相同，调用 patchVnode 以新节点为准更新旧节点内容
- 旧起始节点右边移动一位
- 新起始节点右边移动一位

##### 1.4 判断新旧节点的结束位置节点是否相同(sameVnode)

- 新旧节点结束位置节点相同，调用 patchVnode 以新节点为准更新旧节点内容
- 旧结尾节点左边移动一位
- 新结尾节点左边移动一位

##### 1.5 判断旧起始节点和新结束节点是否相同(sameVnode)

- 旧起始节点和新结束节点相同，调用 patchVnode 以新节点为准更新旧节点内容
- 将旧起始节点 DOM 添加到旧结尾节点 DOM 前面
- 旧起始节点右边移动一位
- 新结尾节点左边移动一位

##### 1.6 判断旧结尾节点和新起始节点是否相同(sameVnode)

- 旧结尾节点和新起始节点相同，调用 patchVnode 以新节点为准更新旧节点内容
- 将旧结尾节点 DOM 添加到旧起始节点 DOM 前面
- 旧结尾节点左边移动一位
- 新起始节点右边移动一位

##### 1.7 在新旧起始和结束特殊位置对比过后处理中间节点情况

a:缓存尚未处理的旧节点 key 值;
b:寻找新起始节点 key 值在未处理旧节点相同 key 值节点

##### 1.7.1 未处理的旧节点中不存在与新起始节点相同的节点

- 创建新节点 DOM 并添加到旧起始节点 DOM 的前面

##### 1.7.2 旧节点中存在与新起始节点 key 相同的节点,判断新旧节点是否相同(sameVnode)

- ##### 1.7.2.1 未处理旧节点和新起始节点是相同节点
  - 调用 patchVnode 以新节点为准更新旧节点内容
  - 将相同的旧节点置为 undefined
  - 将相同的旧节点 DOM 添加到旧起始节点 DOM 前面
- ##### 1.7.2.2 未处理旧节点和新起始节点 key 值相同，但是标签类型不同(不是相同节点)
  - 创建新节点 DOM 并添加到旧起始节点 DOM 的前面

##### 1.7.3 在判断执行完 1.7.1 和 1.7.2 之后，新起始节点右边移动一位

#### 2.循环结束

##### 2.1 判断如果旧节点遍历结束(oldStartIdx > oldEndIdx)

- 把剩余未处理新节点 DOM 添加到上一个新结尾节点 DOM 前面(从新起始节点到新结尾节点，都未处理过)

##### 2.2 判断如果新节点遍历结束(newStartIdx > newEndIdx)

- 移除旧起始和结尾节点以及他们之间的节点的 DOM(从旧起始节点到旧结尾节点，可能存在处理过的节点，但处理过已被置为 undefined)
