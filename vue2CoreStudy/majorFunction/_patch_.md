### 关于 vue 中*patch*的源码分析

---
1.定义位置：vue\src\core\vdom\patch.js
2.初始化位置：vue\src\platforms\web\runtime\index.js
```
// install platform patch function
Vue.prototype.__patch__ = patch
```

##### 1.patch源码
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
- 新节点不存在，旧节点存在则销毁oldVnode
##### 2.新节点存在情况下，判断旧节点是否存在
- 旧节点不存在，说明需要创建新节点，调用createElm创建新节点

##### 3.当新vnode和旧oldVnode都存在情况下
- 3.1首先判断旧节点是否是真实dom元素
   + 如果oldVnode不是真实节点,并且vnode和oldVnode是同一节点时，说明是需要比较新旧节点，则调用patchVnode进行patch。
   + 如果oldVnode是真实节点时，调用hydrate方法，将Virtural DOM与真实DOM进行映射，然后将oldVnode设置为对应的Virtual DOM

- 3.2如果oldVnode是真实节点时或vnode和oldVnode不是同一节点时：
   + 找到oldVnode.elm的父节点，根据vnode创建一个真实的DOM节点，并插入到该父节点中的oldVnode.elm位置
   + 如果组件根节点被替换，遍历更新父节点element。然后移除旧节点。
### 说明：
当vnode和oldVnode都存在、oldVnode不是真实节点并且vnode和oldVnode是同一节点时，才会调用patchVnode进行patch。

### 核心作用函数
---
##### 1.判断节点不存在isUndef()
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

