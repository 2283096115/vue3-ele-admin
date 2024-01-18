<template>
  <div class="lz-dialog">
    <el-dialog
      v-model="dialogShow"
      :title="obj.dialogTitle"
      :width="obj.dialogWidth"
      :before-close="close"
    >
      <template #header>
        <div class="base-info-title base-info-title--dialog">
          {{ obj.dialogTitle }}
        </div>
      </template>
      <el-upload
        class="upload-demo"
        drag
        ref="uploadRef"
        action=""
        :limit="1"
        multiple
        accept=".xlsx,.xls"
        :auto-upload="false"
        :on-exceed="handleExceed"
        :on-change="changeFile"
        :before-upload="beforeUpload"
      >
        <div class="upload-box">
          <img src="@/assets/images/upload.png" />
        </div>
        <div class="el-upload__text upload-tip">
          将文件拖到此处，或 <em>点击上传</em>
        </div>
        <div class="tip-type" style="text-align: center">
          <div>
            1.点击<span class="upload-template" @click.stop="downloadTemplate"
              >下载</span
            ><span>{{ obj.dialogText }}</span
            >导入模板
          </div>
          <div class="tip-type">2.支持扩展名 .xlsx .xls</div>
          <div class="mom-btn mom-btn--primary upload-btn">上传文件</div>
        </div>
      </el-upload>

      <template #footer>
        <span v-if="obj.dialogIsFooter" class="dialog-footer">
          <div class="mom-btn" @click="close">
            {{ obj.dialogCloseBtnText }}
          </div>
          <div class="mom-btn mom-btn--primary" @click="success">
            {{ obj.dialogSuccessBtnText }}
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  dialogObject: {
    type: Object
  }
});
const emit = defineEmits(["dialogClose", "dialogSuccess", "download"]);
const uploadRef = ref(null);
// setup(props, ctx) {
// const dialogObj = reactive(inject('dialogObj'))
// 处理props的数据 重新定义 dialogVisible
const dialogShow = computed({
  get() {
    // getter
    return props.dialogObject.dialogVisible;
  },
  set(val) {
    // console.log(val)
    return val;
  }
});

const cancelImportExls = () => {
  uploadRef.value.clearFiles();
  fileList.value = []; // 上传的文件
};

const downloadTemplate = () => {
  emit("download");
};

const obj = {
  dialogTitle: props.dialogObject.title || "标题",
  dialogWidth: props.dialogObject.width || "30%",
  dialogCloseBtnText: props.dialogObject.closeBtnText || "取消",
  dialogSuccessBtnText: props.dialogObject.successBtnText || "成功",
  dialogIsFooter: props.dialogObject.isFooter || false,
  dialogText: props.dialogObject.text
};
const close = () => {
  emit("dialogClose", false, "close");
  cancelImportExls();
};
const success = () => {
  emit("dialogSuccess", fileList.value);
};

const fileList = ref([]); // 上传的文件
const handleExceed = files => {
  $message.warning(`最多上传 1 个文件, 你选择了 ${files.length} 个文件！`);
};
const changeFile = async uploadFile => {
  fileList.value.push(uploadFile);
};

//上传文件格式校验
const beforeUpload = (file: any) => {
  const testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
  const extension = testmsg === "xlsx";
  if (!extension) {
    $message({
      message: "上传文件只能是.xlsx格式!",
      type: "warning"
    });
  }
  return extension;
};
</script>
<style lang="scss">
.lz-dialog {
  border-radius: 4px;

  .el-dialog__header {
    padding: 30px;

    .el-dialog__headerbtn {
      top: 0;
      height: 90px;
    }
  }

  .el-dialog__body {
    padding: 0 30px 30px;

    .upload-template {
      display: inline-block;
      font-size: 14px;
      color: var(--el-color-primary);
      cursor: pointer;
    }

    .upload-box {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .upload-btn {
      margin-top: 20px;
    }

    .tip-type {
      margin-top: 15px;
      color: #86909c;
    }

    .upload-tip {
      font-size: 16px;
      color: #86909c;
    }
  }

  .el-dialog__footer {
    padding: 0 30px 30px;
  }
}
</style>
