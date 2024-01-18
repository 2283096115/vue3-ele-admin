<script setup lang="ts">
import { useSlots } from "vue";
const slots = useSlots();
defineOptions({
  name: "PlanTimeLine"
});
const props = defineProps({
  activities: {
    require: false,
    // { label: string; value: string | number }
    type: Array<any>,
    default: () => []
  }
});
</script>

<template>
  <el-timeline ref="elTimeLineRef" class="plan-time-line">
    <template v-for="k in Object.keys(slots)" #[k] :key="k">
      <slot v-if="k !== 'default'" :name="k" />
    </template>
    <slot>
      <el-timeline-item
        v-for="(item, index) in props.activities"
        :color="index === 0 ? '#3772FF' : ''"
        v-bind="item"
        :key="index"
        >{{ item.content }}</el-timeline-item
      >
    </slot>
  </el-timeline>
</template>

<style scoped lang="scss">
.plan-time-line {
  max-height: 700px;
  overflow: hidden auto;

  :deep(.el-timeline-item__timestamp) {
    padding: 23px 46px;
  }
}
</style>
