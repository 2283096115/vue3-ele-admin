<template>
  <div class="base-table">
    <el-table
      ref="tableRoleRef"
      :data="tableData"
      v-bind="$attrs"
      :max-height="props.maxHeight"
      :header-cell-style="{
        backgroundColor: '#F7F8FA',
        color: '#4E5969',
        height: '60px'
      }"
      :row-style="{ height: '55px' }"
    >
      <!-- reserve-selection 需要配合row-key使用 -->
      <el-table-column
        v-if="props.showSelection"
        type="selection"
        :reserve-selection="props.reserveSelection"
        width="55"
      />
      <el-table-column v-if="props.showIndex" type="selection" width="55" />
      <BaseTableColumn
        v-for="(header, Hindex) in tableHeader"
        min-width="120"
        :headerItem="header"
        :key="Hindex"
        @headerFilterChange="headerFilterChange"
        @showFilter="showFilter"
        @baseSortChange="baseSortChange"
      >
        <template v-slot="{ row, column, index }">
          <slot :row="row" :column="column" :index="index" />
        </template>
      </BaseTableColumn>
      <el-table-column v-if="showOpts" label="操作">
        <template #default="{ row, column }">
          <span
            v-if="showDetail"
            class="global-jump mr-[5px]"
            @click="handleClickDetail(row, column)"
            >详情</span
          >
          <span
            v-if="showEdit"
            class="global-jump mr-[5px]"
            @click="handleClickEdit(row, column)"
            >编辑</span
          >
          <span
            v-if="showDelete"
            class="global-jump"
            @click="handleClickDelete(row, column)"
            >删除</span
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPages"
      v-bind="pageMsg"
      :total="total"
      style="justify-content: right; margin: 20px 20px 20px auto"
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      @size-change="emitPageChange"
      @current-change="emitPageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElTable } from "element-plus";
import BaseTableColumn from "./BaseTableColumn.vue";
import { headerType } from "./type";
import { SortType } from "./type";
defineOptions({
  name: "BaseTable"
});

const emit = defineEmits([
  "pageChange",
  "handleClickDetail",
  "handleClickEdit",
  "handleClickDelete",
  "headerFilterChange",
  "showFilter",
  "headerSearch",
  "baseSortChange"
]);

const pageSize = ref(20);
const currentPage = ref(1);
const props = withDefaults(
  defineProps<{
    tableData: any[];
    tableHeader: headerType[];
    showPages?: boolean;
    showSelection?: boolean;
    showIndex?: boolean;
    showDetail?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    reserveSelection?: boolean;
    defaultPageSize?: number;
    defaultCurrentPage?: number;
    total?: number;
    maxHeight?: string | number;
    minHeight?: string | number;
    pageMsg?: object;
  }>(),
  {
    tableData: () => [],
    tableHeader: () => [],
    showPages: true,
    defaultPageSize: 20,
    defaultCurrentPage: 1,
    total: 0,
    // -1 为根据父组件和兄弟组件 自动适应高度
    maxHeight: -1,
    minHeight: "",
    pageMsg: () => ({
      pageSizes: [20, 40, 80, 100],
      layout: "prev, pager, next, sizes",
      small: true
    })
  }
);

onBeforeMount(() => {
  pageSize.value = props.defaultPageSize || 20;
  currentPage.value = props.defaultCurrentPage || 1;
});

const showOpts = computed(() => {
  return props.showDetail || props.showEdit || props.showDelete;
});

const tableRoleRef = ref<InstanceType<typeof ElTable>>();
// page的两个事件共用一个方法是为了能将pageSize、currentPage同时传到父级，以免数据不同步导致问题
function emitPageChange() {
  emit("pageChange", {
    currentPage: currentPage.value,
    page: currentPage.value - 1,
    pageSize: pageSize.value
  });
}
function handleClickDetail(row, column) {
  emit("handleClickDetail", row, column);
}
function handleClickEdit(row, column) {
  emit("handleClickEdit", row, column);
}
function handleClickDelete(row, column) {
  emit("handleClickDelete", row, column);
}
function headerFilterChange(val, filterParam) {
  emit("headerFilterChange", val, filterParam);
}
function showFilter(header) {
  emit("showFilter", header);
}
const sort: Array<SortType> = [];
function baseSortChange(sortParam: string) {
  const propIndex = sort.findIndex(item => item.prop === sortParam);
  let orderType: "desc" | "asc" | "" = "asc";
  if (propIndex >= 0) {
    const { order } = sort[propIndex];
    if (order === "asc") {
      orderType = "desc";
    } else {
      orderType = "";
    }
    sort.splice(propIndex, 1);
  }
  orderType && sort.push({ prop: sortParam, order: orderType });
  emit("baseSortChange", sort);
}
// 多选
const toggleSelection = (rows?: any[]) => {
  if (rows) {
    rows.forEach(row => {
      tableRoleRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    tableRoleRef.value!.clearSelection();
  }
};

defineExpose({
  toggleSelection
});
</script>

<style lang="scss" scoped>
.svg-icon {
  font-size: 16px;
}

.base-table {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

:deep(.el-pagination__sizes .el-input__wrapper) {
  height: 30px;
}
</style>
