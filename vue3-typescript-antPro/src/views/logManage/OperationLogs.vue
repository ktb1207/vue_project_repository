<template>
  <ElCard shadow="hover" class="mainCard">
    <ElForm :inline="true" label-suffix="：" size="small">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="系统模块">
            <ElInput v-model="queryInfo.sysModule" placeholder="请输入系统模块" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="操作人员">
            <ElInput v-model="queryInfo.operator" placeholder="请输入操作人员" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="操作时间">
            <ElDatePicker
              v-model="queryInfo.optRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期时间"
              end-placeholder="结束日期时间"
            >
            </ElDatePicker>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="操作类型">
            <Selector v-model="queryInfo.optType" placeholder="请选择操作类型" :selectOptions="typeOptions()" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="操作状态">
            <Selector v-model="queryInfo.optStatus" placeholder="请选择状态" :selectOptions="statusOptions()" />
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
      <ElButton size="small" type="danger" icon="el-icon-delete" @click="handleDelete()">删除</ElButton>
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
    >
      <ElTableColumn type="selection" header-align="center" align="center" />
      <ElTableColumn prop="logId" label="日志编号" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="sysModule" label="系统模块" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="操作类型" header-align="center" align="center">
        <template #default="scope">
          {{ typeLabel(scope.row.optType) }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="request" label="请求方式" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="operator" label="操作人员" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="ipAddr" label="IP地址" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="操作状态" header-align="center" align="center">
        <template #default="scope">
          {{ statusLabel(scope.row.optStatus) }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="optDate" label="操作时间" header-align="center" align="center"></ElTableColumn>
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
import tableDataSamp from '@/views/logManage/tempData/operationTableData.json';

type queryInfoType = {
  sysModule: string;
  operator: string;
  optType: string;
  optStatus: string;
  optRange: Array<Date>;
};

type tableRowType = {
  id: number;
  logId: string;
  sysModule: string;
  optType: string;
  request: string;
  operator: string;
  ipAddr: string;
  optStatus: string;
  optDate: string;
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
    const typeOptions = () => {
      return [
        {
          value: '1',
          label: '类型1'
        },
        {
          value: '2',
          label: '类型2'
        },
        {
          value: '3',
          label: '类型3'
        }
      ];
    };
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
    const typeLabel = (val: string) => util.getLabelByValue(typeOptions(), val);
    const statusLabel = (val: string) => util.getLabelByValue(statusOptions(), val);
    const queryInfo = reactive<queryInfoType>({
      sysModule: '',
      operator: '',
      optType: '',
      optStatus: '',
      optRange: []
    });
    const tableLoading = ref<boolean>(false);
    const tableData = ref(tableDataSamp);
    const handleQuery = () => {
      tableLoading.value = true;
      console.log('query');
      console.log(queryInfo);
    };
    const handleClear = () => {
      queryInfo.sysModule = '';
      queryInfo.operator = '';
      queryInfo.optType = '';
      queryInfo.optStatus = '';
      queryInfo.optRange = [];
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
      typeOptions,
      statusOptions,
      typeLabel,
      statusLabel,
      queryInfo,
      tableLoading,
      tableData,
      handleQuery,
      handleClear,
      selectedData,
      handleSelectionChange,
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
