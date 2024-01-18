<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Remove } from "@element-plus/icons-vue";

import { getMouldChildApi } from "@/api/shortResourceDemand";

const props = defineProps<{
  modelValue: string | null;
  search: {
    mouldGroup: Object | null;
  };
  backUp?: Boolean;
  index?: {
    mouldNo: Object | null;
  };
}>();

const emit = defineEmits(["update:modelValue", "clickDown", "delete"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});
const curNo = ref();
watch(
  () => props.index,
  async val => {
    curNo.value = val;
  },
  {
    immediate: true,
    deep: true
  }
);

const list = ref([]);
const searchChild = async () => {
  // console.log(props.search.mouldGroup);
  // const child = props.modelValue?.split("#")[0].split("-")[0];
  const { data } = await getMouldChildApi({
    modelGroup: props.search.mouldGroup
  });
  // console.log(data);
  list.value = data;
};

const backUplist = ref(["是", "否"]);
const handleDelete = () => {
  emit("delete", curNo.value.mouldNo);
};

const handleClick = () => {
  emit("clickDown");
};

onMounted(() => {});
</script>

<template>
  <div class="select-cell">
    <div class="select-cell-icon" v-if="!backUp" @click="handleDelete">
      <el-icon>
        <Remove />
      </el-icon>
    </div>
    <div>
      <el-select
        v-if="backUp"
        v-model="value"
        placeholder=""
        clearable
        @change="handleClick"
      >
        <el-option
          v-for="(i, k) in backUplist"
          :key="k"
          :label="i"
          :value="i"
        />
      </el-select>
      <el-select
        v-else
        v-model="value"
        placeholder=""
        @click="searchChild"
        clearable
      >
        <el-option v-for="(i, k) in list" :key="k" :label="i" :value="i" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-cell {
  display: flex;
  height: 40px;

  &-icon {
    height: 40px;
    margin-right: 10px;
    line-height: 40px;
  }
}
</style>
