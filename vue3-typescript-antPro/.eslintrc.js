module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    '@typescript-eslint/no-empty-function': 'off', // 允许空function
    '@typescript-eslint/no-var-requires': 'off', // 允许require引入
    '@typescript-eslint/no-explicit-any': 'off', // 允许ts泛型any
    '@typescript-eslint/no-unused-vars': 'off', // 允许空var
    semi: ['error', 'always'], // 在语句末尾使用分号
    quotes: ['error', 'single'], // 单引号
    indent: ['error', 2, { SwitchCase: 1 }], // 2空格缩进
    eqeqeq: 2, // 全等===
    'require-await': 2, // 禁止使用不带 await 表达式的 async 函数
    'default-case': 2 // switch语句最后必须有default
  }
};
