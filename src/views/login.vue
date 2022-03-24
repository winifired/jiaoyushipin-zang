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
        <div class="flex row-center login-input">
            <div class="imgW">
                <img src="../assets/password-icon.png" alt class="icon40" />
            </div>
            <input
                type="password"
                :placeholder="$t('login.passplace')"
                class="f30 Qomolangma"
                v-model="password"
                @focus="getFocus"
                @blur="getBlur"
            />
        </div>
        <div class="password-btn">
            <div class="flex area-between elesItem">
                <router-link
                    to="/loginCode"
                    class="Qomolangma f24 c333"
                >{{$t('login.codelogin')}}</router-link>
                <router-link to="/resetPass" class="Qomolangma f24 c333">{{$t('login.setpass')}}</router-link>
            </div>
        </div>
        <div class="login-button f32 c333 Qomolangma" @click="login">{{$t('login.login')}}</div>
        <div class="f26 c777 Qomolangma register flex area-center">
            {{$t('login.noacount')}}
            <router-link to="/register" class="c295">{{$t('login.goregister')}}</router-link>
        </div>
        <div
            class="fixedbottom2 flex area-center f24 c777 Qomolangma"
            @click.stop="checkStatus = !checkStatus"
            style="background:#fff"
        >
            <img src="../assets/check-icon.png" alt v-if="!checkStatus" class="icon44" />
            <img src="../assets/checked-icon.png" alt v-else class="icon44" />
            {{$t('login.agree')}}
            <router-link to="/asidePage/1" class="c295"> {{$t('login.useragree')}} </router-link>{{$t('login.he')}}
            <router-link to="/asidePage/2" class="c295"> {{$t('login.yinsi')}} </router-link>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { phone } from '../utils/check.js';
export default {
    name: 'login',
    setup() {
        const focusStatus = ref(false);
        const innerHeight = sessionStorage.getItem('innerHeight') + 'px';
        const checkStatus = ref(false);
        const phoneVal = ref();
        const password = ref();
        const router = useRouter();
        const store = useStore();
        const { proxy } = getCurrentInstance();
        onActivated(() => {
            router.afterEach((to, from) => {
                if (to.path.indexOf("asidePage") == -1 && from.path.indexOf("asidePage") == -1) {
                    phoneVal.value = '';
                    password.value = '';
                    checkStatus.value = false;
                    focusStatus.value = false;
                }
            });
        })
        function login() {
            const phoneStatus = phone(phoneVal.value);
            if (phoneStatus) {
                if (!checkStatus.value) {
                    proxy.$toast.fail('མོས་མཐུན་《སྤྱོད་མཁན་གྱི་གྲོས་མཐུན།》དང《གསང་བའི་གྲོས་མཐུན།》');
                    return;
                }
                proxy.$post(proxy.Apis.accountNumberLogin, {
                    accountNumber: phoneVal.value,
                    password: password.value
                }).then(res => {
                    if (res.code == 0) {
                        proxy.$toast('ཐོ་འགོད་ལེགས་འགྲུབ་བྱུང་བ།');
                        store.commit('setUsrid', res.data.id);
                        store.commit('setUserinfo', res.data);
                        router.replace('/');
                    }
                })
            }
        }
        function getFocus() {
            focusStatus.value = true;
        }
        function getBlur() {
            focusStatus.value = false;
        }
        return {
            innerHeight,
            focusStatus,
            checkStatus,
            phoneVal,
            password,
            login,
            getFocus,
            getBlur,
        }
    }
};
</script>

<style scoped lang='scss'>
@import "../common/login.scss";
</style>