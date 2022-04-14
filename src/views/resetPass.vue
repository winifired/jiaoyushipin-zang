<template>
    <div class="login register">
        <div class="flex row-center login-input">
            <div class="imgW">
                <img src="../assets/register-user-icon.png" alt class="icon40" />
            </div>
            <input
                type="text"
                :placeholder="$t('login.phoneplace')"
                class="f30"
                v-model="state.phoneVal"
            />
        </div>
        <!-- 验证码 -->
        <div class="flex row-center login-input nowarp">
            <input
                type="text"
                :placeholder="$t('login.yanzheng')"
                class="f30"
                style="padding:0;"
                v-model="state.codeVal"
            />
            <button
                class="getCode f30"
                @click="getCode()"
                :disabled="state.disabled"
            >{{ state.codeName }}</button>
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
        <div class="login-button f32 c333 register-btn" @click="register" :class="{ 'noClick': state.noClick }">{{$t('login.save')}}</div>
    </div>
    <!-- ཐོ་འགོད་ལེགས་འགྲུབ་བྱུང་པ། 注册成功 -->
</template>

<script setup>
import { getCurrentInstance, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { phone } from '../utils/check.js';
import { useI18n } from "vue-i18n";
const state = reactive({
    codeName: '',
    phoneVal: '',
    disabled: false,
    codeVal: '',
    password: '',
    timer: null,
    noClick:false
});
 const { t,locale } = useI18n();
 document.title=t('login.setpass')
const {proxy}=getCurrentInstance();
const router=useRouter();
state.codeName = t('login.getyan');
function getCode() {
    if (phone(state.phoneVal)) {
        setTimer();
        proxy.$post(proxy.Apis.sendChangePasswordCode, {
            accountNumber: state.phoneVal,
        }).then(res => {
            if (res.code != 0) {
                state.codeName = t('login.getyan');
                state.disabled = false;
                clearInterval(state.timer)
            } else {
                proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan);
            }
        })
    }
}
const register = () => {
    if (phone(state.phoneVal)) {
        if (!state.codeVal) {
            proxy.$toast.fail(t('login.yanzheng'));
            return;
        }
        if (!state.password) {
            proxy.$toast.fail(t('login.passplace'));
            return;
        }
        state.noClick=true;
        proxy.$post(proxy.Apis.changePassword, {
            accountNumber: state.phoneVal,
            verificationCode: state.codeVal,
            password: state.password,
            confirmPassword: state.password,
        }).then(res => {
            if (res.code != 0) {
                state.codeName = t('login.getyan');
                state.disabled = false;
                clearInterval(state.timer);
                state.noClick=false;
            } else {
                proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan);
                router.replace('/login');
            }
        })
    }
}
function setTimer() {
    let num = 60;
    state.disabled = true;
    state.timer = setInterval(() => {
        if (num > 1) {
            num--;
            state.codeName = num + 's';
        } else {
            state.codeName = t('login.getyan');
            state.disabled = false;
            clearInterval(state.timer)
        }
    }, 1000)
}
</script>

<style scoped lang='scss'>
@import "../common/login.scss";
</style>