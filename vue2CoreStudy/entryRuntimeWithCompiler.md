### src\platforms\web\entry-runtime-with-compiler.js 文件分析

#### 说明：编译器代码入口文件

概述：Vue 项目中的 entry-runtime.js 文件是 Vue 用于构建 仅包含运行时 的源码文件，而 entry-runtime-with-compiler.js 是用于构建 同时包含编译器和运行时 的全功能文件。因此两个文件的差集必然就是编译器实现

#### 作用：

- 文件里的关键代码是为 Vue 的 prototype 扩展了一个 $mount 方法，并将模板编译相关的工作都封装在了这个 $mount 方法里。

```
// 保存运行版本的mount函数
const mount = Vue.prototype.$mount;
// 把 Vue 原型上原本挂载的运行时版本的渲染挂载函数进行重写
// 重写的原因主要因为这不但是一个运行时的版本, 同时也担作着编译模版转化为 render 函数的作用
Vue.prototype.$mount = function () {
  el = el && query(el);
  // 不能挂载到body和html标签
  // 此时的挂载点el只是一个被将要被替换的占位符. 如果此时挂载点为 body 元素或者 html 元素的情况,
  // body 和 html 元素同样会被替换掉, 此时 html 页面则不是一个标准规定的 html 标准体了. 浏览器同样不会对此进行解析.
  if (el === document.body || el === document.documentElement) {
     process.env.NODE_ENV !== "production" &&
       warn(
         `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
       );
     return this;
   }
   // options 是 new Vue(options) 提供的实参 options
   const options = this.$options;

   if (!options.render) {
     // options不存在render函数，则解析template或者el属性，将其转化为render函数
     ...
     // 先对 template 选项获取模版
     // 当既有 template 选项时, 也有 el 选项时,template 则优先作为转化 render 函数的模版, el 则作为实的挂载点.
     let template = options.template;
     if (template) {
       // 存在template
       if (typeof template === "string") {
         // template为string
         if (template.charAt(0) === "#") {
           // 字符串是否以 id 为元素选择器
           // 通过元素选择符获取到元素, 通过获取到的元素拿到内部的 innerHTML
           template = idToTemplate(template);
           /* istanbul ignore if */
           // 生产环境通过 id 选择器并没有获取到对应的元素时. 则会报错一个警告
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
       // 在各种情况下 template 成功获取之后. 通过 compileToFunctions 进行 ast 语法树转换,得到 render 泻染函数, 赋值到实例的 $options 选项上.
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
     }
   }
   // options有render函数有则直接调用运行版本的 $mount 函数
   return mount.call(this, el, hydrating);
}
```

### 核心函数

##### 1. compileToFunctions 函数

作用：将模板片段编译成 render 函数；
compileToFunctions 函数编译模板的过程主要分为三步：

- 将 html 模板解析成抽象语法树(AST)。

```
什么是抽象语法树?
抽象语法树(Abstract Syntax Tree) 是源代码语法结构的抽象表示，并以树这种数据结构进行描述。
AST 属编译原理范畴，有比较成熟的理论基础，因此被广泛运用在对各种程序语言（JavaScript, C, Java, Python等等）的编译处理中。
Vue 同样也是使用 AST 作为中间形式完成对 html 模板的编译。
```

```
构建 AST 的一般过程:
1.词法分析(Lexical Analysis)
2.语法分析(Syntax Analysis)

```

- 对 AST 做优化处理。
- 根据 AST 生成 render 函数。

##### 2. query 函数

作用：通过无素选择器去获取元素
参数: el 可以是 Dom 无素, 也可以是字符串

```
export function query (el: string | Element): Element {
  // 首选判断 el 参数是否是字符串.
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      // 如果获取不到, 开发环境的情况下, 发出'Cannot find element:' + el 警告. 创建一个空的 div 元素返回出去.
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element:' + el
      )
      return document.createElement('div')
    }
    return selected
  } else {
    // el 参数不是字符串的情况下, 不做任何操作直接返回 el 参数
    return el
  }
}
```

##### 3. idToTemplate 函数

作用：传入了一个参数为元素选择器的字符, 内部则是利用 query 函数获取对应转化后的元素. 如果转化成功后返回元素内的 innerHTML

```
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})
```

##### 4. getOuterHTML 函数

```
/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  // 首先判断 el 元素是否有 outerHTML
  // 正常的元素的outerHTML 则是传入 el 元素自身
  // 函数注释可以看到有些元素是没有outerHTML的
  // 此时就需要通过一个 hack 处理
  // 创建一个 container 为 div 的空元素, 深度克隆 el 元素, 通过 appendChild 方法把克隆后的 el 元素添加到 cantainer 容器中, 成为子节点
  // 最后返回的 container 中的innerHTML, 这样的操作等同于获取了元素的 outerHTML.
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}
```

### 总结：

- Vue 项目中的 entry-runtime.js 仅包含运行时的源码文件，在工程化中，通过 vue-loader 等一些插件进行预编译；
- entry-runtime-with-compiler.js 同时包含运行时和编译器，重写 vue.prototype.$mount 方法，用来将模板编译为 render 函数
- new Vue()实例化过程中，挂载分为自动挂载和手动挂载方式：
  - 当存在 el 选项时，会在执行 this.\_init 最后进行内部的 mount 自动挂载
  - new Vue().$mount('#app')为手动挂载
- 实例化 Vue 的时候同时提供了 render、template、el 选项中的多个，则 Vue 使用的优先级是 render > template > el
