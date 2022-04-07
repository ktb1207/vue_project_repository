<template>
  <div class="home-page">
    <h3 class="welcome">Welcome to Lowcode Design for web</h3>
    <ElButtonGroup>
      <ElButton @click="openPage('Design')">打开设计器</ElButton>
      <ElButton @click="openPage('About')">在线编辑器</ElButton>
      <ElButton @click="openPage('Codemirror')">在线编辑器2</ElButton>
    </ElButtonGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ElButtonGroup, ElButton } from 'element-plus';
export default defineComponent({
  components: {
    ElButtonGroup,
    ElButton
  },
  setup() {
    const router = useRouter();
    /**
     * @description 打开页面
     * @param {routerName} string 路由名称
     * @returns void
     * */
    function openPage(routerName: string): void {
      router.push({ name: routerName });
    }

    return {
      openPage
    };
  }
});
</script>

<style lang="scss">
.home-page {
  padding: 12px 24px;
  .welcome {
    text-align: center;
  }
}
</style>
