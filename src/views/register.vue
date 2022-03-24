<template>
    <div class="login register">
        <div class="flex row-center login-input">
            <div class="imgW">
                <img src="../assets/register-user-icon.png" alt class="icon40" />
            </div>
            <input
                type="text"
                placeholder="ཁ་པར་ཨང་གྲངས་འགོད་རོགས།"
                class="f30 Qomolangma"
                v-model="state.phoneVal"
            />
        </div>
        <!-- 密码 -->
        <div class="flex row-center login-input">
            <input
                type="password"
                placeholder="གསང་ཨང་འགོད་རོགས།"
                class="f30 Qomolangma"
                style="padding:0;"
                v-model="state.password"
            />
        </div>
        <!-- 确认密码 -->
        <div class="flex row-center login-input">
            <input
                type="password"
                placeholder="ཉིད་ཀྱིས་ཡང་བསྐྱར་གསང་ཨང་འགོད་རོགས།"
                class="f30 Qomolangma"
                style="padding:0;"
                v-model="state.repassword"
            />
        </div>
        <!-- 验证码 -->
        <div class="flex area-between login-input nowarp">
            <input
                type="text"
                placeholder="ཉིད་ཀྱིས་ར་སྤྲོད་ཨང་གྲངས་འགོད་རོགས།"
                class="f30 Qomolangma"
                style="padding:0;"
                v-model="state.codeVal"
            />
            <button
                class="getCode f30 Qomolangma"
                @click="getCode()"
                :disabled="state.disabled"
            >{{ state.codeName }}</button>
        </div>
        <div class="login-button f32 c333 Qomolangma register-btn" @click="register" :class="{ 'noClick': state.noClick }">ཐོ་འགོད།</div>
    </div>
    <!-- ཐོ་འགོད་ལེགས་འགྲུབ་བྱུང་པ། 注册成功 -->
</template>

<script setup>
import { getCurrentInstance, reactive } from 'vue';
import { phone } from '../utils/check.js';
import { useRouter } from 'vue-router';
const state = reactive({
    checkStatus: false,
    codeName: 'ར་སྤྲོད་ཨང་གྲངས་ལེན་པ།',
    phoneVal: '',
    disabled: false,
    codeVal: '',
    password: '',
    repassword: '',
    timer: null,
    noClick:false
})
const { proxy } = getCurrentInstance();
const router = useRouter();
function getCode() {
    if (phone(state.phoneVal)) {
        setTimer();
        proxy.$post(proxy.Apis.sendRegisterVerificationCode, {
            accountNumber: state.phoneVal,
        }).then(res => {
            if (res.code != 0) {
                state.codeName = 'ར་སྤྲོད་ཨང་གྲངས་ལེན་པ།';
                state.disabled = false;
                clearInterval(state.timer)
            } else {
                proxy.$toast(res.msg)
            }
        })
    }
}
const register = () => {
    if (phone(state.phoneVal)) {
        if (!state.password) {
            proxy.$toast.fail('གསང་ཨང་འགོད་རོགས།');
            return;
        }
        if (state.password != state.repassword) {
            proxy.$toast.fail('གསང་ཨང་སྔ་གཞུག་བཏགས་ནོར་ཤོར་འདུག');
            return;
        }
        if (!state.codeVal) {
            proxy.$toast.fail('ཉིད་ཀྱིས་ར་སྤྲོད་ཨང་གྲངས་འགོད་རོགས།');
            return;
        };
        state.noClick=true;
        proxy.$post(proxy.Apis.register, {
            accountNumber: state.phoneVal,
            verificationCode: state.codeVal,
            password: state.password,
            confirmPassword: state.repassword,
        }).then(res => {
            if (res.code != 0) {
                state.codeName = 'ར་སྤྲོད་ཨང་གྲངས་ལེན་པ།';
                state.disabled = false;
                clearInterval(state.timer);
                state.noClick=false;
            } else {
                proxy.$toast(res.msg);
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
            state.codeName = 'ར་སྤྲོད་ཨང་གྲངས་ལེན་པ།';
            state.disabled = false;
            clearInterval(state.timer)
        }
    }, 1000)
}
</script>

<style scoped lang='scss'>
.register{
    background: #fff;
}
@import "../common/login.scss";
</style>