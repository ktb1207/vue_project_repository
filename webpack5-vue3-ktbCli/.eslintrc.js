module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  parserOptions: {
    // ECMAScript 版本
    ecmaVersion: 2020,
    ecmaFeatures: {
      // 启用 JSX
      jsx: true
    }
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended', // eslint-plugin-prettier
    'eslint:recommended',
    '@vue/prettier',
    'prettier' // eslint-config-prettier
  ]
};
