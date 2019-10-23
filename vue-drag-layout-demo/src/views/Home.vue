<template>
  <div class="page-wrap">
    <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="50"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent"
    >
      <grid-item v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i">
        <component :is="item.i"></component>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
// @ is an alias to /src
import VueGridLayout from 'vue-grid-layout'
import onePage from '@/components/one.vue'
import twoPage from '@/components/two.vue'
import threePage from '@/components/three.vue'
import fourPage from '@/components/four.vue'
import fivePage from '@/components/five.vue'
import sixPage from '@/components/six.vue'
import loadingTwo from '../../../vueSwiper/src/components/loading/loading2.vue'
let testLayout = [
  {"x":0,"y":0,"w":3,"h":8,"i":"one-page"},
  {"x":3,"y":0,"w":6,"h":8,"i":"two-page"},
  {"x":9,"y":0,"w":3,"h":8,"i":"three-page"},
  {"x":0,"y":8,"w":8,"h":10,"i":"four-page"},
  {"x":8,"y":8,"w":4,"h":10,"i":"five-page"},
  {"x":0,"y":12,"w":6,"h":8,"i":"six-page"},
  {"x":6,"y":12,"w":6,"h":8,"i":"loading-two"}
];
export default {
  name: 'home',
  data(){
    return {
      layout: testLayout,
    }
  },
  computed:{

  },
  watch:{

  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    onePage,
    twoPage,
    threePage,
    fourPage,
    fivePage,
    sixPage,
    loadingTwo
  },
  methods:{
    layoutUpdatedEvent(newLayout){
      console.log("Updated layout: ", newLayout)
    }
  },
  created(){

  },
  mounted(){

  },
  beforeDestroy(){

  }
}
</script>
