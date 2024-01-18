<script setup lang="ts">
const route = useRoute();
const levelList = ref([]);
const router = useRouter();

const getBreadcrumb = (): void => {
  const matched = router.currentRoute.value.matched;
  levelList.value = matched.filter(
    item => item?.meta && item?.meta.title !== false
  );
};

onMounted(() => {
  getBreadcrumb();
});

watch(
  () => route.path,
  () => {
    getBreadcrumb();
  },
  {
    deep: true
  }
);
</script>

<template>
  <el-breadcrumb class="!leading-[50px] select-none" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        class="!inline !items-stretch"
        v-for="item in levelList"
        :key="item.path"
      >
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
@import "@/style/variables.scss";

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: $mainColor;
}
</style>
