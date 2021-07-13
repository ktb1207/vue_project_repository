<template>
  <div class="menu-component">
    <ul>
      <li v-for="item in listData" :key="item.id" :style="{ borderColor: borderStyle }">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    listData: {
      type: Array,
      required: false,
      default: () => []
    },
    borderStyle: {
      type: String,
      required: false,
      default: 'green'
    }
  }
};
</script>

<style lang="scss">
.menu-component {
  overflow: hidden;
  margin-top: 12px;
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    float: left;
    line-height: 48px;
    border-width: 1px;
    border-style: solid;
    margin-right: 16px;
    list-style: none;
  }
}
</style>
