### 关于vue中的createElement的分析
---
1.定义位置：vue\src\core\vdom\create-element.js
源码如下
```
export function createElement (
  context: Component, // vm实例
  tag: any, // vnode的tag标签
  data: any, // vnode的data相关数据
  children: any, // 子节点
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // 判断data是否是数组以及是否基本类型，判断data是否传入
  if (Array.isArray(data) || isPrimitive(data)) {
    // 没有传入所有的参数向前赋值
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    // $createElement，手写render
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // 判断data是不是响应式的
  // vnode中的data不能是响应式的
  // 如果是，则Vue抛出警告
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    // 创建一个文本vnode
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }

  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 将children类数组转换为一维数组扁平化处理。
  if (normalizationType === ALWAYS_NORMALIZE) {
    // $createElement，手写render
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    // vm._c,template编译为render情况
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  // 判断标签（tag）是不是字符串
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    // 判断该标签是不是平台内建的标签（如：‘div’）
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn)) {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      // 是的话则创建该VNode
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      // 然后判断该标签是不是组件，是的话，创建一个组件VNode
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    // 如果都不是，则按照该标签名创建一个VNode。
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    // 创建一个文本vnode
    return createEmptyVNode()
  }
}
```
总结：
- createElement函数主要是通过对children进行扁平化处理之后通过对标签（tag）的判断，使用VNode类来生成vnode，并将其返回