<template>
  <ElCard shadow="hover" class="mainCard">
    <ElForm :inline="true" label-suffix="：" size="small">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="岗位名称">
            <ElInput v-model="queryInfo.posName" placeholder="请输入岗位名称" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="岗位编号">
            <ElInput v-model="queryInfo.posId" placeholder="请输入岗位编号" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="状态">
            <Selector v-model="queryInfo.posStatus" placeholder="请选择状态" :selectOptions="statusOptions()" />
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
      <ElButton size="small" type="danger" icon="el-icon-plus" @click="handleAdd()">新增</ElButton>
      <ElButton size="small" type="danger" icon="el-icon-delete" @click="handleDelete(true)">删除</ElButton>
      <ElButton size="small" type="danger" icon="el-icon-upload2" @click="handleOutput()">导出</ElButton>
    </div>
    <ElTable
      size="small"
      :data="tableData"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
      style="height:630px"
      :header-cell-style="{ background: '#F5F5F5', color: '#000000' }"
    >
      <ElTableColumn type="selection" header-align="center" align="center" />
      <ElTableColumn prop="posId" label="岗位编号" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="posName" label="岗位名称" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="posRank" label="岗位排序" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="createDate" label="创建时间" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="状态" header-align="center" align="center">
        <template #default="scope">
          {{ statusLabel(scope.row.posStatus) }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" header-align="center" align="center" width="300" fixed="right">
        <template #default="scope">
          <ElButton type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</ElButton>
          <ElPopconfirm
            confirmButtonText="确定"
            cancelButtonText="取消"
            icon="el-icon-warning-outline"
            iconColor="#d30102"
            title="是否确定删除？"
            @confirm="handleDelete(false, scope.row.posId)"
          >
            <template #reference>
              <ElButton type="text" icon="el-icon-delete">删除</ElButton>
            </template>
          </ElPopconfirm>
        </template>
      </ElTableColumn>
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
  <ElDialog v-model="visible" :destroy-on-close="true">
    <template v-slot:title>
      <div class="dialogHeader" />
      <div class="dialogTitle">{{ dialogTitle }}</div>
      <ElDivider />
    </template>
    <ElForm :inline="true" label-suffix="：" label-width="100px" size="small">
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="岗位编号">
            <ElInput v-model="formData.posId" placeholder="请输入岗位编号" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="岗位名称">
            <ElInput v-model="formData.posName" placeholder="请输入岗位名称" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="岗位排序">
            <ElInputNumber v-model="formData.posRank" controls-position="right" :min="0" style="width: 195px" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="岗位状态">
            <Selector v-model="formData.posStatus" :selectOptions="statusOptions()" placeholder="请选择状态" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="备注">
            <ElInput v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入内容" style="width:700px" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template v-slot:footer>
      <ElButton type="danger" @click="handleFinish">保存</ElButton>
      <ElButton type="info" @click="handleCancel">取消</ElButton>
    </template>
  </ElDialog>
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
  ElInputNumber,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDialog,
  ElDivider,
  ElPopconfirm,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import util from '@/utils/sysManage';
import Selector from '@/components/systemManage/Selector.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import tableDataSamp from '@/views/systemManage/tempData/posTableData.json';

type queryInfoType = {
  posName: string;
  posId: string;
  posStatus: string;
};

type tableRowType = {
  id: number;
  posId: string;
  posName: string;
  posRank: number;
  createDate: string;
  posStatus: string;
};

type pageType = {
  total: number;
  size: number;
  current: number;
};

type formType = {
  posId: string;
  posName: string;
  posRank: number;
  posStatus: string;
  remark: string;
};

export default defineComponent({
  components: {
    ElCard,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElDialog,
    ElDivider,
    ElPopconfirm,
    Selector
  },
  mounted() {
    this.handleQuery();
  },
  setup() {
    const visible = ref<boolean>(false);
    const statusOptions = () => {
      return [
        {
          value: '1',
          label: '状态1'
        },
        {
          value: '2',
          label: '状态2'
        },
        {
          value: '3',
          label: '状态3'
        }
      ];
    };
    const statusLabel = (val: string) => util.getLabelByValue(statusOptions(), val);
    const queryInfo = reactive<queryInfoType>({ posName: '', posId: '', posStatus: '' });
    const tableLoading = ref<boolean>(false);
    const tableData = ref(tableDataSamp);
    const handleQuery = () => {
      tableLoading.value = true;
      console.log('query');
      console.log(queryInfo);
    };
    const handleClear = () => {
      queryInfo.posName = '';
      queryInfo.posId = '';
      queryInfo.posStatus = '';
    };
    const dialogTitle = ref<string>('');
    const selectedData = ref<Array<tableRowType>>([]);
    const handleSelectionChange = (rows: Array<tableRowType>) => {
      selectedData.value = rows;
      console.log(rows);
    };
    const handleEdit = (row: tableRowType) => {
      dialogTitle.value = '修改岗位';
      visible.value = true;
      console.log(row);
    };
    const handleAdd = () => {
      dialogTitle.value = '添加岗位';
      visible.value = true;
    };
    const handleDelete = (multi: boolean, rowId: string) => {
      if (multi) {
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
      } else {
        console.log('delete ---' + rowId);
      }
    };
    const handleOutput = () => {
      console.log('output');
    };
    const page = reactive<pageType>({
      total: 100,
      size: 10,
      current: 3
    });
    const formData = reactive<formType>({
      posId: '',
      posName: '',
      posRank: 0,
      posStatus: '',
      remark: ''
    });
    const handleSubmit = () => {
      console.log(formData);
      visible.value = false;
    };
    const handleFinish = () => {
      console.log('finish');
      handleSubmit();
    };
    const handleCancel = () => {
      visible.value = false;
    };
    return {
      visible,
      statusOptions,
      statusLabel,
      queryInfo,
      tableLoading,
      tableData,
      handleQuery,
      handleClear,
      selectedData,
      handleSelectionChange,
      handleEdit,
      handleAdd,
      handleDelete,
      handleOutput,
      page,
      dialogTitle,
      formData,
      handleSubmit,
      handleFinish,
      handleCancel
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
