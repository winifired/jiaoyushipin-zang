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
                v-model="phoneNumber"
            />
        </div>
        <!-- 验证码 -->
        <div class="flex row-center login-input nowarp">
            <input
                type="text"
                placeholder="ཉིད་ཀྱིས་ར་སྤྲོད་ཨང་གྲངས་འགོད་རོགས།"
                class="f30 Qomolangma"
                style="padding:0;"
                v-model="codeVal"
            />
            <div
                class="getCode f30 Qomolangma"
                @click="getCode()"
                :disabled="disabled"
            >{{ codeName }}</div>
        </div>
        <div
            class="login-button f32 c333 Qomolangma register-btn"
            @click="editUse"
            :class="{ 'noClick': noClick }"
        >གཏན་འཁེལ།</div>
    </div>
    <!-- ཐོ་འགོད་ལེགས་འགྲུབ་བྱུང་པ། 注册成功 -->
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { phone } from '../utils/check.js';
export default defineComponent({
    name: 'editphone',
    props: {
    },
    components: {
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const state = reactive({
            phoneNumber: store.state.userinfo.phoneNumber,
            codeName: 'ར་སྤྲོད་ཨང་གྲངས་ལེན་པ།',
            disabled: false,
            codeVal: '',
            noClick: false
        });
        const { proxy } = getCurrentInstance();
        function getCode() {
            if (phone(state.phoneNumber)) {
                setTimer();
                proxy.$post(proxy.Apis.sendChangeVerificationCode, {
                    phoneNumber: state.phoneNumber,
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
        function editUse() {
            if (phone(state.phoneNumber)) {
                if (!state.codeVal) {
                    proxy.$toast.fail('ཉིད་ཀྱིས་ར་སྤྲོད་ཨང་གྲངས་འགོད་རོགས།');
                    return;
                }
                state.noClick=true;
                proxy.$post(proxy.Apis.changePhoneNumber, {
                    userId: store.state.userid,
                    phoneNumber: state.phoneNumber,
                    verificationCode: state.codeVal,
                }).then(res => {
                    if (res.code != 0) {
                        state.codeName = 'ར་སྤྲོད་ཨང་གྲངས་ལེན་པ།';
                        state.disabled = false;
                        clearInterval(state.timer);
                        state.noClick=false;
                    } else {
                        proxy.$toast(res.msg);
                        setTimeout(() => { router.go(-1); }, 1000);
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
        return {
            ...toRefs(state),
            getCode,
            editUse
        }
    },
})
</script>

<style scoped lang='scss'>
@import "../common/login.scss";
</style>