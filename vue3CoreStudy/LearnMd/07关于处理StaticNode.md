### 关于处理StaticNode分析
---

StaticNode处理分为两个处理

```js
// 静态节点类型
      case Static:
        if (n1 == null) {
          // 旧节点不存在情况下，直接创建新节点
          mountStaticNode(n2, container, anchor, isSVG)
        } else if (__DEV__) {
          // 开发环境，尽在HMR执行
          patchStaticNode(n1, n2, container, isSVG)
        }
        break
```

[一、mountStaticNode]()

> 定义

```js
  const mountStaticNode = (
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    isSVG: boolean
  ) => {
    // static nodes are only present when used with compiler-dom/runtime-dom
    // which guarantees presence of hostInsertStaticContent.
    ;[n2.el, n2.anchor] = hostInsertStaticContent!(
      n2.children as string,
      container,
      anchor,
      isSVG
    )
  }
```

[二、patchStaticNode]()

> 定义

```js
  const patchStaticNode = (
    n1: VNode,
    n2: VNode,
    container: RendererElement,
    isSVG: boolean
  ) => {
    // static nodes are only patched during dev for HMR
    if (n2.children !== n1.children) {
      // 获取旧节点参照
      const anchor = hostNextSibling(n1.anchor!)
      // remove existing
      removeStaticNode(n1)
      // insert new
      ;[n2.el, n2.anchor] = hostInsertStaticContent!(
        n2.children as string,
        container,
        anchor,
        isSVG
      )
    } else {
      n2.el = n1.el
      n2.anchor = n1.anchor
    }
  }
```

> 解析
- 当新旧静态节点子元素不相等情况下
- 获取旧节点参照
- 删除旧节点
- 创建插入新节点

