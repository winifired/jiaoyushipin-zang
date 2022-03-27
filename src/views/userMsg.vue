<template>
    <div class="userMsg" v-if="userinfo">
        <div class="flex area-between item marginb8 itemelse">
            <p class="f28 c333 Qomolangma">{{$t('touxiang')}}</p>
            <div class="flex row-center">
                <van-uploader :after-read="afterRead" accept="image/*">
                    <img :src="avatar" alt class="avatar" v-if="avatar" />
                    <img src="../assets/avatar.png" alt class="avatar" v-else />
                </van-uploader>
                <img src="../assets/usermsg-right.png" alt class="icon36" />
            </div>
        </div>
        <div class="flex area-between item">
            <!-- 昵称 -->
            <p class="f28 c333 Qomolangma">{{$t('nicheng')}}</p>
            <div class="flex row-center msg">
                <input
                    type="text"
                    class="f28 caaa Qomolangma"
                    v-model="nickName"
                    @keyup.enter="confirmInput(2)"
                />
                <img src="../assets/usermsg-right.png" alt class="icon36" />
            </div>
        </div>
        <div class="flex area-between item">
            <!-- 微信 -->
            <p class="f28 c333 Qomolangma">{{$t('weixin')}}</p>
            <div class="flex row-center msg" @click="bindWeChat">
                <input
                    type="text"
                    class="f28 caaa"
                    readonly
                    :value="userinfo.openid ? $t('yibangding') : $t('weibangding')"
                />
                <img src="../assets/usermsg-right.png" alt class="icon36" />
            </div>
        </div>
        <div class="flex area-between item">
            <!-- qq -->
            <p class="f28 c333 Qomolangma">{{$t('qq')}}</p>
            <div class="flex row-center msg">
                <input
                    type="text"
                    class="f28 caaa"
                    v-model="qqNumber"
                    @keyup.enter="confirmInput(3)"
                />
                <img src="../assets/usermsg-right.png" alt class="icon36" />
            </div>
        </div>
        <div class="flex area-between item">
            <!-- 职业 -->
            <p class="f28 c333 Qomolangma">{{$t('zhiye')}}</p>
            <div class="flex row-center msg">
                <input
                    type="text"
                    class="f28 caaa Qomolangma"
                    v-model="job"
                    @keyup.enter="confirmInput(4)"
                />
                <img src="../assets/usermsg-right.png" alt class="icon36" />
            </div>
        </div>
        <div class="flex area-between item" @click="$router.push('/editphone')">
            <!-- 手机号 -->
            <p class="f28 c333 Qomolangma">{{$t('bangdingshoujihao')}}</p>
            <div class="flex row-center msg">
                <p class="f28 caaa">{{ userinfo.phoneNumber }}</p>
                <img src="../assets/usermsg-right.png" alt class="icon36" />
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue';
import { Uploader } from 'vant';
import { useStore } from 'vuex';
import { bindwx, getCode } from "../utils/wxJs.js";
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'userMsg',
    props: {
    },
    components: {
        vanUploader: Uploader
    },
    setup() {
        getCode();
        const { t,locale } = useI18n();
        document.title=t('zlsz');
        const store = useStore();
        console.log(store)
        const state = reactive({
            userinfo: store.state.userinfo,
            avatar: store.state.userinfo.avatar,
            nickName: store.state.userinfo.nickName,
            qqNumber: store.state.userinfo.qqNumber,
            job: store.state.userinfo.job,
        });
        const { proxy } = getCurrentInstance();
        const afterRead = (file) => {
            let form = new FormData();
            form.append('file', file.file)
            proxy.$post(proxy.Apis.upload, form).then(res => {
                editUse(1, { avatar: res.url })
            })
        };
        function editUse(type, data) {
            data['id'] = store.state.userid;
            proxy.$post(proxy.Apis.updateJyspUser, data).then(res => {
                if (res.code == 0) {
                    proxy.$toast(locale.value=='zh'?res.msg:res.msgTibetan);
                    if (type == 1) {
                        state.avatar = state.userinfo.avatar = data.avatar;
                    } else if (type == 2) {
                        state.nickName = state.userinfo.nickName = data.nickName;
                    } else if (type == 3) {
                        state.qqNumber = state.userinfo.qqNumber = data.qqNumber;
                    } else if (type == 4) {
                        state.job = state.userinfo.job = data.job;
                    }
                } else {
                    if (type == 1) {
                        state.avatar = state.userinfo.avatar;
                    } else if (type == 2) {
                        state.nickName = state.userinfo.nickName;
                    } else if (type == 3) {
                        state.qqNumber = state.userinfo.qqNumber;
                    } else if (type == 4) {
                        state.job = state.userinfo.job;
                    }
                }
            })
        }
        const confirmInput = (type) => {
            if (type == 2) {
                editUse(type, { nickName: state.nickName });
            } else if (type == 3) {
                editUse(type, { qqNumber: state.qqNumber });
            } else if (type == 4) {
                editUse(type, { job: state.job });
            }
        }
        const bindWeChat = () => {
            if (!state.userinfo.openid) {
                bindwx();
            }
        }
        return {
            ...toRefs(state),
            afterRead,
            confirmInput,
            bindWeChat
        }
    },
})
</script>

<style scoped lang='scss'>
.userMsg {
    min-height: 100vh;
    background: #f8f8f8;
    padding-top: 8px;
}
.item {
    background: #fff;
    padding: 19px 16px;
    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
    }
    .msg {
        margin-left: 5px;
        flex: 1;
        justify-content: flex-end;
    }
    input {
        flex: 1;
        max-width: 70%;
        text-align: right;
    }
    .icon36 {
        margin-left: 12px;
    }
}
.userMsg > div:not(:last-child) {
    border-bottom: 1px solid #f3f3f3;
}
.itemelse {
    height: 68px !important;
}
.marginb8 {
    margin-bottom: 8px;
}
</style>