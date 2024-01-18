<script setup lang="ts">
import appMain from "./components/appMain.vue";
import Breadcrumb from "./components/sidebar/breadCrumb.vue";
import Horizontal from "./components/sidebar/horizontal.vue";
</script>

<template>
  <div class="app-wrapper">
    <Horizontal />
    <Breadcrumb class="breadcrumb-container" />
    <app-main />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
}

.breadcrumb-container {
  margin-left: 20px;
}
</style>
