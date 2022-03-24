<template>
    <div class="login" :style="{ height: focusStatus ? innerHeight : '100vh' }">
        <div class="f40 c333 Qomolangma">{{$t('login.title')}}</div>
        <div class="flex row-center login-input">
            <div class="imgW">
                <img src="../assets/user-icon.png" alt class="icon40" />
            </div>
            <input
                type="text"
                :placeholder="$t('login.phoneplace')"
                class="f30 Qomolangma"
                v-model="phoneVal"
                @focus="getFocus"
                @blur="getBlur"
            />
        </div>
        <div class="flex row-center login-input nowarp">
            <input
                type="text"
                :placeholder="$t('login.phoneplace')"
                class="f30 Qomolangma"
                style="padding:0;"
                v-model="codeVal"
                @focus="getFocus"
                @blur="getBlur"
            />
            <button
                class="getCode f30 Qomolangma"
                @click="getCode()"
                :disabled="disabled"
            >{{ codeName }}</button>
        </div>
        <div class="flex area-between elesItem">
            <router-link
                to="/login"
                replace
                class="Qomolangma f24 c333"
            >ར་སྤྲོད་ཨང་ཀིས་ཐོ་འགོད་བྱེད་པ།</router-link>
            <router-link to="/resetPass" class="Qomolangma f24 c333">སྒྲིག་འགོད། གསང་ཨང་བརྗེ་བ།</router-link>
        </div>
        <div class="login-button f32 c333 Qomolangma" @click="login">ཐོ་འགོད།</div>
        <div class="f26 c777 Qomolangma register flex area-center">
            མིག་སྔར་རྩིས་ཐོའི་ཨང་གྲངས་མི་འདུག་པས།
            <router-link to="/register" class="c295">འཕྲལ་མར་ཐོ་འགོད་བྱེད་རོགས།</router-link>
        </div>
        <div
            class="fixedbottom2 flex area-center f24 c777 Qomolangma"
            @click.stop="checkStatus = !checkStatus"
            style="background:#fff"
        >
            <img src="../assets/check-icon.png" alt v-if="!checkStatus" class="icon44" />
            <img src="../assets/checked-icon.png" alt v-else class="icon44" />
            མོས་མཐུན་
            <router-link to="/asidePage/1" class="c295">《སྤྱོད་མཁན་གྱི་གྲོས་མཐུན།》</router-link>དང
            <router-link to="/asidePage/2" class="c295">《གསང་བའི་གྲོས་མཐུན།》</router-link>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onActivated, reactive, ref, toRefs } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { phone } from '../utils/check.js';
import {useI18n} from "vue-i18n";
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
        const { t } = useI18n();
        const { proxy } = getCurrentInstance();
        state.codeName=t('login.getyan');
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
                        proxy.$toast(res.msg)
                    }
                })
            }
        }
        function login() {
            if (phone(state.phoneVal)) {
                if (!state.codeVal) {
                    proxy.$toast.fail('ཉིད་ཀྱིས་ར་སྤྲོད་ཨང་གྲངས་འགོད་རོགས།');
                    return;
                }
                if (!state.checkStatus) {
                    proxy.$toast.fail('མོས་མཐུན་《སྤྱོད་མཁན་གྱི་གྲོས་མཐུན།》དང《གསང་བའི་གྲོས་མཐུན།》');
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
                        proxy.$toast('ཐོ་འགོད་ལེགས་འགྲུབ་བྱུང་བ།');
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