import { isObject, toRawType, def } from '@vue/shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'
import {
  mutableCollectionHandlers,
  readonlyCollectionHandlers,
  shallowCollectionHandlers,
  shallowReadonlyCollectionHandlers
} from './collectionHandlers'
import { UnwrapRef, Ref } from './ref'
// reactive 标识
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.RAW]?: any
}

export const reactiveMap = new WeakMap<Target, any>()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()

const enum TargetType {
  INVALID = 0, // 无效的
  COMMON = 1, // 可以代理的object,array类型
  COLLECTION = 2 // 可以代理的集合类型，map set weakMap,weakSet
}

function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON // 1
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION // 2
    default:
      return TargetType.INVALID // 0
  }
}
// 获取目标的类型
function getTargetType(value: Target) {
  // 如果对象带有ReactiveFlags.SKIP标记或者对象不可扩展，代表不可以代理
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID
    : // 否咋调用targetMap函数，判断是否可以代理，以及将来采用何种handlers进行代理
      targetTypeMap(toRawType(value)) // toRawType 返回Object, Array, Map, Set, WeakMap, WeakSet
}

// only unwrap nested ref
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>

/**
 * Creates a reactive copy of the original object.
 *
 * The reactive conversion is "deep"—it affects all nested properties. In the
 * ES2015 Proxy based implementation, the returned proxy is **not** equal to the
 * original object. It is recommended to work exclusively with the reactive
 * proxy and avoid relying on the original object.
 *
 * A reactive object also automatically unwraps refs contained in it, so you
 * don't need to use `.value` when accessing and mutating their value:
 *
 * ```js
 * const count = ref(0)
 * const obj = reactive({
 *   count
 * })
 *
 * obj.count++
 * obj.count // -> 1
 * count.value // -> 1
 * ```
 */
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.

  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    // target 存在 并且目标对象已经是readonly型的proxy对象，直接返回
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}

/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
// 返回一个shallow类型的proxy对象,shallow意‘浅的’，即当通过触发get返回的值是个对象时
// 该方法不会将这个对象转换一个proxy对象，而是直接将他返回。
export function shallowReactive<T extends object>(target: T): T {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  )
}

type Primitive = string | number | boolean | bigint | symbol | undefined | null
type Builtin = Primitive | Function | Date | Error | RegExp
export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
        : T extends Set<infer U>
          ? ReadonlySet<DeepReadonly<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<DeepReadonly<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<DeepReadonly<U>>
              : T extends Promise<infer U>
                ? Promise<DeepReadonly<U>>
                : T extends {}
                  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                  : Readonly<T>

/**
 * Creates a readonly copy of the original object. Note the returned copy is not
 * made reactive, but `readonly` can be called on an already reactive object.
 */
// 返回一个只读的proxy对象，即不能删除或者修改，添加原始对象上的属性
//
export function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>> {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  )
}

/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
// 返回一个不能修改,删除，添加属性（readonly）
// 通过get返回的值如果是个对象,但不执行嵌套对象的深度只读转换
export function shallowReadonly<T extends object>(
  target: T
): Readonly<{ [K in keyof T]: UnwrapNestedRefs<T[K]> }> {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  )
}

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    // 如果不是对象，即不是Object,Array,Map,Set,WeakMap,WeakSet类型的，就不可以代理，直接返回
    if (__DEV__) {
      // 开发环境下给出警告
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  // 如果target已经是个proxy对象，那么就直接返回该对象
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    // target 不是只读，并且target已经是reactive
    // 返回target本身
    return target
  }
  // target already has corresponding Proxy
  // 如果target已经存在对应的代理对象，则找到对应的代理对象并返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    // target 已经被proxy代理，返回代理对象
    return existingProxy
  }
  // only a whitelist of value types can be observed.
  // // 获取target的类型，如果其为INVALID，说明不能进行代理，所以直接返回target
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  // 根据target生成对应的proxy对象，并把他存储在proxyMap中
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers // 区分 object array和map,set,weakMap,weakSet
  )
  proxyMap.set(target, proxy)
  return proxy
}
// 检查对象是否是由 reactive 创建的响应式代理
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    // 如果该代理是 readonly 创建的，但包裹了由 reactive 创建的另一个代理，它也会返回 true
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}
// 检查对象是否是由 readonly 创建的只读代理。
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}
// 检查对象是否是由 reactive 或 readonly 创建的 proxy。
export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}
// 返回 reactive 或 readonly 代理的原始对象
export function toRaw<T>(observed: T): T {
  return (
    (observed && toRaw((observed as Target)[ReactiveFlags.RAW])) || observed
  )
}
// 标记一个对象，使其永远不会转换为 proxy。返回对象本身
export function markRaw<T extends object>(value: T): T {
  def(value, ReactiveFlags.SKIP, true)
  return value
}
