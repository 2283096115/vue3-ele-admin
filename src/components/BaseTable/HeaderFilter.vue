<!-- HeaderSelect -->
<template>
  <div class="header-select">
    <el-input
      v-if="showSearch"
      v-model="searchValue"
      placeholder="请输入搜索内容"
      class="select-search-box"
      @keydown.enter="keydown"
      @paste="pasting"
    >
      <template #prefix>
        <el-icon><Search @click="search" /></el-icon>
      </template>
    </el-input>
    <div v-if="hasData">
      <el-checkbox-group v-model="checked" @change="change">
        <ul>
          <li v-for="item in comOptions" :key="item.key || item.value">
            <el-checkbox v-if="multiple" :label="item.value">{{
              item.label
            }}</el-checkbox>
            <span
              v-else
              :class="{ 'is-checked': curValue === item.value }"
              class="header-select__line"
              @click="change(item.value)"
              >{{ item.label }}</span
            >
          </li>
        </ul>
      </el-checkbox-group>
      <div class="header-select__button">
        <el-button size="small" @click="reset">重置</el-button>
        <el-button
          v-if="multiple"
          type="primary"
          size="small"
          @click="selectAll"
          >全选</el-button
        >
      </div>
    </div>
    <div v-else class="header-select__no-data">暂无数据</div>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";
export default defineComponent({
  name: "HeaderSelect",
  components: { Search },
  emit: ["change", "search"],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    modelValue: {
      default: ""
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    multiple: Boolean,
    options: {
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      checked: [],
      emptyTitle: "暂无数据",
      comOptions: [],
      searchValue: "",
      curValue: ""
    };
  },
  computed: {
    hasData() {
      return !!this.comOptions.length;
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        if (this.multiple) {
          if (Array.isArray(val)) {
            this.checked = val;
          } else {
            this.checked = [this.modelValue];
          }
        } else {
          this.curValue = this.modelValue;
        }
      },
      immediate: true
    },
    options: {
      handler(val) {
        this.comOptions = val;
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 主要用来对粘贴的Excel内容格式化，cell中的内容用逗号隔开，多关键词搜索
    pasting(e) {
      let str = e.clipboardData
        .getData("text")
        .toString()
        .replace(/[\t|\n]+/g, ",");
      if (str[str.length - 1] === ",") {
        str = str.substring(0, str.length - 1);
      }
      e.clipboardData.clearData();
      e.preventDefault();
      this.searchValue = str;
      this.search();
    },
    keydown(e) {
      if (e.keyCode === 13) {
        this.search();
      }
    },
    search() {
      this.computeOptions();
    },
    computeOptions() {
      if (this.searchValue) {
        const searchValueArr = this.searchValue
          .split(",")
          .filter(item => !!item);
        const comOptions = this.options.filter(item => {
          return searchValueArr.some(sea =>
            new RegExp(sea, "gi").test(item.label)
          );
        });
        this.comOptions = comOptions;
        if (comOptions.length === 0) this.emptyTitle = "无匹配数据";
      } else {
        this.comOptions = this.options;
        this.emptyTitle = "暂无数据";
      }
    },
    reset() {
      this.checked = [];
      this.change(this.multiple ? [] : "");
    },
    selectAll() {
      this.checked = this.comOptions.map(item => item.value);
      this.change(this.checked);
    },
    change(val) {
      this.curValue = val;
      this.$emit("update:modelValue", this.curValue);
      this.$emit("headerFilterChange", this.curValue);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.select-search-box {
  // margin: 10px;
  width: 100%;

  .cur-pointer {
    cursor: pointer;
  }
}

.header-select {
  ul {
    max-height: 170px;
    padding: 0;
    margin: 6px -10px;
    overflow-x: hidden;
    overflow-y: auto;
    list-style: none;

    li {
      height: 34px;
      padding: 0 10px;
      line-height: 34px;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  &__button {
    display: flex;
    justify-content: flex-end;
  }

  &__line {
    margin-left: 20px;
    font-size: 14px;
    cursor: pointer;
  }

  .is-checked {
    color: $mainColor;
  }

  &__no-data {
    height: 34px;
    line-height: 34px;
    color: $grayColor;
    text-align: center;
  }
}
</style>
