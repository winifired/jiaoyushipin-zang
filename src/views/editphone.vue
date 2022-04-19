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
                v-model="phoneNumber"
            />
        </div>
        <!-- 验证码 -->
        <div class="flex row-center login-input nowarp">
            <input
                type="text"
                :placeholder="$t('login.yanzheng')"
                class="f30"
                style="padding:0;width: 50%;"
                v-model="codeVal"
            />
            <div
                class="getCode f30"
                @click="getCode()"
                :disabled="disabled"
            >{{ codeName }}</div>
        </div>
        <div
            class="login-button f32 c333 register-btn"
            @click="editUse"
            :class="{ 'noClick': noClick }"
        >{{$t('login.save')}}</div>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { phone } from '../utils/check.js';
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'editphone',
    props: {
    },
    components: {
    },
    setup() {
        const { t,locale } = useI18n();
        document.title=t('xiugaishoujih');
        const store = useStore();
        const router = useRouter();
        const state = reactive({
            phoneNumber: store.state.userinfo.phoneNumber,
            codeName: '',
            disabled: false,
            codeVal: '',
            noClick: false
        });
        const { proxy } = getCurrentInstance();
        state.codeName = t('login.getyan');
        function getCode() {
            if (phone(state.phoneNumber)) {
                setTimer();
                proxy.$post(proxy.Apis.sendChangeVerificationCode, {
                    phoneNumber: state.phoneNumber,
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
        function editUse() {
            if (phone(state.phoneNumber)) {
                if (!state.codeVal) {
                    proxy.$toast.fail(t('login.yanzheng'));
                    return;
                }
                state.noClick=true;
                proxy.$post(proxy.Apis.changePhoneNumber, {
                    userId: store.state.userid,
                    phoneNumber: state.phoneNumber,
                    verificationCode: state.codeVal,
                }).then(res => {
                    if (res.code != 0) {
                        state.codeName = t('login.getyan');
                        state.disabled = false;
                        clearInterval(state.timer);
                        state.noClick=false;
                    } else {
                        proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan);
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
                    state.codeName = t('login.getyan');
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