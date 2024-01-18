<script setup lang="ts">
import { ref, computed } from "vue";
import Edit from "@/assets/images/edit.png";

const props = defineProps<{ modelValue: string | number | null }>();

const emit = defineEmits(["update:modelValue", "keydownEnter"]);

const showInput = ref(false);
const showImg = ref(false);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});

function mouseenter() {
  showImg.value = true;
}
function mouseleave() {
  showImg.value = false;
}
function clickImg() {
  showImg.value = false;
  showInput.value = true;
}

function keydownEnter() {
  emit("keydownEnter", value);
  showInput.value = false;
}
</script>

<template>
  <div class="edit-cell" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <el-input
      v-show="showInput"
      v-model="value"
      oninput="value=value.replace(/[^0-9.]/g,'')"
      @keydown.enter="keydownEnter"
    />
    <div
      class="el-input el-input__wrapper"
      v-show="!showInput"
      style="box-shadow: none"
    >
      {{ value }}
    </div>
    <img v-show="!showInput && showImg" :src="Edit" @click="clickImg" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.edit-cell {
  position: relative;
  width: 100%;
  height: 100%;

  & > img {
    position: absolute;
    top: 2px;
    right: 10px;
  }
}
</style>
