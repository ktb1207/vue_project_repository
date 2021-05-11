<template>
  <ElCard shadow="hover" class="mainCard">
    <ElForm :inline="true" label-suffix="：" size="small">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="登录地址">
            <ElInput v-model="queryInfo.loginAddr" placeholder="请输入登录地址" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="用户名称">
            <ElInput v-model="queryInfo.userName" placeholder="请输入用户名称" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="登录状态">
            <Selector v-model="queryInfo.loginStatus" placeholder="请选择状态" :selectOptions="statusOptions()" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="登录时间">
            <ElDatePicker
              v-model="queryInfo.loginRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期时间"
              end-placeholder="结束日期时间"
            >
            </ElDatePicker>
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="">
            <ElButton type="danger" icon="el-icon-search" @click="handleQuery">搜索</ElButton>
            <ElButton type="info" icon="el-icon-refresh-left" @click="handleClear">重置</ElButton>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <div style="margin: 10px">
      <ElButton size="small" type="danger" icon="el-icon-delete" @click="handleDelete({ multi: true })">删除</ElButton>
      <ElButton size="small" type="danger" icon="el-icon-delete" @click="handleDeleteAll()">清空</ElButton>
      <ElButton size="small" type="danger" icon="el-icon-upload2" @click="handleOutput()">导出</ElButton>
    </div>
    <ElTable
      size="small"
      :data="tableData"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
      style="height:580px"
      :header-cell-style="{ background: '#F5F5F5', color: '#000000' }"
      :row-style="{ height: '57px' }"
    >
      <ElTableColumn type="selection" header-align="center" align="center" />
      <ElTableColumn prop="loginId" label="访问编号" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="userName" label="用户名称" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="ipAddr" label="IP地址" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="登录状态" header-align="center" align="center">
        <template #default="scope">
          {{ statusLabel(scope.row.loginStatus) }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="loginDesc" label="描述" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="loginDate" label="访问时间" header-align="center" align="center"></ElTableColumn>
    </ElTable>
    <ElPagination
      background
      layout="prev, pager, next"
      :total="page.total"
      :page-size="page.size"
      :current-page="page.current"
      @current-change="handleQuery"
    />
  </ElCard>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import {
  ElCard,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import util from '@/utils/sysManage';
import Selector from '@/components/systemManage/Selector.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import tableDataSamp from '@/views/logManage/tempData/loginTableData.json';

type queryInfoType = {
  loginAddr: string;
  userName: string;
  loginStatus: string;
  loginRange: Array<Date>;
};

type tableRowType = {
  id: number;
  loginId: string;
  userName: string;
  ipAddr: string;
  loginStatus: string;
  loginDesc: string;
  loginDate: string;
};

type pageType = {
  total: number;
  size: number;
  current: number;
};

export default defineComponent({
  components: {
    ElCard,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElDatePicker,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    Selector
  },
  mounted() {
    this.handleQuery();
  },
  setup() {
    const statusOptions = () => {
      return [
        {
          value: '1',
          label: '成功'
        },
        {
          value: '2',
          label: '失败'
        }
      ];
    };
    const statusLabel = (val: string) => util.getLabelByValue(statusOptions(), val);
    const queryInfo = reactive<queryInfoType>({ loginAddr: '', userName: '', loginStatus: '', loginRange: [] });
    const tableLoading = ref<boolean>(false);
    const tableData = ref(tableDataSamp);
    const handleQuery = () => {
      tableLoading.value = true;
      console.log('query');
      console.log(queryInfo);
      if (queryInfo.loginRange && queryInfo.loginRange.length) {
        console.log('Year---' + queryInfo.loginRange[0].getFullYear());
      }
    };
    const handleClear = () => {
      queryInfo.loginAddr = '';
      queryInfo.userName = '';
      queryInfo.loginStatus = '';
      queryInfo.loginRange = [];
    };
    const selectedData = ref<Array<tableRowType>>([]);
    const handleSelectionChange = (rows: Array<tableRowType>) => {
      selectedData.value = rows;
      console.log(rows);
    };
    const handleDelete = () => {
      if (!selectedData.value.length) {
        ElMessage.warning('请至少选择一条数据');
      } else {
        ElMessageBox.confirm('是否确认删除所选数据?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log('delete');
          })
          .catch(() => {});
      }
    };
    const handleDeleteAll = () => {
      ElMessageBox.confirm('是否确认清空日志?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('clear');
        })
        .catch(() => {});
    };
    const handleOutput = () => {
      console.log('output');
    };
    const page = reactive<pageType>({
      total: 100,
      size: 10,
      current: 3
    });
    return {
      statusOptions,
      statusLabel,
      queryInfo,
      tableLoading,
      tableData,
      selectedData,
      handleSelectionChange,
      handleQuery,
      handleClear,
      handleDelete,
      handleDeleteAll,
      handleOutput,
      page
    };
  }
});
</script>
<style lang="scss">
@import '@/components/systemManage/styles/index.scss';
.mainCard {
  margin-top: 10px;
  margin-right: 10px;
  width: 1660px;
}
</style>
