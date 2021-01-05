### 环境准备

### 1. 调试环境准备

- 项目地址：https://github.com/vuejs/vue
- 迁出项目：git clone https://github.com/vuejs/vue.git
- 版本号：2.6.10

### 2. 测试环境搭建

- 安装依赖：npm install
- 安装打包工具 rollup: npm i rollup -g
- 修改 package.json scripts 命令脚本，增加--sourcemap:
- 脚本：confir.js 后增加
  `"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",`

### 3. 目录结构

- dist:最终打包输出目录
- src: 源码目录
  - compiler: 编译器
  - core: 核心模块
  - server: 服务端渲染相关
  - sfc 单文件解析器
- examples: 测试文件目录

### 4. 打包输出文件格式说明

- cjs: `*.common.*.js`,适合老版本打包器，如 webpack1,browserfiry
- esm: `*.esm.*.js`,适合现代打包器，如 webpack2+
- umd: `vue.js`,兼容 cjs 和 amd（浏览器 scrips 引入）
- runtime: `*.runtime.*.js`,仅包含运行时，没有编译器。
