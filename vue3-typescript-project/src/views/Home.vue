<template>
  <div class="home">
    <h2 @click="add">{{ message }}</h2>
    <p>{{ doubleMessage }}</p>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { RouteRecordRaw } from 'vue-router'; // 检测规则
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
Vue.registerHooks(['beforeRouteEnter', 'beforeRouteLeave']);
@Options({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  message = 1;
  add(): void {
    this.message++;
  }
  get doubleMessage(): number {
    return this.message * 2;
  }
  created() {
    console.log('created');
  }
  mounted() {
    console.log('mounted');
  }
  beforeRouteEnter(to: RouteRecordRaw, from: RouteRecordRaw, next: () => void): void {
    console.log('beforeRouteEnter');
    console.log(to);
    console.log(from);
    next();
  }

  beforeRouteLeave(to: RouteRecordRaw, from: RouteRecordRaw, next: () => void): void {
    console.log('beforeRouteLeave');
    console.log(to);
    console.log(from);
    next();
  }
}
</script>
