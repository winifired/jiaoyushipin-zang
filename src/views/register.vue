<template>
  <div class="login register">
    <div class="flex row-center login-input">
      <div class="imgW">
        <img src="../assets/register-user-icon.png" alt class="icon40" />
      </div>
      <input
        style="width: 80%;"
        type="text"
        :placeholder="$t('login.phoneplace')"
        class="f30"
        v-model="state.phoneVal"
      />
    </div>
    <!-- 密码 -->
    <div class="flex row-center login-input">
      <input
        type="password"
        :placeholder="$t('login.passplace')"
        class="f30"
        style="padding:0;"
        v-model="state.password"
      />
    </div>
    <!-- 确认密码 -->
    <div class="flex row-center login-input">
      <input
        type="password"
        :placeholder="$t('login.agaonpass')"
        class="f30"
        style="padding:0;"
        v-model="state.repassword"
      />
    </div>
    <!-- 验证码 -->
    <div class="flex area-between login-input nowarp">
      <input
        type="text"
        :placeholder="$t('login.yanzheng')"
        class="f30"
        style="padding:0;width: 40%;"
        v-model="state.codeVal"
      />
      <button class="getCode f30" @click="getCode()" :disabled="state.disabled">{{ state.codeName }}</button>
    </div>
    <div
      class="login-button f32 c333 register-btn"
      @click="register"
      :class="{ 'noClick': state.noClick }"
    >{{$t('login.register')}}</div>
  </div>
  <!-- ཐོ་འགོད་ལེགས་འགྲུབ་བྱུང་པ། 注册成功 -->
</template>

<script setup>
import { getCurrentInstance, reactive } from "vue";
import { phone } from "../utils/check.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const state = reactive({
  checkStatus: false,
  codeName: "",
  phoneVal: "",
  disabled: false,
  codeVal: "",
  password: "",
  repassword: "",
  timer: null,
  noClick: false,
});
const { t, locale } = useI18n();
document.title = t("login.register");
const { proxy } = getCurrentInstance();
const router = useRouter();
state.codeName = t("login.getyan");
function getCode() {
  if (phone(state.phoneVal)) {
    setTimer();
    proxy
      .$post(proxy.Apis.sendRegisterVerificationCode, {
        accountNumber: state.phoneVal,
      })
      .then((res) => {
        if (res.code != 0) {
          state.codeName = t("login.getyan");
          state.disabled = false;
          clearInterval(state.timer);
        } else {
          proxy.$toast(locale.value == "zh" ? res.msg : res.msgTibetan);
        }
      });
  }
}
const register = () => {
  if (phone(state.phoneVal)) {
    if (!state.password) {
      proxy.$toast.fail(t("login.passplace"));
      return;
    }
    if (state.password != state.repassword) {
      proxy.$toast.fail(t("login.twopassno"));
      return;
    }
    if (!state.codeVal) {
      proxy.$toast.fail(t("login.yanzheng"));
      return;
    }
    state.noClick = true;
    proxy
      .$post(proxy.Apis.register, {
        accountNumber: state.phoneVal,
        verificationCode: state.codeVal,
        password: state.password,
        confirmPassword: state.repassword,
      })
      .then((res) => {
        if (res.code != 0) {
          state.codeName = t("login.getyan");
          state.disabled = false;
          clearInterval(state.timer);
          state.noClick = false;
        } else {
          proxy.$toast(locale.value == "zh" ? res.msg : res.msgTibetan);
          router.replace("/login");
        }
      });
  }
};
function setTimer() {
  let num = 60;
  state.disabled = true;
  state.timer = setInterval(() => {
    if (num > 1) {
      num--;
      state.codeName = num + "s";
    } else {
      state.codeName = t("login.getyan");
      state.disabled = false;
      clearInterval(state.timer);
    }
  }, 1000);
}
</script>

<style scoped lang='scss'>
.register {
  background: #fff;
}
@import "../common/login.scss";
</style>