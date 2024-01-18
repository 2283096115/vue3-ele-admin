<script setup lang="ts">
import { useSlots, ref } from "vue";
import { SelectItem } from "./type";

const slots = useSlots();
const elSelectRef = ref(null);
defineOptions({
  name: "PlanSelect"
});
defineExpose({
  elSelectRef // <script setup>的组件里的属性默认是关闭的，需通过defineExpose暴露出去才能被调用
});
const props = withDefaults(
  defineProps<{
    options: Array<SelectItem>;
  }>(),
  {
    options: () => []
  }
);
</script>

<template>
  <el-select ref="elSelectRef">
    <template v-for="k in Object.keys(slots)" #[k] :key="k">
      <slot v-if="k !== 'default'" :name="k" />
    </template>
    <slot>
      <el-option
        v-for="item in props.options"
        v-bind="item"
        :key="item.value"
      />
    </slot>
  </el-select>
</template>
