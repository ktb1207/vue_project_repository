/**
 * 文件说明：
 * vue2的响应式原理，主要通过Object.defineproperty,Watcher,Deps[dep,dep]实现
 *
 * 为了解决vue2的问题，依赖收集（即添加观察者/通知观察者）模块单独出来，就是现在的effect
 *
 * 提供了三个函数主要函数：effect/track/trigger。
 *
 * effect是将传入的函数转化为reactiveEffect格式的函数
 *
 * track主要功能是将reactiveEffect添加为target[key]的观察者
 *
 * trigger主要功能是通知target[key]的观察者（将观察者队列函数一一取出来执行）
 *
 * */

import { TrackOpTypes, TriggerOpTypes } from './operations'
import { EMPTY_OBJ, isArray, isIntegerKey, isMap } from '@vue/shared'

// The main WeakMap that stores {target -> key -> dep} connections.
// Conceptually, it's easier to think of a dependency as a Dep class
// which maintains a Set of subscribers, but we simply store them as
// raw Sets to reduce memory overhead.
type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export interface ReactiveEffect<T = any> {
  (): T
  _isEffect: true
  id: number
  active: boolean
  raw: () => T
  deps: Array<Dep>
  options: ReactiveEffectOptions
  allowRecurse: boolean
}

export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: (job: ReactiveEffect) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
  allowRecurse?: boolean
}

export type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
} & DebuggerEventExtraInfo

export interface DebuggerEventExtraInfo {
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

export const ITERATE_KEY = Symbol(__DEV__ ? 'iterate' : '')
export const MAP_KEY_ITERATE_KEY = Symbol(__DEV__ ? 'Map key iterate' : '')

export function isEffect(fn: any): fn is ReactiveEffect {
  return fn && fn._isEffect === true
}
// effect是将传入的函数转化为reactiveEffect格式的函数
/**
 * effct使用示例
 * import {reactive, effect, computed} from "@vue/reactivity";
 * 
 * const state = reactive({
    name: "lihb",
    age: 18,
    arr: [1, 2, 3]
  });
 * 
 * console.log(state); // 这里返回的是Proxy代理后的对象
 * 
 * effect(() => {
    console.log("effect run");
    console.log(state.name); // 每当name数据变化将会导致effect重新执行
  });
 * 
 * state.name = "vue"; // 数据发生变化后会触发使用了该数据的effect重新执行
 * 
 * */

/**
 * effect函数作用：相当于watch
 * 1.当我们修改数据的时候，能够触发传入effect的回调函数执行。
 * 2.所谓响应式的effect，就是该effect在执行的时候会在取值之前将自己放入到effectStack收到栈顶，同时将自己标记为activeEffect，以便进行依赖收集与reactive进行关联。
 *
 * */

const effectStack: ReactiveEffect[] = [] // 如果存在多个effect，则依次放入栈中
let activeEffect: ReactiveEffect | undefined // // 存放当前执行的effect
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  if (isEffect(fn)) {
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options) // // 返回一个响应式的effect函数
  if (!options.lazy) {
    // // 如果不是计算属性的effect，那么会立即执行该effect
    effect()
  }
  return effect
}

export function stop(effect: ReactiveEffect) {
  if (effect.active) {
    cleanup(effect)
    if (effect.options.onStop) {
      effect.options.onStop()
    }
    effect.active = false
  }
}

let uid = 0

function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(): unknown {
    if (!effect.active) {
      return options.scheduler ? undefined : fn()
    }
    if (!effectStack.includes(effect)) {
      // 防止不停的更改属性导致死循环
      cleanup(effect)
      try {
        enableTracking()
        // 在取值之前将当前effect放到栈顶
        effectStack.push(effect)
        // 并标记为activeEffect
        activeEffect = effect
        // 执行effect的回调就是一个取值的过程
        return fn()
      } finally {
        // 从effectStack栈顶将自己移除
        effectStack.pop()
        resetTracking()
        // 将effectStack的栈顶元素标记为activeEffect
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  } as ReactiveEffect
  effect.id = uid++
  effect.allowRecurse = !!options.allowRecurse
  effect._isEffect = true
  effect.active = true
  effect.raw = fn
  effect.deps = [] // 依赖了哪些属性，哪些属性变化了需要执行当前effect
  effect.options = options
  return effect
}

function cleanup(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}

let shouldTrack = true
const trackStack: boolean[] = []

export function pauseTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = false
}

export function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

export function resetTracking() {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}
// track主要功能是将reactiveEffect添加为target[key]的观察者
export function track(target: object, type: TrackOpTypes, key: unknown) {
  // activeEffect 为空，代表没有依赖，直接返回
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  // targetMap 依赖管理中心，用于收集依赖和触发依赖
  // targetMap 为每个 target 建立一个 map
  // 每个 target 的 key 对应着一个 dep
  // 然后用 dep 来收集依赖函数，当监听的 key 值发生变化时，触发 dep 中的依赖函数
  // 类似于这样
  // targetMap(weakmap) = {
  //     target1(map): {
  //       key1(dep): (fn1,fn2,fn3...)
  //       key2(dep): (fn1,fn2,fn3...)
  //     },
  //     target2(map): {
  //       key1(dep): (fn1,fn2,fn3...)
  //       key2(dep): (fn1,fn2,fn3...)
  //     },
  // }

  // 根据target对象取出当前target对应的depsMap结构
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 第一次收集依赖可能不存在
    targetMap.set(target, (depsMap = new Map()))
  }
  // 根据key取出对应的用于存储依赖的Set集合
  let dep = depsMap.get(key)
  if (!dep) {
    // 第一次可能不存在
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    // 将当前effect放到依赖集合中
    dep.add(activeEffect)
    // 一个effect可能使用到了多个key，所以会有多个dep依赖集合
    activeEffect.deps.push(dep)
    if (__DEV__ && activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
  }
}

// 数据发生变化的时候，触发依赖的effect执行
// trigger主要功能是通知target[key]的观察者（将观察者队列函数一一取出来执行）
/**
 * 说明：
 * 1.触发依赖更新，当修改值的时候，也是通过target对象从全局的WeakMap对象中取出对应的depMap对象，然后根据修改的key取出对应的dep依赖集合，并遍历该集合中的所有effect，并执行effect。
 *
 * 2.每次effect执行，都会重新将当前effect放到栈顶
 *
 * 3.然后执行effect回调再次取值的时候，再一次执行track收集依赖
 *
 * 4.不过第二次track的时候，对应的依赖集合中已经存在当前effect了，所以不会再次将当前effect添加进去了
 * */

export function trigger(
  target: object,
  type: TriggerOpTypes, // set add delete clear
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    // 如果没有收集过依赖，直接返回
    return
  }
  // // 存储依赖的effect
  const effects = new Set<ReactiveEffect>() // [fn1,fn2,fn3]
  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        if (effect !== activeEffect || effect.allowRecurse) {
          effects.add(effect)
        }
      })
    }
  }
  // 在值被清空前，往相应的队列添加 target 所有的依赖
  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    depsMap.forEach(add)
  } else if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= (newValue as number)) {
        add(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      add(depsMap.get(key))
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          add(depsMap.get('length'))
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          add(depsMap.get(ITERATE_KEY))
        }
        break
    }
  }

  const run = (effect: ReactiveEffect) => {
    if (__DEV__ && effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      })
    }
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  effects.forEach(run)
}
