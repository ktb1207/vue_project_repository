/**
 *
 * 什么是 patchFlag？？
 *
 * patchFlag 是 complier 时的 transform 阶段解析 AST Element 打上的---优化标识
 *
 * 它会为 runtime 时的 patchVNode 提供依据，从而实现靶向更新 VNode 的效果
 *
 * */

export const enum PatchFlags {
  // 动态文本节点
  TEXT = 1,

  // 2 动态class
  CLASS = 1 << 1,

  // 4 动态style
  STYLE = 1 << 2,

  // 8 动态属性，但不好汉class style
  PROPS = 1 << 3,

  // 16 具有动态key属性，当key改变时，需要进行完整的diff
  FULL_PROPS = 1 << 4,

  // 32 带有监听事件的节点
  HYDRATE_EVENTS = 1 << 5,

  // 64 一个不会改变子节点顺序的fragment
  STABLE_FRAGMENT = 1 << 6,

  // 128 带有key的fragment
  KEYED_FRAGMENT = 1 << 7,

  // 256 没有key的fragment
  UNKEYED_FRAGMENT = 1 << 8,

  // 512 一个子节点只会进行非props比较
  NEED_PATCH = 1 << 9,

  // 1024 动态插槽
  DYNAMIC_SLOTS = 1 << 10,

  // 下面是特殊的

  // 2048 表示仅因为用户在模板的根级别放置注释而创建的片段，这是一个仅用于开发的标志，因为注释在生产中被剥离
  DEV_ROOT_FRAGMENT = 1 << 11,

  // 静态节点，它的内容永远不会改变，不需要进行diff
  HOISTED = -1,
  // 用来表示一个节点的diff应该结束
  BAIL = -2
}

/**
 * dev only flag -> name mapping
 */
export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.HYDRATE_EVENTS]: `HYDRATE_EVENTS`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.DEV_ROOT_FRAGMENT]: `DEV_ROOT_FRAGMENT`,
  [PatchFlags.HOISTED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`
}
