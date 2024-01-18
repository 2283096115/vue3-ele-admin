<script setup lang="ts">
import { h, computed, Transition, defineComponent } from "vue";

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const transitionMain = defineComponent({
  render() {
    return h(
      Transition,
      {
        name: "fade-transform",
        enterActiveClass: transitions.value(this.route) && `animate__animated `,
        leaveActiveClass: transitions.value(this.route) && `animate__animated `,
        mode: "out-in",
        appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  },
  props: {
    route: {
      type: undefined,
      required: true
    }
  }
});
</script>

<template>
  <div class="app-main">
    <router-view>
      <template #default="{ Component, route }">
        <transitionMain :route="route">
          <component
            :is="Component"
            :key="route.fullPath"
            class="main-content"
          />
        </transitionMain>
      </template>
    </router-view>
  </div>
</template>

<style scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100%;
  height: calc(100vh - 120px);
}

.main-content {
  margin: 0 20px;
}
</style>
