/* @flow */
/*
  用于构建 同时包含编译器和运行时 的全功能文件
  作用：将 Vue 的 html 模板编译成 render 函数。
  文件里的关键代码是为 Vue 的 prototype 扩展了一个 $mount 方法，并将模板编译相关的工作都封装在了这个 $mount 方法里。
*/

/*

*/

import config from "core/config";
import { warn, cached } from "core/util/index";
import { mark, measure } from "core/util/perf";

import Vue from "./runtime/index";
import { query } from "./util/index";
import { compileToFunctions } from "./compiler/index";
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
} from "./util/compat";
// 根据id返回dom内容
const idToTemplate = cached((id) => {
  const el = query(id);
  return el && el.innerHTML;
});

const mount = Vue.prototype.$mount;
// 把 Vue 原型上原本挂载的运行时版本的渲染挂载函数进行重写
// 重写的原因主要因为这不但是一个运行时的版本, 同时也担作着编译模版转化为 render 函数的作用
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el);
  /* istanbul ignore if */
  // 这里的判断挂载点是否是 < body > 元素或者是 < html > 元素, 在生产环境下会报出警. 不要挂载到 html 和 body 元素上, 对其它元素进行替换.
  // 此时的挂载点el只是一个被将要被替换的占位符. 如果此时挂载点为 body 元素或者 html 元素的情况, body 和 html 元素同样会被替换掉, 此时 html 页面则不是一个标准规定的 html 标准体了. 浏览器同样不会对此进行解析.
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }
  // options 是 new Vue(options) 提供的实参 options
  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    // options不存在render函数，则解析template或者el属性，将其转化为render函数

    // 先对 template 选项获取模版, 当既有 template 选项时, 也有 el 选项时,
    // template 则优先作为转化 render 函数的模版, el 则作为实例的挂载点.
    let template = options.template;
    if (template) {
      // 存在template
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        // tempalte 传入的是一个元素节点，直接获取元素的 innerHTML 作为模版
        template = template.innerHTML;
      } else {
        // 如果 template 既不是字符串也不是元素节点并在开发环境下, 会报一个警告
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      // // 如果既没有提供 render 函数，又没有 template 选项，就使用 el 选项
      // 如果只存在 el 选项时, 并没有 template 选项. el 既作为挂载点, 也作为模版
      template = getOuterHTML(el);
    }
    // 获得模板字符串后，编译模板为render函数
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      // 在各种情况下 template 成功获取之后. 通过 compileToFunctions 进行 ast 语法树转换,
      // 得到 render 泻染函数, 赋值到实例的 $options 选项上.
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
      // 挂在渲染函数
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  // options有render函数有则直接调用运行版本的 $mount 函数
  return mount.call(this, el, hydrating);
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  // 如果元素的outerHTML存在
  if (el.outerHTML) {
    // 返回该元素及本身的所有HTML代码
    return el.outerHTML;
  } else {
    // 如果该元素的outerHTML属性不存在
    // 创建一个DIV
    const container = document.createElement("div");
    // 向DIV中添加这个el
    container.appendChild(el.cloneNode(true));
    // 此时返回container的innerHTML就可以得到该元素即本身的HTML代码
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;

export default Vue;
