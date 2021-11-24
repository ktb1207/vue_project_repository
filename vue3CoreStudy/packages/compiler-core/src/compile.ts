import { CompilerOptions } from './options'
import { baseParse } from './parse'
import { transform, NodeTransform, DirectiveTransform } from './transform'
import { generate, CodegenResult } from './codegen'
import { RootNode } from './ast'
import { isString, extend } from '@vue/shared'
import { transformIf } from './transforms/vIf'
import { transformFor } from './transforms/vFor'
import { transformExpression } from './transforms/transformExpression'
import { transformSlotOutlet } from './transforms/transformSlotOutlet'
import { transformElement } from './transforms/transformElement'
import { transformOn } from './transforms/vOn'
import { transformBind } from './transforms/vBind'
import { trackSlotScopes, trackVForSlotScopes } from './transforms/vSlot'
import { transformText } from './transforms/transformText'
import { transformOnce } from './transforms/vOnce'
import { transformModel } from './transforms/vModel'
import { transformFilter } from './compat/transformFilter'
import { defaultOnError, createCompilerError, ErrorCodes } from './errors'

export type TransformPreset = [
  NodeTransform[],
  Record<string, DirectiveTransform>
]

export function getBaseTransformPreset(
  prefixIdentifiers?: boolean
): TransformPreset {
  return [
    [
      transformOnce,
      transformIf,
      transformFor,
      ...(__COMPAT__ ? [transformFilter] : []),
      ...(!__BROWSER__ && prefixIdentifiers
        ? [
            // order is important
            trackVForSlotScopes,
            transformExpression
          ]
        : __BROWSER__ && __DEV__
          ? [transformExpression]
          : []),
      transformSlotOutlet,
      transformElement,
      trackSlotScopes,
      transformText
    ],
    {
      on: transformOn,
      bind: transformBind,
      model: transformModel
    }
  ]
}

// we name it `baseCompile` so that higher order compilers like\
/**
 * baseCompile 说明
 *
 * 1.生成 AST 抽象语法树
 * 2.调用 transform 对 每个 AST 节点进行处理，例如转换vOn、v-if、v-for 等指令
 * 3.调用generate 函数生成之前提及的代码字符串code并返回
 *
 * */

/**
 * 静态提升
 * 当 Vue 的编译器在编译过程中，发现了一些不会变的节点或者属性，就会给这些节点打上标记；
 * 然后编译器在生成代码字符串的过程中，会发现这些静态的节点，并提升它们；
 * 将他们序列化成字符串，以此减少编译及渲染成本
 *
 * baseParse： template字符串创建AST结构对象，并标记静态节点、属性等信息
 * transform阶段，会判断上一步创建AST过程中，有没有静态标记，如果存在静态标记，则对静态标记节点和属性进行提升
 *
 * const _hoisted_1 = /#__PURE__/_createStaticVNode("<div><span class=\"foo\"></span><span class=\"foo\"></span><span class=\"foo\"></span><span class=\"foo\"></span><span class=\"foo\"></span></div>", 1)
 *
 * */

export function baseCompile(
  template: string | RootNode,
  options: CompilerOptions = {}
): CodegenResult {
  const onError = options.onError || defaultOnError
  const isModuleMode = options.mode === 'module'
  /* istanbul ignore if */
  if (__BROWSER__) {
    if (options.prefixIdentifiers === true) {
      onError(createCompilerError(ErrorCodes.X_PREFIX_ID_NOT_SUPPORTED))
    } else if (isModuleMode) {
      onError(createCompilerError(ErrorCodes.X_MODULE_MODE_NOT_SUPPORTED))
    }
  }

  const prefixIdentifiers =
    !__BROWSER__ && (options.prefixIdentifiers === true || isModuleMode)
  if (!prefixIdentifiers && options.cacheHandlers) {
    onError(createCompilerError(ErrorCodes.X_CACHE_HANDLER_NOT_SUPPORTED))
  }
  if (options.scopeId && !isModuleMode) {
    onError(createCompilerError(ErrorCodes.X_SCOPE_ID_NOT_SUPPORTED))
  }
  // 解析 html，转化为 ast
  // 判断 template 模板是否为字符串，如果是的话则会对字符串进行解析，否则直接将 template 作为 AST
  const ast = isString(template) ? baseParse(template, options) : template
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset(
    prefixIdentifiers
  )
  // 优化 ast，标记静态节点
  transform(
    ast,
    extend({}, options, {
      prefixIdentifiers,
      nodeTransforms: [
        ...nodeTransforms,
        ...(options.nodeTransforms || []) // user transforms
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {} // user transforms
      )
    })
  )
  // 将 ast 转化为可执行代码
  // generate函数作用
  /**
   * 1.返回代码字符串
   * 2.配合 Function 类的构造函数生成 render 渲染函数
   *
   *
   * */

  return generate(
    ast,
    extend({}, options, {
      prefixIdentifiers
    })
  )
}
