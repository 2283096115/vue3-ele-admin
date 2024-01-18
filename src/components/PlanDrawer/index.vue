<script setup lang="ts">
import { useSlots } from "vue";
const slots = useSlots();
defineOptions({
  name: "PlanDrawer"
});
const emit = defineEmits(["update:modelValue", "clickConfirm"]);
function clickCancel() {
  // 这里以下部分可以修改为默认操作, 即关闭抽屉
  emit("update:modelValue", false);
}
function clickConfirm() {
  // 这里以下部分可以修改为默认操作, 即关闭抽屉
  // emit("update:modelValue", false);
  emit("clickConfirm");
}

const props = defineProps({
  showButton: {
    required: false,
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <el-drawer ref="elPlanDrawer" class="plan-drawer">
    <template v-for="k in Object.keys(slots)" #[k] :key="k">
      <slot :name="k" />
    </template>
    <template #footer>
      <div style="text-align: left" v-if="props.showButton == true">
        <div @click="clickCancel" class="mom-btn">取消</div>
        <div class="mom-btn mom-btn--primary" @click="clickConfirm">确认</div>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss">
.plan-drawer {
  .el-drawer__header {
    display: flex;
    align-items: center;
    height: 55px;
    padding: 0 20px;
    margin: 0;
    background-color: #f7f8fa;

    .el-drawer__title {
      font-size: 18px;
      font-weight: 700;
      color: #1d2129;
    }
  }
}
</style>
