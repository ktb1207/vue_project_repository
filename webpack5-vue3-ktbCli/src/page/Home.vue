<template>
  <div>
    <button @click="openPage('Proxy')">Proxy</button> |
    <button @click="openPage('MountSequence')">组件挂载顺序</button> |
    <button @click="openPage('Canvas')">canvas</button> |
    <button @click="openPage('JSErrorAnalyse')">js错误处理分析</button> |
    <button @click="openPage('EchartsMap')">echarts地图</button> | <button @click="testTreeFind">递归测试</button> |
    <button @click="openPage('ArraySort')">数组排序</button> |
    <button @click="openPage('PromiseAsync')">promise/async</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    // 跳转页面
    const openPage = (routerName) => {
      router.push({ name: routerName });
    };
    const treeArr = [
      {
        id: 1,
        name: 'aaa',
        children: [
          {
            id: 11,
            name: 'a-b',
            children: []
          },
          {
            id: 12,
            name: 'a-c',
            children: []
          }
        ]
      },
      {
        id: 2,
        name: 'bbb',
        children: [
          {
            id: 21,
            name: 'b-b',
            children: []
          }
        ]
      },
      {
        id: 3,
        name: 'ccc',
        children: [
          {
            id: 31,
            name: 'c-b',
            children: []
          },
          {
            id: 32,
            name: 'c-c',
            children: []
          }
        ]
      }
    ];

    function getTreeNodeName(arr, id) {
      let r = '';
      for (let i = 0, l = arr.length; i < l; i++) {
        console.log(arr[i].name);
        if (arr[i].id === id) {
          r = arr[i].name;
          break;
        } else {
          if (arr[i].children && arr[i].children.length > 0) {
            r = getTreeNodeName(arr[i].children, id);
          }
        }
      }
      return r;
    }
    //
    const testTreeFind = () => {
      const findName = getTreeNodeName(treeArr, 31);
      console.log('结果：' + findName);
    };
    return {
      openPage,
      testTreeFind
    };
  }
};
</script>
