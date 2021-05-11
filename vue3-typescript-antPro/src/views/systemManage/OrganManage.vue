<template>
  <ElCard shadow="hover" class="mainCard">
    <ElForm :inline="true" label-suffix="：" size="small">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="组织机构名称">
            <ElInput v-model="queryInfo.deptName" placeholder="请输入组织机构名称" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="组织机构编码">
            <ElInput v-model="queryInfo.deptId" placeholder="请输入组织机构编码" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="状态">
            <Selector v-model="queryInfo.deptStatus" placeholder="请选择状态" :selectOptions="statusOptions()" />
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
    <ElTable
      size="small"
      :data="tableData"
      border
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      style="height:680px"
      :header-cell-style="{ background: '#F5F5F5', color: '#000000' }"
    >
      <ElTableColumn type="selection" header-align="center" align="center" />
      <ElTableColumn prop="deptId" label="组织机构编号" header-align="center"></ElTableColumn>
      <ElTableColumn prop="partName" label="组织机构简称" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="fullName" label="组织机构全称" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="location" label="组织机构地区" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="mail" label="电子邮件地址" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="phone" label="电话" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="createDate" label="创建时间" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="状态" header-align="center" align="center">
        <template #default="scope">
          {{ statusLabel(scope.row.status) }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" header-align="center" align="center" width="300" fixed="right">
        <template #default="scope">
          <ElButton type="text" icon="el-icon-plus" @click="handleAdd(scope.row.deptId)">新增</ElButton>
          <ElButton type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</ElButton>
          <span v-show="!scope.row.isRoot" style="margin-left:10px">
            <ElPopconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              icon="el-icon-warning-outline"
              iconColor="#d30102"
              title="是否确定删除？"
              @confirm="handleDelete(scope.row.deptId)"
            >
              <template #reference>
                <ElButton type="text" icon="el-icon-delete">删除</ElButton>
              </template>
            </ElPopconfirm>
          </span>
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
    <ElForm :inline="true" label-suffix="：" label-width="120px" size="small">
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="组织机构编号">
            <ElInput v-model="formData.deptId" placeholder="请输入组织机构编号" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="组织机构地区">
            <ElInput v-model="formData.location" placeholder="请输入组织机构地区" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="组织机构简称">
            <ElInput v-model="formData.partName" placeholder="请输入组织机构简称" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="组织机构全称">
            <ElInput v-model="formData.fullName" placeholder="请输入组织机构全称" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="上级单位">
            <TreeSelector
              v-model="formData.department"
              :treeOptions="deptOptions()"
              placeholder="请选择上级单位"
              style="width: 655px"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="电子邮件">
            <ElInput v-model="formData.mail" placeholder="请输入电子邮件" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="电话">
            <ElInput v-model="formData.phone" placeholder="请输入电话" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="排序">
            <ElInputNumber
              v-model="formData.deptRank"
              controls-position="right"
              :min="0"
              :step="1"
              :step-strictly="true"
              style="width: 200px"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="状态">
            <Selector v-model="formData.deptStatus" :selectOptions="statusOptions()" placeholder="请选择状态" />
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
  ElPopconfirm
} from 'element-plus';
import util from '@/utils/sysManage';
import Selector from '@/components/systemManage/Selector.vue';
import TreeSelector from '@/components/systemManage/TreeSelector.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import tableDataSamp from '@/views/systemManage/tempData/orgTableData.json';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import treeDataSamp from '@/views/systemManage/tempData/treeData.json';

type queryInfoType = {
  deptName: string;
  deptId: string;
  deptStatus: string;
};

type tableRowType = {
  id: number;
  deptId: string;
  partName: string;
  fullName: string;
  location: string;
  mail: string;
  phone: string;
  sort: number;
  status: string;
  createDate: string;
};

type optionType = {
  label: string;
  value: string;
};

type pageType = {
  total: number;
  size: number;
  current: number;
};

type formType = {
  deptId: string;
  location: string;
  partName: string;
  fullName: string;
  department: number;
  mail: string;
  phone: string;
  deptRank: number;
  deptStatus: string;
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
    Selector,
    TreeSelector
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
    const queryInfo = reactive<queryInfoType>({ deptName: '', deptId: '', deptStatus: '' });
    const tableLoading = ref<boolean>(false);
    const tableData = ref(tableDataSamp);
    const handleQuery = () => {
      tableLoading.value = true;
      console.log('query');
      console.log(queryInfo);
    };
    const handleClear = () => {
      queryInfo.deptName = '';
      queryInfo.deptId = '';
      queryInfo.deptStatus = '';
    };
    const getOptionLabel = (options: Array<optionType>, value: string) => {
      const labelArr = options.filter((item: optionType) => {
        return item.value === value;
      });
      if (labelArr.length) {
        return labelArr[0].label;
      } else {
        return '-';
      }
    };
    const dialogTitle = ref<string>('');
    const handleAdd = (rowId: string) => {
      dialogTitle.value = '添加部门';
      visible.value = true;
      console.log('Add---' + rowId);
    };
    const handleEdit = (row: tableRowType) => {
      dialogTitle.value = '修改部门';
      visible.value = true;
      console.log(row);
    };
    const handleDelete = (rowId: string) => {
      console.log('delete---' + rowId);
    };
    const page = reactive<pageType>({
      total: 100,
      size: 10,
      current: 3
    });
    const deptOptions = () => {
      return treeDataSamp;
    };
    const formData = reactive<formType>({
      deptId: '',
      location: '',
      partName: '',
      fullName: '',
      department: 100,
      mail: '',
      phone: '',
      deptRank: 0,
      deptStatus: ''
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
      getOptionLabel,
      handleAdd,
      handleEdit,
      handleDelete,
      page,
      dialogTitle,
      deptOptions,
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
