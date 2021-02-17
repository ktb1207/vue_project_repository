<template>
  <div class="router-view">
    <Tabs :item-arr="tabsItem" @tab-click="tabClick"></Tabs>
    <AddNum></AddNum>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Tabs from '@/components/Tabs.vue';
import AddNum from '@/components/AddNum.vue';
@Options({
  components: {
    Tabs,
    AddNum
  }
})
export default class Home extends Vue {
  tabsItem: Array<string> = ['tab1', 'tab2'];
  data() {
    return {
      testName: 'string'
    };
  }
  tabClick(index: number): void {
    console.log(index);
  }
}
</script>
