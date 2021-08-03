/**
 * 函数柯里化
 * 什么是函数柯里化？
 * 定义：函数柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数
 * 优点：
 * 1. 参数复用
 * 2. 延时调用
 * 缺点：
 * 1. 创建大量嵌套作用域和闭包函数会带来花销
 * */

/**
 * 固定参数---封装1
 * */

function createCurrey(fun, args) {
  // 函数参数长度
  var funArgsln = fun.length;
  // 保存调用参数
  args = args || [];
  console.log(args); // [], [1], [1,2]
  return function () {
    const _args = Array.prototype.slice.call(arguments);
    Array.prototype.unshift.apply(_args, args);
    console.log(_args); // [1], [1,2], [1,2,4]
    if (_args.length < funArgsln) {
      return createCurrey.call(this, fun, _args);
    }
    // 参数收集完毕
    fun.apply(this, _args);
  };
}

/**
 * 固定参数---封装2
 */
function createCurryEasy(fun) {
  // 获取函数参数长度
  const argsLength = fun.length;
  const curried = (...args) => {
    if (args.length < argsLength) {
      // 参数不够---继续收集参数，等待执行
      return (...reset) => curried(...args, ...reset);
    }
    // 参数收集完成-调用执行
    return fun(...args);
  };

  return curried;
}

function console(a, b, c) {
  console.log(a, b, c);
}
const _add = createCurrey(console);

_add(1)(2)(4);

const _add2 = createCurryEasy(console);
_add2(7)(8)(9);

/**
 * 经典面试题
 * 实现一个add方法，使得以下调用都可以
 * add(1)(2)(3) = 6;
 * add(1)(2)(3)(4)(5) = 15;
 * add(1, 2, 3)(4) = 10;
 *
 *
 * 说明：这个题目的目的是想让add执行之后返回一个函数能够继续执行，最终运算的结果是所有出现过的参数之和
 *
 * 考察点：
 * 1. 不定参数add(...args)
 * 2. 函数的隐式转换,当我们直接将函数参与其他的计算时，函数会默认调用toString方法
 * -- 我们可以重写函数的toString方法，让函数参与计算时，输出我们想要的结果
 * -- 除此之外，当我们重写函数的valueOf方法也能够改变函数的隐式转换结果
 * -- 当我们同时重写函数的toString方法与valueOf方法时，最终的结果会取valueOf方法的返回结果
 * */

function add() {
  // 第一次执行，定义一个数组用来存储所有参数
  const _args = [].slice.call(arguments);
  // 声明一个函数，利用闭包特性保存_args并收集所有的参数值
  const adder = function () {
    const _adder = function () {
      _args.push(...arguments);
      return _adder;
    };
    _adder.toString = function () {
      return _args.reduce(function (a, b) {
        return a + b;
      });
    };
    return _adder;
  };
  return adder(..._args);
}
console.log(add(1)(2)(3) + 10);
console.log(add(1, 2, 3) + 10);
