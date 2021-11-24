/**
 * compile核心模块说明
 *
 * compiler-core 的一个核心作用就是将字符串转换成 抽象对象语法树AST，将非结构化的字符串数据，转换成结构化的 AST
 *
 * 目录说明：
 * test 测试文件
 * src/ast 语法类型定义
 * src/codegen 将生成的ast转换成render字符串
 * src/compiler 主要有一个baseCompile,用来编译模板文件
 * src/error 定义compiler错误类型
 * src/index 入口文件
 * src/parse 将模板字符串转换成AST
 * src/runtimeHelper 生成code的时候定义常量对应关系
 * src/transform 处理AST中的vue特有语法，如v-on,v-if的解析
 *
 * */

export { baseCompile } from './compile'

// Also expose lower level APIs & types
export {
  CompilerOptions,
  ParserOptions,
  TransformOptions,
  CodegenOptions,
  HoistTransform,
  BindingMetadata,
  BindingTypes
} from './options'
export { baseParse, TextModes } from './parse'
export {
  transform,
  TransformContext,
  createTransformContext,
  traverseNode,
  createStructuralDirectiveTransform,
  NodeTransform,
  StructuralDirectiveTransform,
  DirectiveTransform
} from './transform'
export { generate, CodegenContext, CodegenResult } from './codegen'
export {
  ErrorCodes,
  CoreCompilerError,
  CompilerError,
  createCompilerError
} from './errors'

export * from './ast'
export * from './utils'
export * from './runtimeHelpers'

export { getBaseTransformPreset, TransformPreset } from './compile'
export { transformModel } from './transforms/vModel'
export { transformOn } from './transforms/vOn'
export { transformBind } from './transforms/vBind'
export { noopDirectiveTransform } from './transforms/noopDirectiveTransform'
export { processIf } from './transforms/vIf'
export { processFor, createForLoopParams } from './transforms/vFor'
export {
  transformExpression,
  processExpression
} from './transforms/transformExpression'
export {
  buildSlots,
  SlotFnBuilder,
  trackVForSlotScopes,
  trackSlotScopes
} from './transforms/vSlot'
export {
  transformElement,
  resolveComponentType,
  buildProps
} from './transforms/transformElement'
export { processSlotOutlet } from './transforms/transformSlotOutlet'
export { generateCodeFrame } from '@vue/shared'

// v2 compat only
export {
  checkCompatEnabled,
  warnDeprecation,
  CompilerDeprecationTypes
} from './compat/compatConfig'
