<template>
  <div class="test-wrp">
    <KRow showWay="edit" align="left" verticalAlign="stretch">
      <KCol showWay="edit" width="1" flex-direction="col" main-align="start">
        <p>第一个p段落</p>
        <p>第二个p段落</p>
      </KCol>
    </KRow>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({});
</script>

<style lang="scss" scoped>
.test-wrp {
  padding: 12px;
}
</style>
