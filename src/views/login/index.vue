<template>
  <div class="login-container">
    <div class="login-container__logo" />
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
    >
      <div class="title-container">
        <h1>欢迎登录</h1>
      </div>
      <el-form-item prop="username" style="margin-bottom: 30px">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入账号信息"
          name="username"
          :prefix-icon="User"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          name="password"
          auto-complete="on"
          :prefix-icon="Lock"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      <el-button
        type="primary"
        style="
          width: 100%;
          height: 50px;
          margin-top: 40px;
          font-size: 20px;
          border-radius: 10px;
        "
        @click.prevent="handleLogin"
        >登 录</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
import { useUserStoreHook } from "@/store/modules/user";
import { Lock, User } from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter();

const loginForm = shallowReactive({
  username: "",
  password: ""
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入账号!" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码!" }]
};
const redirect = ref("");
const otherQuery = ref({});

watch(
  route,
  route => {
    const query = route.query;
    if (query) {
      redirect.value = query.redirect;
      otherQuery.value = getOtherQuery(query);
    }
  },
  { immediate: true }
);
const loginFormRef = ref(null);
function handleLogin() {
  loginFormRef.value.validate(valid => {
    if (valid) {
      useUserStoreHook()
        .loginByUsername({
          username: loginForm.username,
          password: loginForm.password
        })
        .then(() => {
          router.push({
            path: redirect.value || "/",
            query: otherQuery.value
          });
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
}
function getOtherQuery(query) {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== "redirect") {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-image: url("@/assets/images/login.png");
  background-size: cover;

  &__logo {
    position: absolute;
    top: 49px;
    left: 60px;
    width: 288px;
    height: 30px;
    background: url("@/assets/images/logo.png");
  }

  .login-form {
    position: absolute;
    top: 290px;
    right: 187px;
    width: 476px;
    height: 500px;
    padding: 50px 78px 0;
    overflow: hidden;
    background: url("@/assets/images/login_square.png");

    :deep(.el-input__wrapper) {
      height: 50px;
      border-radius: 10px;
    }

    :deep(.el-input__inner) {
      height: 50px;
    }

    :deep(.el-input__icon) {
      line-height: 50px;
    }
  }

  .title-container {
    margin-bottom: 46px;
    text-align: center;
  }
}
</style>
