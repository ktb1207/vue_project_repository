/**
 * @description 关于js纯函数
 *
 * */

/**
 *
 * 定义：
 * a: 一个函数的返回结果只依赖于它的参数
 * b: 执行过程没有副作用
 *
 * 优点：可缓存
 * */

/**
 * demo 1
 *
 * */
const a = 1;
const foo = (b) => a + b;
foo(2); // => 3

// 注解：foo 函数不是一个纯函数，因为它返回的结果依赖于外部变量 a

/**
 * demo 2
 * */

const add = (a, b) => a + b;
add(1, 2); // 3

// 注解：add 是一个纯函数

/**
 * demo 3
 * */

const counter = {
  x: 1
};

const add2 = (obj, b) => {
  obj.x = 3;
  return obj.x + b;
};
add2(counter, 2);

// 注解：add2不是一个纯函数，因为修改了外部值，产生副作用
