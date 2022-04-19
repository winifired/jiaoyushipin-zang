<template>
    <div class="login" :style="{ height: focusStatus ? innerHeight : '100vh' }">
        <div class="f40 c333">{{ $t('login.title') }}</div>
        <div class="flex row-center login-input">
            <div class="imgW">
                <img src="../assets/user-icon.png" alt class="icon40" />
            </div>
            <input
                style="width: 80%;"
                type="text"
                :placeholder="$t('login.phoneplace')"
                class="f30"
                v-model="phoneVal"
                @focus="getFocus"
                @blur="getBlur"
            />
        </div>
        <div class="flex row-center login-input nowarp">
            <input

                type="text"
                :placeholder="$t('login.yanzheng')"
                class="f30"
                style="padding:0;width:40%"
                v-model="codeVal"
                @focus="getFocus"
                @blur="getBlur"
            />
            <button
                class="getCode f30"
                @click="getCode()"
                :disabled="disabled"
            >{{ codeName }}</button>
        </div>
        <div class="flex area-between elesItem">
            <router-link to="/login" replace class="Qomolangma f24 c333">{{ $t('login.milogin') }}</router-link>
            <router-link to="/resetPass" class="Qomolangma f24 c333">{{ $t('login.setpass') }}</router-link>
        </div>
        <div class="login-button f32 c333" @click="login">{{ $t('login.login') }}</div>
        <div class="f26 c777 register flex area-center">
            {{ $t('login.noacount') }}
            <router-link to="/register" class="c295">{{ $t('login.goregister') }}</router-link>
        </div>
        <div
            class="fixedbottom2 flex area-center f24 c777"
            @click.stop="checkStatus = !checkStatus"
            style="background:#fff"
        >
            <img src="../assets/check-icon.png" alt v-if="!checkStatus" class="icon44" />
            <img src="../assets/checked-icon.png" alt v-else class="icon44" />
            {{ $t('login.agree') }}
            <router-link to="/asidePage/1" class="c295">《{{ $t('login.useragree') }}》</router-link>
            {{ $t('login.he') }}
            <router-link to="/asidePage/2" class="c295">《{{ $t('login.yinsi') }}》</router-link>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onActivated, reactive, ref, toRefs } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { phone } from '../utils/check.js';
import { useI18n } from "vue-i18n";
export default {
    name: 'loginCode',
    setup() {
        const state = reactive({
            checkStatus: false,
            codeName: '',
            phoneVal: '',
            disabled: false,
            codeVal: '',
            timer: null
        });
        const { t,locale } = useI18n();
        document.title = t('dl');
        const { proxy } = getCurrentInstance();
        state.codeName = t('login.getyan');
        console.log(proxy)
        const router = useRouter();
        const store = useStore();
        const focusStatus = ref(false);
        const innerHeight = sessionStorage.getItem('innerHeight') + 'px';
        onActivated(() => {
            router.afterEach((to, from) => {
                if (to.path.indexOf("asidePage") == -1 && from.path.indexOf("asidePage") == -1) {
                    state.checkStatus = false;
                    state.codeName = t('login.getyan');
                    state.phoneVal = '';
                    state.disabled = false;
                    state.codeVal = '';
                    state.timer = null
                }
            });
        })
        function getFocus() {
            focusStatus.value = true;
        }
        function getBlur() {
            focusStatus.value = false;
        }
        function getCode() {
            if (phone(state.phoneVal)) {
                setTimer();
                proxy.$post(proxy.Apis.sendLoginVerificationCode, {
                    phoneNumber: state.phoneVal,
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
        function login() {
            if (phone(state.phoneVal)) {
                if (!state.codeVal) {
                    proxy.$toast.fail(t('login.yanzheng'));
                    return;
                }
                if (!state.checkStatus) {
                    proxy.$toast.fail(t('login.tongyi'));
                    return;
                }
                proxy.$post(proxy.Apis.verificationCodeLogin, {
                    phoneNumber: state.phoneVal,
                    verificationCode: state.codeVal,
                }).then(res => {
                    if (res.code != 0) {
                        state.codeName = t('login.getyan');
                        state.disabled = false;
                        clearInterval(state.timer)
                    } else {
                        proxy.$toastt('login.successlogin');
                        store.commit('setUsrid', res.data.id);
                        store.commit('setUserinfo', res.data);
                        router.replace('/');
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
        return {
            ...toRefs(state),
            focusStatus,
            innerHeight,
            getFocus,
            getBlur,
            getCode,
            login,
        }
    }
}
</script>

<style scoped lang='scss'>
@import "../common/login.scss";
</style>