<template>
  <el-table-column min-width="100" v-bind="comColumnOpt(props.headerItem)">
    <template #header>
      <div class="header-cell">
        <div
          class="mr-[4px] w-auto ellipsis-text"
          :title="props.headerItem.label"
        >
          {{ props.headerItem.label }}
        </div>
        <el-popover
          v-if="props.headerItem.hasFilter"
          placement="bottom"
          width="auto"
          :persistent="false"
          trigger="click"
          @before-enter="showFilter(props.headerItem)"
        >
          <template #reference>
            <el-icon class="svg-icon mr-[4px]">
              <IconSvgFilter />
            </el-icon>
          </template>
          <template v-slot>
            <HeaderFilter
              v-if="props.headerItem.type === 'select'"
              v-model="filterValue"
              :multiple="props.headerItem.multiple !== false"
              :showSearch="props.headerItem.showSearch !== false"
              :options="props.headerItem.options || []"
              @headerFilterChange="
                headerFilterChange(
                  props.headerItem.filterParam || props.headerItem.prop
                )
              "
            />
            <el-date-picker
              :teleported="false"
              v-else-if="props.headerItem.type === 'date'"
              v-model="filterValue"
              v-bind="comDateOpt(props.headerItem)"
              @change="
                baseDateChange(headerItem.filterParam || headerItem.prop)
              "
            />
            <el-input
              v-else
              v-model="filterValue"
              placeholder="请输入"
              @keydown.enter="
                headerFilterChange(
                  props.headerItem.filterParam || props.headerItem.prop
                )
              "
            >
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </template>
        </el-popover>
        <el-icon
          v-if="props.headerItem.hasSort"
          class="svg-icon"
          @click="
            baseSortChange(props.headerItem.sortParam || props.headerItem.prop)
          "
        >
          <IconSvgSort />
        </el-icon>
      </div>
    </template>
    <template
      v-if="!comHasChildren(props.headerItem)"
      v-slot="{ row, column, $index }"
    >
      <slot :row="row" :column="column" :index="$index">
        <div>{{ row[props.headerItem.prop] }}</div>
      </slot>
    </template>
    <template v-if="comHasChildren(props.headerItem)">
      <BaseTableColumn
        v-for="chiHea in props.headerItem.headerChildren"
        :key="chiHea.prop"
        :header-item="chiHea"
        @headerFilterChange="headerFilterChange"
        @showFilter="showFilter"
        @baseSortChange="baseSortChange"
      />
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
import { DATE_FORMAT_DATE } from "@/utils/date";
import { Search } from "@element-plus/icons-vue";
import { ElDatePickerProps, ElTableColumnProps, headerType } from "./type";

const props = defineProps<{
  headerItem: headerType;
}>();

const emit = defineEmits([
  "headerFilterChange",
  "showFilter",
  "baseSortChange"
]);
const defaultValue = props.headerItem.type === "input" ? "" : [];
const filterValue = ref(props.headerItem.value || defaultValue);
function comHasChildren(headerItem: headerType) {
  return headerItem.headerChildren?.length > 0;
}

function comDateOpt(headerItem: headerType): ElDatePickerProps {
  const {
    valueFormat = DATE_FORMAT_DATE,
    format = DATE_FORMAT_DATE,
    type = "daterange"
  } = headerItem.dateOpts || {};
  return { valueFormat, format, type, ...headerItem.dateOpts };
}
function comColumnOpt(headerItem: headerType): ElTableColumnProps {
  const { label, prop, columnOpts } = headerItem || {};

  return { label, prop, ...columnOpts };
}

function headerFilterChange(filterParam) {
  emit("headerFilterChange", filterValue.value, filterParam);
}
async function showFilter(header) {
  await emit("showFilter", header);
}
async function baseSortChange(sortParam: string) {
  emit("baseSortChange", sortParam);
}
async function baseDateChange(filterParam) {
  emit("headerFilterChange", filterValue.value, filterParam);
}
</script>
<style scoped lang="scss">
.header-cell {
  display: flex;
  align-items: center;
}

.svg-icon {
  font-size: 14px;
}
</style>
