<template>
  <div class="root-router-page feature-setting">
    <!-- header -->
    <header class="fixed-header">
      <el-button icon="el-icon-back" size="small" @click="backClick">返回</el-button>
      <el-button type="primary" icon="el-icon-check" size="small">保存</el-button>
    </header>
    <div class="feature-content">
      <KFeatureDrag
        v-for="item in classIfyData"
        :key="item.classifyId"
        :title="item.title"
        :list-arr="item.menuArr"
        @wrpDragStart="classifyDragStart"
        @wrpDragEnd="classifyDragEnd"
        @itemDropEnd="classifyItemDragEnd"
      ></KFeatureDrag>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import KFeatureDrag from '@/components/k-feature-drag/KFeatureDrag.vue';
import { FeatureItem } from '@/components/k-feature-container/index';

type ClassifyItemType = {
  classifyId: string;
  title: string;
  menuArr: Array<FeatureItem>;
};

export default defineComponent({
  name: 'FeatureSetting',
  components: {
    KFeatureDrag
  },
  setup() {
    const router = useRouter();

    // 返回
    const backClick = () => {
      router.push({ name: 'Home' });
    };
    // 分类调整
    let startTitle = '',
      classifyDragStatus = false;
    const classIfyData = ref<Array<ClassifyItemType>>([
      {
        classifyId: '111',
        title: '综合查询',
        menuArr: [
          {
            id: '11',
            name: '功能1',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '12',
            name: '功能2',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '13',
            name: '功能3',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '14',
            name: '功能4',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '15',
            name: '功能5',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '16',
            name: '功能6',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '17',
            name: '功能7',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '18',
            name: '功能8',
            iconfontName: 'icon-riqi',
            isShow: true
          },
          {
            id: '19',
            name: '功能9',
            iconfontName: 'icon-riqi',
            isShow: false
          },
          {
            id: '20',
            name: '功能10',
            iconfontName: 'icon-riqi',
            isShow: false
          }
        ]
      },
      {
        classifyId: '112',
        title: '采购管理',
        menuArr: []
      },
      {
        classifyId: '113',
        title: '招标管理',
        menuArr: []
      }
    ]);
    const classifyDragStart = (title: string): void => {
      startTitle = title;
      classifyDragStatus = true;
    };
    const classifyDragEnd = (title: string) => {
      if (classifyDragStatus && startTitle !== title) {
        const startIndex = classIfyData.value.findIndex((value) => startTitle === value.title);
        const endIndex = classIfyData.value.findIndex((value) => title === value.title);
        classIfyData.value.splice(
          startIndex,
          1,
          ...classIfyData.value.splice(endIndex, 1, classIfyData.value[startIndex])
        );
        console.log(classIfyData.value);
      }
      // 关闭
      classifyDragStatus = false;
    };
    // 功能分类子菜单拖拽
    const classifyItemDragEnd = (
      classfiyTitle: string,
      dragId: string,
      changeStatus: 'show' | 'hide',
      targetId?: string
    ) => {
      // 找出当前分类模块索引
      let activeClassifyInx = 0;

      classIfyData.value.forEach((item, index) => {
        if (item.title === classfiyTitle) {
          activeClassifyInx = index;
        }
      });
      if (targetId) {
        const copyMoveItem: Array<FeatureItem> = [];
        let insertTargetIndex = 0;
        // 存在放置目标
        classIfyData.value[activeClassifyInx].menuArr.forEach((val, index) => {
          if (val.id === dragId) {
            val.isShow = changeStatus === 'show' ? true : false;
            copyMoveItem.push(classIfyData.value[activeClassifyInx].menuArr.splice(index, 1)[0]);
          }
        });
        classIfyData.value[activeClassifyInx].menuArr.forEach((val, index) => {
          if (val.id === targetId) {
            // 插入位置
            insertTargetIndex = index;
          }
        });
        // 执行插入
        classIfyData.value[activeClassifyInx].menuArr.splice(insertTargetIndex, 0, copyMoveItem[0]);
      } else {
        // 不存在放置目标
        classIfyData.value[activeClassifyInx].menuArr.forEach((val, index) => {
          if (val.id === dragId) {
            val.isShow = changeStatus === 'show' ? true : false;
            classIfyData.value[activeClassifyInx].menuArr.push(
              classIfyData.value[activeClassifyInx].menuArr.splice(index, 1)[0]
            );
          }
        });
      }
    };
    return {
      backClick,
      classIfyData,
      classifyDragStart,
      classifyDragEnd,
      classifyItemDragEnd
    };
  }
});
</script>

<style lang="scss" scoped>
$yellowColor: #ff6a00;
.feature-setting {
  display: flex;
  flex-direction: column;
  padding: 0 26px;
  .fixed-header {
    flex: 0 0 auto;
    padding: 14px 24px;
    display: flex;
    justify-content: space-between;
  }
  .feature-content {
    flex: 1 1 auto;
    height: 0;
    overflow: auto;
  }
}
</style>
