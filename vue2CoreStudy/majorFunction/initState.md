### 关于initState源码分析
---
定义：vue\src\core\instance\state.js
初始化调用：vue\src\core\instance\init.js
```
// 初始化 props,methods,data,computed,watch,
initState(vm)
```
源码：
```
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```