// This entry is the "full-build" that includes both the runtime
// and the compiler, and supports on-the-fly compilation of the template option.
import { initDev } from './dev'
import { compile, CompilerOptions, CompilerError } from '@vue/compiler-dom'
import { registerRuntimeCompiler, RenderFunction, warn } from '@vue/runtime-dom'
import * as runtimeDom from '@vue/runtime-dom'
import { isString, NOOP, generateCodeFrame, extend } from '@vue/shared'
import { InternalRenderFunction } from 'packages/runtime-core/src/component'
console.log('dev:' + __DEV__)
if (__DEV__) {
  // dev环境提示，生产环境引入生产包
  // vue dev tool formatter
  initDev()
}
// 缓存编译结果
const compileCache: Record<string, RenderFunction> = Object.create(null)
// 注入compile方法
function compileToFunction(
  template: string | HTMLElement, // 模板
  options?: CompilerOptions // 编译配置
): RenderFunction {
  // 如果 template 不是字符串
  if (!isString(template)) {
    if (template.nodeType) {
      // 则认为是一个 DOM 节点，获取 innerHTML
      template = template.innerHTML
    } else {
      __DEV__ && warn(`invalid template option: `, template)
      return NOOP
    }
  }
  // template 编译缓存，有缓存直接返回
  const key = template
  const cached = compileCache[key]
  if (cached) {
    return cached
  }
  // 如果是 ID 选择器，这获取 DOM 元素后，取 innerHTML
  if (template[0] === '#') {
    const el = document.querySelector(template)
    if (__DEV__ && !el) {
      warn(`Template element not found or is empty: ${template}`)
    }
    // __UNSAFE__
    // Reason: potential execution of JS expressions in in-DOM template.
    // The user must make sure the in-DOM template is trusted. If it's rendered
    // by the server, the template should not contain any user data.
    template = el ? el.innerHTML : ``
  }
  // 调用 compile 获取 render code
  const { code } = compile(
    template,
    extend(
      {
        hoistStatic: true,
        onError: __DEV__ ? onError : undefined,
        onWarn: __DEV__ ? e => onError(e, true) : NOOP
      } as CompilerOptions,
      options
    )
  )

  function onError(err: CompilerError, asWarning = false) {
    const message = asWarning
      ? err.message
      : `Template compilation error: ${err.message}`
    const codeFrame =
      err.loc &&
      generateCodeFrame(
        template as string,
        err.loc.start.offset,
        err.loc.end.offset
      )
    warn(codeFrame ? `${message}\n${codeFrame}` : message)
  }

  // The wildcard import results in a huge object with every export
  // with keys that cannot be mangled, and can be quite heavy size-wise.
  // In the global build we know `Vue` is available globally so we can avoid
  // the wildcard object.
  // 将 render code 转化为 function
  const render = (__GLOBAL__
    ? new Function(code)()
    : new Function('Vue', code)(runtimeDom)) as RenderFunction

  // mark the function as runtime compiled
  ;(render as InternalRenderFunction)._rc = true
  // 返回 render 方法的同时，将其放入缓存
  return (compileCache[key] = render)
}
// 依赖注入编译函数至runtime
registerRuntimeCompiler(compileToFunction)

export { compileToFunction as compile }
export * from '@vue/runtime-dom'

/**
 *
 * 流程导读
 *
 * 1.依赖注入编译函数至runtime
 *
 * 2.runtime调用编译函数compileToFunction
 *
 * 3.compileToFunction调用compiler函数
 *
 * 4.返回包含code的编译结果
 *
 * 5.将code作为参数传入Function的构造函数，将生成的函数赋值给render变量
 *
 * 6.将render函数作为编译结果返回
 * */
