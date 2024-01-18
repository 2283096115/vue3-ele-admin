<script setup lang="ts">
import { headerType } from "@/components/BaseTable/type";
import { ElMessageBox } from "element-plus";
import { formLabelType, optionType } from "./type";
defineOptions({
  name: "BaseTablePage"
});

const props = withDefaults(
  defineProps<{
    tableHeader: Array<headerType>;
    formLabel: Array<formLabelType>;
    option: optionType;
  }>(),
  {
    tableHeader: () => [],
    formLabel: () => [],
    option: () => ({})
  }
);
// eslint-disable-next-line vue/no-setup-props-destructure
const {
  apis,
  showDetail,
  showEdit = true,
  showDelete = true,
  formRule = {}
} = props.option;
const emit = defineEmits(["handleClickDetail"]);

// table组
const total = ref(0);
const tableData = ref([]);
const pageSize = ref(10);
const currentPage = ref(1);
const otherParams = {};
const sortRule = [];

async function getTableData() {
  const { list } = apis;
  const { formatParams } = list;
  const needFormat = typeof list.format === "function";
  const tableDataTemp = [];
  let params = {
    pagesize: pageSize.value,
    pagination: currentPage.value,
    sortRule,
    ...otherParams
  };
  if (typeof formatParams === "function") {
    params = (await formatParams(JSON.parse(JSON.stringify(params)))) || params;
  }
  apis.list
    .func(params)
    .then(res => {
      const { data, total_records } = res;
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          if (needFormat) {
            item = list.format(item) || item;
          }
          tableDataTemp.push(item);
        });
      }
      tableData.value = tableDataTemp;
      total.value = total_records;
    })
    .catch(err => {
      tableData.value = [];
      total.value = 0;
      console.error(err);
    });
}

function headerFilterChange({ val, searchProp }) {
  otherParams[searchProp] = val;
  getTableData();
}
// function sortChange({ prop, order }) {
//   sortRule = [
//     { order_field: prop, sort: order === "descending" ? "desc" : "asc" }
//   ];
//   getTableData();
// }

// form 相关
const isAdd = ref(true);
const dialogBase = ref(false);
let dialogForm = {};

function comFormat(formItem) {
  return formItem.format || "yyyy-MM-dd";
}
function handleClickEdit(row) {
  dialogForm = reactive(JSON.parse(JSON.stringify(row)));
  isAdd.value = false;
  dialogBase.value = true;
}
function handleClickCreate() {
  dialogForm = reactive({});
  isAdd.value = true;
  dialogBase.value = true;
}

const ruleForm = ref(null);
function submitForm() {
  ruleForm.value.validate(valid => {
    if (valid) {
      submitBase();
    } else {
      console.log("error submit!!");
      return false;
    }
  });
}
function submitBase() {
  let params = dialogForm;
  if (isAdd.value) {
    const { create } = apis;
    const { formatParams } = create;
    if (typeof formatParams === "function") {
      params = formatParams(JSON.parse(JSON.stringify(params))) || params;
    }
    apis.create.func(params).then(() => {
      $message.success("新增成功！");
      dialogBase.value = false;
      updatedHook();
      getTableData();
    });
  } else {
    const { update } = apis;
    const { formatParams } = update;
    if (typeof formatParams === "function") {
      params = formatParams(JSON.parse(JSON.stringify(params))) || params;
    }
    update.func(params).then(() => {
      $message.success("保存成功！");
      dialogBase.value = false;
      updatedHook();
      getTableData();
    });
  }
}
// 删除
function handleClickDelete(row) {
  const mes = "是否确定删除该条记录？";
  ElMessageBox.confirm(mes, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      const { deleteApi } = apis;
      const { formatParams, valueKey = "id", paramsKey = "ids" } = deleteApi;
      let params = {
        [paramsKey]: row[valueKey]
      };
      if (typeof formatParams === "function") {
        params = formatParams(JSON.parse(JSON.stringify(row))) || row;
      }
      deleteApi.func(params).then(() => {
        $message({
          type: "success",
          message: "删除成功!"
        });
        updatedHook();
        getTableData();
      });
    })
    .catch(() => {
      $message({
        type: "info",
        message: "已取消删除!"
      });
    });
}
// 处理点击事件
function handleClickDetail(row) {
  emit("handleClickDetail", row);
}

/**
 * 页面update add delete 更新后会调用的钩子函数
 */
function updatedHook(cb = props.option.updatedHook) {
  if (typeof cb === "function") {
    cb();
  }
}

onMounted(() => {
  getTableData();
});
</script>

<template>
  <div class="page">
    <div class="page__top">
      <div class="mom-btn mom-btn--primary" @click="handleClickCreate">
        新建
      </div>
      <div class="mom-btn mom-btn--info" plain>导入</div>
      <div class="mom-btn mom-btn--info" plain>导出</div>
    </div>
    <div class="page__bottom">
      <BaseTable
        :table-data="tableData"
        :table-header="props.tableHeader"
        :showDetail="showDetail"
        :showEdit="showEdit"
        :showDelete="showDelete"
        :total="total"
        @handleClickDetail="handleClickDetail"
        @handleClickEdit="handleClickEdit"
        @handleClickDelete="handleClickDelete"
        @headerFilterChange="headerFilterChange"
      />
    </div>
    <el-dialog
      :title="isAdd ? '新增' : '编辑'"
      v-model="dialogBase"
      width="470px"
      destroy-on-close
    >
      <el-form
        ref="ruleForm"
        :model="dialogForm"
        :rules="formRule"
        label-width="auto"
      >
        <template v-for="formItem in formLabel" :key="formItem.prop">
          <el-form-item
            v-if="formItem.type === 'select'"
            :label="formItem.label"
            :prop="formItem.prop"
          >
            <PlanSelect
              v-model="dialogForm[formItem.prop]"
              :multiple="formItem.multiple"
              placeholder="请选择"
              filterable
              :options="formItem.options"
            />
          </el-form-item>
          <el-form-item
            v-else-if="formItem.type === 'date'"
            :label="formItem.label"
            :prop="formItem.prop"
          >
            <el-date-picker
              v-model="dialogForm[formItem.prop]"
              type="date"
              placeholder="请选择日期"
              :value-format="comFormat(formItem)"
              :format="comFormat(formItem)"
            />
          </el-form-item>
          <el-form-item v-else :label="formItem.label" :prop="formItem.prop">
            <el-input v-model.trim="dialogForm[formItem.prop]" />
          </el-form-item>
        </template>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogBase = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &__top {
    width: 100%;
    height: 80px;
    padding: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
  }

  &__bottom {
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
  }
}
</style>
