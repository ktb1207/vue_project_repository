module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: ['plugin:vue/essential', '@vue/standard', 'eslint:recommended'],
  rules: {
    // 禁止
    'no-await-in-loop': 2, // 禁止在循环中出现 await
    'no-cond-assign': 2, // 禁止条件表达式中出现赋值操作符
    'no-dupe-args': 2, // 禁止 function 定义中出现重名参数
    'no-dupe-keys': 2, // 禁止对象字面量中出现重复的 key
    'no-duplicate-case': 2, // 禁止出现重复的 case 标签
    'no-empty': 2, // 禁止出现空语句块
    'no-extra-parens': 2, // 禁止不必要的括号
    'no-extra-semi': 2, // 禁止不必要的分号
    'no-else-return': 2, // 禁止在 else 前有 return
    'no-empty-function': 2, // 禁止出现空函数
    'no-multi-spaces': 2, // 禁止出现多个空格
    'no-unreachable': 2, // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
    'no-delete-var': 2, // 禁止删除变量
    'no-label-var': 2, // 不允许标签与变量同名
    'no-undef': 2, // 禁用未声明的变量
    'no-unused-vars': 2, // 禁止未使用过的变量
    // 要求
    'require-await': 2, // 禁止使用不带 await 表达式的 async 函数
    'default-case': 2, // switch语句最后必须有default
    eqeqeq: 2, // 必须使用全等
    'global-require': 2, // 强制在模块顶部调用 require()
    quotes: [2, 'single'], // 单引号
    indent: [0, 2], //  2空格 缩进
    semi: [2, 'always'], // 在语句末尾使用分号
    'comma-dangle': [2, 'never'], //  (默认) 禁用拖尾逗号
    camelcase: [2, { properties: 'always' }], // 强制使用骆驼拼写法命名约定
    // 建议
    'block-spacing': [1, 'always'], // 强制在代码块中开括号前和闭括号后有空格
    'brace-style': [1, '1tbs'], // 强制在代码块中使用一致的大括号风格
    // 忽略
    'vars-on-top': 0, // 所有的 var 声明出现在它们所在的作用域顶部
    'space-before-function-paren': [0, 'always'], // function的左括号之前使用一致的空格
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: {
        mocha: true
      }
    }
  ]
};
