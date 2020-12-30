module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'off',
    quotes: [2, 'single'], // 单引号
    indent: [2, 2], //  2空格 缩进
    'require-await': 2, // 禁止使用不带 await 表达式的 async 函数
    'default-case': 2, // switch语句最后必须有default
    semi: [2, 'always'], // 在语句末尾使用分号
    eqeqeq: 2, // 必须使用全等
  },
};
