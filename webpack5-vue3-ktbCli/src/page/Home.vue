<template>
  <div>
    <button @click="openPage('Proxy')">Proxy</button>
    <button @click="openPage('MountSequence')">组件挂载顺序</button>
    <button @click="openPage('Canvas')">canvas</button>
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
    return {
      openPage
    };
  }
};
</script>
