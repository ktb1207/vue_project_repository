import { effect, ReactiveEffect, trigger, track } from './effect'
import { TriggerOpTypes, TrackOpTypes } from './operations'
import { Ref } from './ref'
import { isFunction, NOOP } from '@vue/shared'
import { ReactiveFlags, toRaw } from './reactive'

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = (ctx?: any) => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

/**
 * 流程分析
 *
 * 1.首先构造函数在初始化的时候使用了effect函数对传入getter进行了一层包装，effect函数的作用就是将传入的函数变成可响应式的副作用函数
 *
 * 2.当计算属性依赖的属性发生变化的时候，回执行包装getter函数的effect
 *
 * 3.但是因为配置了scheduler函数，所以真正执行的是scheduler函数
 *
 * 4.在scheduler函数中并没有执行计算属性的getter函数求取新值,而是将_dirty设置为false,然后通知依赖计算属性的副作用函数进行更新
 *
 * 5.当依赖计算属性的副作用函数收到通知的时候就会访问计算属性的get函数，此时会根据_dirty值来确定是否需要重新计算。
 * */

class ComputedRefImpl<T> {
  // // 缓存结果
  private _value!: T
  // // 重新计算开关
  private _dirty = true

  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true;
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    // // 对传入的getter函数进行包装
    this.effect = effect(getter, {
      lazy: true,
      // // 调度执行
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          // 派发通知
          trigger(toRaw(this), TriggerOpTypes.SET, 'value')
        }
      }
    })

    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    // // 是否需要重新计算
    if (self._dirty) {
      self._value = this.effect()
      self._dirty = false
    }
    // // 访问的时候进行依赖收集 此时收集的是访问这个计算属性的副作用函数
    track(self, TrackOpTypes.GET, 'value')
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
// 函数重载的方式允许computed函数接受两种类型的参数：第一种是一个getter函数, 第二种是一个带get和set的对象
export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  if (isFunction(getterOrOptions)) {
    // 第一种是一个getter函数
    // setter函数开发环境包装提示
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(
    getter,
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set
  ) as any
}
