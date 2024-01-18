import { ElDatePicker, ElTableColumn } from "element-plus";
import { SelectItem } from "@/components/PlanSelect/type";

/** el-date-picker props类型 */
export type ElDatePickerProps = InstanceType<typeof ElDatePicker>["$props"];
/** el-table-column props类型 */
export type ElTableColumnProps = InstanceType<typeof ElTableColumn>["$props"];

/**
 * 排序类型
 */
export type SortType = { prop: string; order: "desc" | "asc" };

/** 表头类型 */
export type headerType = {
  // label
  label: string;
  prop: string;
  /** 是否显示过滤器 **/
  hasFilter?: boolean;
  /** 是否显示select过滤器的筛选功能 默认开启 **/
  showSearch?: boolean;
  /** 过滤器展示内容 ComputedRef<SelectItem[]> 能让options成为响应式数据 这个地方用Ref没有意义，computed内部的响应式数据改变后，会改变这里的取值，ref不行 */
  options?: Array<SelectItem> | ComputedRef<SelectItem[]> | Ref<SelectItem[]>;
  /** 筛选时添加的参数 默认 prop */
  filterParam?: string;
  /** 筛选类型 默认input */
  type?: "input" | "select" | "date";
  /** 过滤器是否多选 */
  multiple?: boolean;
  /** 过滤器默认值 */
  value?: any;
  /** 是否需要排序 */
  hasSort?: boolean;
  /** 排序输入参数 默认 prop */
  sortParam?: string;
  /** children */
  headerChildren?: Array<headerType>;
  /** 日期选择器props 会通过v-bind 绑定到 el-date-picker组件上 */
  dateOpts?: ElDatePickerProps;
  /** el-table-column props 会通过v-bind 绑定到 el-table-column组件上 */
  columnOpts?: ElTableColumnProps;
};
