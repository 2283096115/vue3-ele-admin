<script setup lang="ts">
import path from "path";
import { menuType } from "../../types";
import { ref, toRaw, PropType, computed, CSSProperties } from "vue";

const props = defineProps({
  item: {
    type: Object as PropType<menuType>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    alignItems: "center"
  };
});

const getsubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 5px 0 0"
  };
});

const onlyOneChild: menuType = ref(null);

function hasOneShowingChild(children: menuType[] = [], parent: menuType) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (showingChildren[0]?.meta?.showParent) {
    return false;
  }

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  } else {
    // 使用path.posix.resolve替代path.resolve 避免windows环境下使用electron出现盘符问题
    return path.posix.resolve(props.basePath, routePath);
  }
}
</script>

<template>
  <el-menu-item
    v-if="
      hasOneShowingChild(props.item.children, props.item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
    :index="resolvePath(onlyOneChild.path)"
    :class="{ 'submenu-title-noDropdown': !isNest }"
    :style="getNoDropdownStyle"
  >
    <div
      v-if="toRaw(props.item.meta.icon)"
      class="sub-menu-icon"
      :style="getsubMenuIconStyle"
    >
      <component
        :is="
          toRaw(onlyOneChild.meta.icon) ||
          (props.item.meta && toRaw(props.item.meta.icon))
        "
      />
    </div>
    <template #title>
      <span>
        {{ onlyOneChild.meta.title }}
      </span>
    </template>
  </el-menu-item>
  <el-sub-menu v-else ref="subMenu" :index="resolvePath(props.item.path)">
    <template #title>
      <div
        v-if="toRaw(props.item.meta.icon)"
        :style="getsubMenuIconStyle"
        class="sub-menu-icon"
      >
        <component :is="props.item.meta && toRaw(props.item.meta.icon)" />
      </div>
      <span>
        {{ props.item.meta.title }}
      </span>
    </template>
    <sidebar-item
      v-for="child in props.item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>
