<script setup lang="ts">
// table表会根据视图 自动调整高度
import { headerType } from "@/components/BaseTable/type";
import { checkPermission } from "@/utils";
import { orderType, orderTypeMap } from "@/utils/view";

const asyncFilter = ref([]);
setTimeout(() => {
  asyncFilter.value = [
    { label: "挤压", value: "挤压" },
    { label: "时效", value: "时效" },
    { label: "裁切", value: "裁切" }
  ];
}, 1000);
// table组
const total = ref(0);
let pageSize = 20;
let page = 0;
const tableData = ref([]);
const tableHeader: headerType[] = [
  {
    label: "序号",
    prop: "id"
  },
  {
    label: "工序",
    prop: "workProcess",
    hasFilter: true,
    type: "select",
    multiple: false,
    options: asyncFilter,
    // filterParam 可不填 默认prop 当前即是workProcess
    value: ""
  },
  {
    label: "类型",
    prop: "orderType",
    hasFilter: true,
    type: "select",
    showSearch: false,
    options: orderType,
    filterParam: "orderType",
    value: []
  },
  {
    label: "客户编号",
    prop: "customerNo",
    hasFilter: true,
    value: ""
  },
  {
    label: "下单时间",
    prop: "orderDate",
    hasFilter: true,
    type: "date",
    value: ""
  },
  {
    label: mom_$t("global.unit"),
    prop: "unit"
  },
  {
    label: "扩展",
    prop: "exp",
    headerChildren: [
      {
        label: "扩展1",
        prop: "exp1"
      },
      {
        label: "扩展2",
        prop: "exp2"
      }
    ]
  }
];
const otherParams: any = {};
function getTableParams() {
  const params: any = {
    page: page,
    size: pageSize,
    ...otherParams
  };
  return params;
}
async function getTableData() {
  const params = getTableParams();
  // 筛选功能本来是将这个参数传给后端的 做过滤
  console.log(params);
  const temp = [
    {
      id: 1,
      workProcess: "挤压",
      orderDate: "2016-05-03",
      orderType: "NEW_PRODUCT",
      unit: "kg",
      customerNo: 123456,
      exp1: "扩展1",
      exp2: "扩展2"
    },
    {
      id: 2,
      workProcess: "时效",
      orderDate: "2016-06-35",
      orderType: "CUSTOMER_SCHEDULE",
      unit: "m",
      customerNo: 335566,
      exp1: "扩展3",
      exp2: "扩展4"
    },
    {
      id: 3,
      workProcess: "裁切",
      orderDate: "2016-07-23",
      orderType: "NORMAL_SALE",
      unit: "s",
      customerNo: 446622,
      exp1: "扩展5",
      exp2: "扩展6"
    }
  ];
  for (let index = 0; index < 20; index++) {
    temp.push({
      id: 10 + index,
      workProcess: "挤压",
      orderDate: "2016-05-03",
      orderType: "NEW_PRODUCT",
      unit: "kg",
      customerNo: 123456,
      exp1: "扩展1",
      exp2: "扩展2"
    });
  }
  tableData.value = temp;
  total.value = tableData.value.length;
}
function pageChange(pageProp) {
  page = pageProp.page;
  pageSize = pageProp.pageSize;
  getTableData();
}
function headerFilterChange(val, filterParam) {
  otherParams[filterParam] = val;
  getTableData();
}
// 锁定 解锁
let selectRowIds = [];
function handleSelectionChange(rows) {
  selectRowIds = rows.map(item => item.id);
  console.log(selectRowIds);
}
function clickButton() {
  console.log("点击了按钮");
}

onMounted(() => {
  getTableData();
});
</script>

<template>
  <div class="table-box">
    <div class="m-[20px]">
      <div
        class="mom-btn mom-btn--primary"
        v-if="checkPermission('table:add')"
        @click="clickButton"
      >
        按钮
      </div>
    </div>
    <BaseTable
      class="flex-grow"
      :table-data="tableData"
      :table-header="tableHeader"
      :total="total"
      showSelection
      reserve-selection
      row-key="id"
      @pageChange="pageChange"
      @headerFilterChange="headerFilterChange"
      @selection-change="handleSelectionChange"
    >
      <template v-slot="{ row, column: { property } }">
        <span v-if="property === 'orderType'">{{
          orderTypeMap[row[property]]
        }}</span>
        <span v-else>{{ row[property] }}</span>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped lang="scss">
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
