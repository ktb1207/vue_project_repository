### 关于前端开发规范说明
---

[一、强制性]()

+ 组件名应为多个单词组成（驼峰格式），以大写字母开头
+ 避免v-for和v-if一同使用
+ 组件样式合理设置使用scoped作用域
+ template模板自定义组件名采用大小写(驼峰)格式
+ 需要为自定义组件提供emits项，提供对外方法回调
+ 自定义构造函数采用首字母大写驼峰命名
+ 自定义类hook函数以use开头

[二、建议性]()

+ 避免类型推论
```js
// 错误
const value = ref(0);
// 正确
const value = ref<string>(0);
```

+ 变量命名采用驼峰命名格式，私有变量以_开头

+ 函数名小写并采用驼峰格式命名，为方法提供合理注释说明
```js

/**
 * @describe 加法运算方法
 * @param {num1} num1参数说明
 * @param {num2} num2参数说明
 * @return 返回结果说明
 * 
*/
function add(num1: number, num2: number): number {
  return num1 + num2;
}
```