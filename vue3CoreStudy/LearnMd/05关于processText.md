### 关于processText处理文本节点分析
---

[一、方法定义]()

```js
const processText: ProcessTextOrCommentFn = (n1, n2, container, anchor) => {
    if (n1 == null) {
      // 不存在就text,则将新text vnode插入
      hostInsert(
        (n2.el = hostCreateText(n2.children as string)),
        container,
        anchor
      )
    } else {
      // 获取旧vnode真实元素标签，并赋值给n2
      const el = (n2.el = n1.el!)
      // 新旧文本不同
      if (n2.children !== n1.children) {
        // n2替换n1文本
        hostSetText(el, n2.children as string)
      }
    }
  }
```

> 解析

- n1为旧vnode,n2为新vnode
- n1不存在情况下，直接将新vnode插入
- n1存在情况下，获取旧vnode保存的元素标签，并赋值n2
- 以当前n2文本节点替换n1文本