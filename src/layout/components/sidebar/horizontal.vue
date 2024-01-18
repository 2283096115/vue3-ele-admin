<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import SidebarItem from "./sidebarItem.vue";

import { deepClone } from "@/utils/index";

import { useUserInfoHook } from "@/store/modules/permission";
const userStore = useUserInfoHook();

const menuRef = ref();

const { route, logout } = useNav();

nextTick(() => {
  menuRef.value?.handleResize();
});

function filterShowLink(menus: any[]) {
  const temp = menus.filter(item => {
    return item.meta?.showLink !== false;
  });
  menus.forEach(item => {
    if (item.children?.length > 0) {
      item.children = filterShowLink(item.children);
    }
  });
  return temp;
}

function filterShowLinkNew(menus: any[]) {
  const temp = menus.filter(item => {
    return item.meta?.showMenu !== false;
  });
  menus.forEach(item => {
    if (item.children?.length > 0) {
      item.children = filterShowLinkNew(item.children);
    }
  });
  return temp;
}

let filterMenus = [];
let filterMenusNew = [];
let filternew = [];
onBeforeMount(() => {
  filterMenus = filterShowLink(userStore.routes);
  filternew = deepClone(filterMenus);
  filterMenusNew = filterShowLinkNew(filternew);
});

const defaultActive = ref(route.path);
function handleSelect(indexPath) {
  defaultActive.value = indexPath;
}
computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>

<template>
  <div class="horizontal-header">
    <div class="horizontal-header-left">
      <img src="@/assets/login/logo.png" alt="logo" />
    </div>
    <el-menu
      router
      ref="menuRef"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
      @select="indexPath => handleSelect(indexPath)"
    >
      <sidebar-item
        v-for="route in filterMenusNew"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <el-icon><IconSvg-Refresh /></el-icon>
      <el-icon><IconSvg-classify /></el-icon>
      <el-icon><IconSvg-user /></el-icon>
      <el-icon size="22px"><IconSvg-switch /></el-icon>
      <el-icon><IconSvg-switchLang /></el-icon>
      <el-icon @click="logout"><IconSvg-logout /></el-icon>
    </div>
  </div>
</template>
