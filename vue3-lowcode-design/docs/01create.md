### 创建工程问题记录

> 1. tsx使用css module

vscode 引入style样式获得样式类名提示

- 安装 npm install typescript-plugin-css-modules --save-dev
- tsconfig.json配置，在compilerOptions下添加：
```js
"plugins": [
      {
        "name": "typescript-plugin-css-modules"
      }
    ]
```

- vscode开启提示

项目根目录创建.vscode文件夹，添加settings.json
```js
"typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
```