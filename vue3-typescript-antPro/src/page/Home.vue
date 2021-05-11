<template>
  <div class="root-router-page home-page">
    <div class="table-wrp">
      <el-button type="primary" @click="hrefSystem('autoWaring')">自动预警</el-button>
      <el-button type="primary" @click="hrefSystem('riskTip')">风险提示</el-button>
    </div>
    <div class="test-wrp">
      <KTablePlus :rowData="bodyData" unique-key="id" @CheckChange="checkChange">
        <KColumnPlus label="selection" width="40px" align="center"></KColumnPlus>
        <KColumnPlus label="名称" prop="name" width="100px" align="center"></KColumnPlus>
        <KColumnPlus label="班级" prop="classify" width="300px"></KColumnPlus>
        <KColumnPlus label="分数" prop="num" width="100px">
          <template #default="scope">
            <button @click="hTestClick(scope)">button</button>
          </template>
        </KColumnPlus>
      </KTablePlus>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import useAuthority from '@/utils/authority';
import KTablePlus from '@/components/k-table-plus/KTablePlus';
import KColumnPlus from '@/components/k-table-plus/KColumnPlus';
type tableRowItem = {
  id: number;
  name: string;
  classify: string;
  num: number;
};

export default defineComponent({
  components: {
    KTablePlus,
    KColumnPlus
  },
  setup() {
    // 页面范文权限
    useAuthority('A');
    const bodyData = reactive<Array<tableRowItem>>([
      {
        id: 1,
        name: '张三',
        classify: '三二班',
        num: 801234567890012345
      },
      {
        id: 2,
        name: '李四',
        classify: '四二班',
        num: 77
      },
      {
        id: 3,
        name: '1111',
        classify: '四二班',
        num: 77
      },
      {
        id: 4,
        name: '222',
        classify: '四二班',
        num: 77
      }
    ]);
    // 表格勾选
    const checkChange = (arr: Array<any>) => {
      console.log(arr);
    };
    const hTestClick = (scope: any) => {
      console.log(scope);
    };
    const router = useRouter();
    // 跳转平台
    const hrefSystem = (paramsStr: string) => {
      console.log(paramsStr);
      router.push({ name: 'PlatformClassify', params: { classifyType: paramsStr } });
    };
    return {
      bodyData,
      hTestClick,
      hrefSystem,
      checkChange
    };
  }
});
</script>

<style lang="scss">
.home-page {
  padding: 24px;
  .table-wrp {
    width: 900px;
    overflow: auto;
  }
  .test-wrp {
    padding-top: 24px;
    width: 900px;
    height: 300px;
    padding-left: 60px;
  }
}
</style>
