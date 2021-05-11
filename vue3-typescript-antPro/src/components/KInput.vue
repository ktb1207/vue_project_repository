<template>
  <div class="k-input-wrp">
    <input type="text" placeholder="查询" class="k-search-input" v-model="inputValue" />
    <span :style="inputCursor" class="search-icon"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  setup() {
    const inputValue = ref<string>('');

    const inputCursor = computed(() => {
      if (inputValue.value.length > 0) {
        return {
          cursor: 'pointer'
        };
      }
      return {
        cursor: 'not-allowed'
      };
    });
    return {
      inputValue,
      inputCursor
    };
  }
});
</script>

<style lang="scss">
.k-input-wrp {
  position: relative;
  .k-search-input {
    display: block;
    margin: 0;
    outline: none;
    width: 100%;
    height: 26px;
    line-height: 26px;
    background-color: #f4d1d1;
    border: 1px solid #d90301;
    padding: 0 32px 0 12px;
    font-size: 14px;
    color: #565656;
    &:focus {
      background-color: #fff;
    }
    &:-moz-placeholder {
      color: #979797;
    }
    &:-ms-input-placeholder {
      color: #979797;
    }
    &::-webkit-input-placeholder {
      color: #979797;
    }
    &::-moz-placeholder {
      color: #979797;
    }
  }
  .search-icon {
    position: absolute;
    top: 1px;
    right: 0;
    display: block;
    width: 26px;
    height: 24px;
    background-image: url('../assets/images/search-input_bg.png');
    background-repeat: no-repeat;
    background-position: center;
    &:hover {
      background-color: #f4d1d1;
    }
    &:active {
      background-color: #fff;
    }
  }
}
</style>
