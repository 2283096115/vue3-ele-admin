<script setup lang="ts">
const props = defineProps({
  title: String
});
defineOptions({
  name: "IconTitle"
});
</script>

<template>
  <div class="flex global-title">
    <div class="title-icon" />
    <div class="">{{ props.title }}</div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/variables.scss";

.global-title {
  margin: 20px 0;
  line-height: 16px;
}

.title-icon {
  width: 3px;
  height: 14px;
  margin-top: 1px;
  margin-right: 6px;
  background: $mainColor;
  border-radius: 2px;
}
</style>
