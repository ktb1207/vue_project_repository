### 关于webpack5新特性
---

[一、build自动删除dist文件]()
在之前，打包前需要清空上次打包文件，需要使用第三方插件clean-webpack-plugin
```js
// vue.config.js
//打包前自动清空dist目录的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      return {
        plugins: [
          new CleanWebpackPlugin()
        ]
      }
    }
  }
}
```

[二、持久化缓存]()

Webpack5 之前，我们会使用 cache-loader[12] 缓存一些性能开销较大的 loader

webpack5内置缓存，加速二次构建,默认开发模式下设置为：type:memory,生产模式被禁用。


[三、不再为Node.js 模块自动引用Polyfills]()
在 Webpack 4 或之前的版本中，任何项目引用 Node.js 内置模块都会自动添加 Polyfills

[四、对静态资源的处理能力，内置Asset Modules]()

在 Webpack5 之前，我们一般都会使用以下几个 loader 来处理一些常见的静态资源，比如 PNG 图片、SVG 图标等等，他们的最终的效果大致如下所示：

- raw-loader：允许将文件处理成一个字符串导入
- file-loader：将文件打包导到输出目录，并在 import 的时候返回一个文件的 URI
- url-loader：当文件大小达到一定要求的时候，可以将其处理成 base64 的 URIS ，内置 file-loader

> 新

Webpack5 提供了内置的静态资源构建能力，我们不需要安装额外的 loader，仅需要简单的配置就能实现静态资源的打包和分目录存放

```js
module.exports = {
    ...,
    module: {
      rules: [
          {
            test: /\.(png|jpg|svg|gif)$/,
            type: 'asset/resource',
            generator: {
                filename: 'assets/[hash:8].[name][ext]',
            },
        },
      ],
    },
}
// 其中 type 取值如下几种：
// asset/source ——功能相当于 raw-loader。
// asset/inline——功能相当于 url-loader，若想要设置编码规则，可以在 generator 中设置 dataUrl
// asset/resource——功能相当于 file-loader
// asset—— 默认会根据文件大小来选择使用哪种类型，当文件小于 8 KB 的时候会使用 asset/inline，否则会使用 asset/resource
```

[五、内置 Web Worker 构建能力]()

[六、深度 Tree Shaking 能力支持]()

[七、更好的打包文件名输出]()

Webpack5 之前，文件打包后的名称是通过 ID 顺序排列的，一旦后续有一个文件进行了改动，那么必将造成后面的文件打包出来的文件名产生变化，即使文件内容没有产生改变。因此会造成资源的缓存失效。

Webpack5 有着更友好的长期缓存能力支持，其通过 hash 生成算法，为打包后的 modules 和 chunks 计算出一个短的数字 ID ，这样即使中间删除了某一个文件，也不会造成大量的文件缓存失效

[八、顶层await(实验性)]()

Webpack5 还支持 Top Level Await。即允许开发者在 async 函数外部使用 await 字段
它就像巨大的 async 函数，原因是 import 它们的模块会等待它们开始执行它的代码，因此，这种省略 async 的方式只有在顶层才能使用

```js
// webpack.config.js
module.exports = {
    ...,
    experiments: {
        topLevelAwait: true,
    },
}
```

[九、生产环境自动压缩]()
生产环境下默认使用 TerserPlugin