/**
 * event bus 发布订阅设计模式
 *
 **/

interface QueueFnType {
  [propName: string]: Function;
}

class Bus {
  private list: {
    [key: string]: Array<QueueFnType>;
  };

  constructor() {
    this.list = {};
  }

  // 订阅
  $on(name: string, fnId: string, fn: Function) {
    const createFn: {
      [propName: string]: any;
    } = {};
    this.list[name] = this.list[name] || [];
    createFn[fnId] = fn;
    this.list[name].push(createFn);
  }

  // 发布
  $emit(name: string, data?: any) {
    if (this.list[name]) {
      // 依次通知执行
      this.list[name].forEach((ob) => {
        Object.values(ob).forEach((fn) => fn(data));
      });
    }
  }

  // 取消订阅
  $off(name: string, fnId: string) {
    if (this.list[name]) {
      this.list[name].forEach((item, index) => {
        if (Object.keys(item).includes(fnId)) {
          this.list[name].splice(index, 1);
        }
      });
    }
  }
}

const EventBus = new Bus();

export { EventBus };
