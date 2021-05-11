<template>
  <ElCard shadow="hover" class="mainCard">
    <ElForm :inline="true" label-suffix="：" size="small">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="字典名称">
            <ElInput v-model="queryInfo.dictName" placeholder="请输入字典名称" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="字典类型">
            <ElInput v-model="queryInfo.dictType" placeholder="请输入字典类型" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="状态">
            <Selector v-model="queryInfo.dictStatus" placeholder="请选择状态" :selectOptions="statusOptions()" />
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
      <ElTableColumn prop="dictId" label="字典编号" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="dictName" label="字典名称" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="dictType" label="字典类型" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="dictRemark" label="备注" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="createDate" label="创建时间" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="状态" header-align="center" align="center">
        <template #default="scope">
          {{ statusLabel(scope.row.dictStatus) }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" header-align="center" align="center" width="300" fixed="right">
        <template #default="scope">
          <ElButton type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</ElButton>
          <ElButton type="text" icon="el-icon-collection" @click="handleEditData(scope.row)">编辑数据</ElButton>
          <ElPopconfirm
            confirmButtonText="确定"
            cancelButtonText="取消"
            icon="el-icon-warning-outline"
            iconColor="#d30102"
            title="是否确定删除？"
            @confirm="handleDelete(false, scope.row.dictId)"
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
          <ElFormItem label="字典名称">
            <ElInput v-model="formData.dictName" placeholder="请输入字典名称" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="字典类型">
            <ElInput v-model="formData.dictType" placeholder="请输入字典类型" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="状态">
            <Selector v-model="formData.dictStatus" :selectOptions="statusOptions()" placeholder="请选择状态" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="备注">
            <ElInput
              v-model="formData.dictRemark"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              style="width:700px"
            />
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
import { useRouter } from 'vue-router';
import {
  ElCard,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
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
import tableDataSamp from '@/views/systemManage/tempData/dictTableData.json';

type queryInfoType = {
  dictName: string;
  dictType: string;
  dictStatus: string;
};

type tableRowType = {
  id: number;
  dictId: string;
  dictName: string;
  dictType: string;
  dictRemark: string;
  createDate: string;
  dictStatus: string;
};

type pageType = {
  total: number;
  size: number;
  current: number;
};

type formType = {
  dictName: string;
  dictType: string;
  dictStatus: string;
  dictRemark: string;
};

export default defineComponent({
  components: {
    ElCard,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
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
    const router = useRouter();
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
    const queryInfo = reactive<queryInfoType>({ dictName: '', dictType: '', dictStatus: '' });
    const tableLoading = ref<boolean>(false);
    const tableData = ref(tableDataSamp);
    const handleQuery = () => {
      tableLoading.value = true;
      console.log('query');
      console.log(queryInfo);
    };
    const handleClear = () => {
      queryInfo.dictName = '';
      queryInfo.dictType = '';
      queryInfo.dictStatus = '';
    };
    const dialogTitle = ref<string>('');
    const selectedData = ref<Array<tableRowType>>([]);
    const handleSelectionChange = (rows: Array<tableRowType>) => {
      selectedData.value = rows;
      console.log(rows);
    };
    const handleEdit = (row: tableRowType) => {
      dialogTitle.value = '修改字典';
      visible.value = true;
      console.log(row);
    };
    const handleEditData = (row: tableRowType) => {
      router.push({
        name: 'DictionaryData',
        params: { id: row.dictId }
      });
    };
    const handleAdd = () => {
      dialogTitle.value = '添加字典';
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
      dictName: '',
      dictType: '',
      dictStatus: '',
      dictRemark: ''
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
      dialogTitle,
      selectedData,
      handleSelectionChange,
      handleEdit,
      handleEditData,
      handleAdd,
      handleDelete,
      handleOutput,
      page,
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
