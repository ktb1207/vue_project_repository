<template>
  <div>
    <div class="echarts-preview" ref="refDom"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import china from '@/components/echartsMap/china.json';
export default {
  name: 'EchartsMap',
  setup() {
    const refDom = ref(null);
    let echartsInstance = null;
    const dataList = [
      { name: '北京', value: 200 },
      { name: '四川', value: 800 }
    ];
    const options = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return params.name; //自行定义formatter格式
        }
      },
      visualMap: {
        min: 0,
        max: 1500,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], //取值范围的文字
        inRange: {
          color: ['#e0ffff', '#006edd'] //取值范围的颜色
        },
        show: true //图注
      },
      geo: {
        map: 'china',
        roam: false, //不开启缩放和平移
        zoom: 1.23, //视角缩放比例
        label: {
          normal: {
            show: true,
            fontSize: '10',
            color: 'rgba(0,0,0,0.7)'
          },
          emphasis: {
            textStyle: {
              color: '#fff'
            }
          }
        }
      },
      itemStyle: {
        normal: {
          borderColor: 'rgba(0, 0, 0, 0.2)'
        },
        emphasis: {
          areaColor: '#F3B329', //鼠标选择区域颜色
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 20,
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      series: [
        {
          name: '信息量',
          type: 'map',
          geoIndex: 0,
          data: dataList
        }
      ]
    };
    const initEcharts = () => {
      echarts.registerMap('china', china);
      echartsInstance = echarts.init(refDom.value, null, {
        width: undefined,
        height: undefined
      });
      echartsInstance.setOption(options);
    };
    onMounted(() => {
      initEcharts();
    });
    return {
      refDom
    };
  }
};
</script>

<style lang="scss">
.echarts-preview {
  width: 600px;
  height: 600px;
}
</style>
