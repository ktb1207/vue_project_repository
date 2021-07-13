<template>
  <div class="about">
    <hr />
    <button @click="changeMessage">click</button>
    <div>
      <span>这是原数据</span>
      <p>{{ message }}</p>
    </div>
    <div>
      <span>这是计算数据</span>
      <p>{{ comMessage }}</p>
    </div>
    <hr />
    <button @click="showList">显示列表</button>
    <ul v-show="isShow">
      <li v-for="(item, index) in listArr" :key="index">
        <span>{{ index }}----{{ item }}</span>
      </li>
    </ul>
    <hr />
    <Menus :list-data="menuOneData" border-style="yellow"></Menus>
    <Menus :list-data="menuTwoData"></Menus>
  </div>
</template>

<script>
import Menus from '../components/Menu.vue';
export default {
  name: 'About',
  // 组件属性
  props: [],
  // 声明当前组件依赖组件项
  components: {
    Menus
  },
  // 计算属性
  computed: {
    comMessage() {
      return this.message + 'xxxxxx';
    }
  },
  // 监听器
  watch: {},
  // 组件数据
  data() {
    return {
      message: '这是一条消息',
      isShow: false,
      listArr: ['a', 'b', 'c'],
      menuOneData: [
        {
          id: 1,
          name: '刘德华'
        },
        {
          id: 2,
          name: '任贤齐'
        },
        {
          id: 3,
          name: '张三'
        },
        {
          id: 4,
          name: '忘华'
        }
      ],
      menuTwoData: [
        {
          id: 1,
          name: 'qwwe'
        },
        {
          id: 2,
          name: 'asasdd'
        },
        {
          id: 3,
          name: 'ghhh'
        },
        {
          id: 4,
          name: 'yuyuii'
        }
      ]
    };
  },
  // 组件方法
  methods: {
    // 倒叙
    changeMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('');
    },
    // 显示列表
    showList() {
      this.isShow = !this.isShow;
    }
  },
  // 生命周期-创建
  beforeCreate() {
    console.log('a');
  },
  created() {
    console.log('b');
  },
  // 生命周期-挂载
  beforeMount() {
    console.log('c');
  },
  mounted() {
    console.log('d');
  },
  // 生命周期-更新
  beforeUpdate() {
    console.log('e');
  },
  updated() {
    console.log('f');
  },
  // 生命周期-卸载
  beforeUnmount() {
    console.log('g');
  },
  unmounted() {
    console.log('h');
  }
};
</script>
