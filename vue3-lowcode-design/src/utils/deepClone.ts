// 可遍历tag
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';
// 不可遍历tag
const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

function isObject(target: any): boolean {
  const type = typeof target;
  return type !== null && (type === 'object' || type === 'function');
}

function getType(target: any): string {
  return Object.prototype.toString.call(target);
}

function getInit(target: any) {
  const Ctor = target.constructor;
  return new Ctor();
}

function cloneReg(target: any) {
  const reFlags = /\w*$/;
  const result = new target.constructor(target.source, reFlags.exec(target));
  result.lastIndex = target.lastIndex;
  return result;
}

function cloneSymbol(target: any) {
  return Object(Symbol.prototype.valueOf.call(target));
}

function cloneFunction(target: any) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = target.toString();
  if (target.prototype) {
    console.log('普通函数');
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      console.log('匹配到函数体：', body[0]);
      if (param) {
        const paramArr = param[0].split(',');
        console.log('匹配到参数：', paramArr);
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}

function cloneOtherType(target: any, type: string) {
  const Ctor = target.constructor;
  switch (type) {
    case boolTag:
    case dateTag:
    case numberTag:
    case stringTag:
    case errorTag:
      return new Ctor(target);
    case regexpTag:
      return cloneReg(target);
    case symbolTag:
      return cloneSymbol(target);
    case funcTag:
      return cloneFunction(target);
    default:
      return null;
  }
}

export function deepClone<T>(target: T, map = new WeakMap()): T {
  if (!target) {
    return target;
  }
  // 原始类型直接返回
  if (!isObject(target)) {
    return target;
  }
  // 获取target类型
  const type = getType(target);
  let cloneTarget: any;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target);
  } else {
    return cloneOtherType(target, type);
  }

  // 处理循环引用
  if (map.get(target as Object)) {
    return target;
  }
  map.set(target as Object, cloneTarget);
  // set
  if (type === setTag) {
    (target as unknown as Set<T>).forEach((value) => {
      (cloneTarget as unknown as Set<T>).add(deepClone(value));
    });
    return cloneTarget;
  }
  // map
  if (type === mapTag) {
    (target as unknown as Map<T, T>).forEach((value, key) => {
      cloneTarget.set(key, deepClone(value));
    });
    return cloneTarget;
  }
  // 数组和object
  for (const key in target) {
    cloneTarget[key] = deepClone(target[key], map);
  }

  return cloneTarget;
}
