<template>
    <div class="user">
        <div class="user-vip flex">
            <div class="c845 f30 flex">
                <img
                    :src="userinfo.avatar"
                    alt
                    class="avatar"
                    v-if="userid && userinfo && userinfo.avatar"
                />
                <img src="../assets/avatar.png" alt class="avatar" v-else />
                <p v-if="userid" class="flex usernick row-center">
                    {{ userinfo.nickName || $t('nicheng') }}
                    <img
                        src="../assets/vip-user.png"
                        alt
                        class="vip-user-icon"
                        v-if="userid && userinfo && userinfo.level == 1"
                    />
                </p>
                <!-- 立即登录 -->
                <p
                    class="c845 f30 usernick"
                    v-else
                    @click="$router.push('/login')"
                >{{ $t('loginname') }}</p>
            </div>
            <div class="flex uservip">
                <div v-for="(item, index) in listUserVipContent" :key="index">
                    <p>{{ lang == 'zh' ? item.name : item.nameTibetan }}</p>
                    <p>{{ item.vipValidTime ? item.vipValidTime.split(' ')[0] : '' }}{{ $t('daoqi') }}</p>
                </div>
            </div>
        </div>
        <!-- 个人资料 -->
        <router-link :to="userid ? '/userMsg' : '/login'" class="flex area-between toItem">
            <p class="flex row-center f26 c333">
                <img src="../assets/user-01.png" alt class="icon44" />
                {{ $t('users.personaldata') }}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 我的收藏 -->
        <router-link :to="userid ? '/userCollect' : '/login'" class="flex area-between toItem">
            <p class="flex row-center f26 c333">
                <img src="../assets/user-02.png" alt class="icon44" />
                {{ $t('users.mycollection') }}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 学习记录 -->
        <router-link :to="userid ? '/userLean' : '/login'" class="flex area-between toItem">
            <p class="flex row-center f26 c333">
                <img src="../assets/user-03.png" alt class="icon44" />
                {{ $t('users.records') }}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 关于我们 -->
        <router-link class="flex area-between toItem" to="/asidePage/3">
            <p class="flex row-center f26 c333">
                <img src="../assets/usere-04.png" alt class="icon44" />
                {{ $t('users.about') }}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 联系我们 -->
        <div class="flex area-between toItem" @click="show = true">
            <p class="flex row-center f26 c333">
                <img src="../assets/user-04.png" alt class="icon44" />
                {{ $t('users.contact') }}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </div>
        <!-- 退出登录 -->
        <div class="flex area-between toItem" @click="outlogin">
            <p class="flex row-center f26 c333">
                <img src="../assets/user-05.png" alt class="icon44" />
                {{ $t('users.signout') }}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </div>
    </div>
    <van-overlay :show="show" @click="show = false" z-index="100">
        <div class="phoneModel">
            <router-link to custom>
                <a href="tel:4000-000-000" class="flex area-center f34 cffa item">
                    <img src="../assets/phone-icon.png" alt class="icon40" />
                    400-8523201030
                </a>
            </router-link>
            <p class="f32 cffa item" @click="show = false">{{ $t('quxiao') }}</p>
        </div>
    </van-overlay>
</template>

<script>
import { Overlay } from 'vant';
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'user',
    props: {

    },
    components: {
        vanOverlay: Overlay
    },
    setup() {
        const { t,locale } = useI18n();
        document.title=t('appname')
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();
        const state = reactive({
            show: false,
            userid: store.state.userid,
            userinfo: store.state.userinfo,
            listUserVipContent: [],
            lang: locale.value
        });
        if (store.state.userid) {
            getuserinfo();
            listUserVip();
        }
        function listUserVip() {
            // 会员购买的vip
            proxy.$post(proxy.Apis.listUserVip, {
                userId: store.state.userid,
            }).then(res => {
                if (res.code == 0) {
                    state.listUserVipContent = res.data
                }
            })
        }
        function getuserinfo() {
            proxy.$post(proxy.Apis.selectJyspUserById, {
                userId: state.userid
            }).then(res => {
                if (res.code == 0) {
                    state.userinfo = res.data;
                    store.commit('setUserinfo', res.data);
                }
            });
        }
        const outlogin = () => {
            if (state.userid) {
                sessionStorage.clear();
                localStorage.clear();
                store.commit('clearData');
                router.removeRoute();
                router.replace('/');
                proxy.$toast(t('tuichucg'))
            } else {
                router.push('/login');
            }
        }
        return {
            ...toRefs(state),
            outlogin
        }
    },
})
</script>

<style scoped lang='scss'>
.marginr {
    margin-right: 4px;
}
.phoneModel {
    padding: 0 0 34px;
    position: absolute;
    bottom: 0;
    width: 100%;
    .item {
        width: 345px;
        height: 52px;
        line-height: 52px;
        text-align: center;
        background: #ffffff;
        border-radius: 8px;
        margin: 10px auto 0;
        img {
            margin-right: 10px;
        }
    }
}
.toItem {
    margin: 0 16px;
    height: 56px;
    > p {
        > img {
            margin-right: 16px;
        }
    }
}
.toItem:not(:last-child) {
    border-bottom: 1px solid #f5f5f5;
}
.user-vip {
    min-height: 144px;
    background: url(../assets/vipbg.png) no-repeat;
    background-size: 100% 100%;
    padding: 12px 16px;
    border-radius:6px;
    margin: 24px 16px 0;
    .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 18px;
    }
    .usernick {
        padding-top: 12px;
    }
    .uservip {
        > div {
            margin-top: 12px;
            width: 149px;
            height: 52px;
            background: rgba(254, 254, 254, 0.3);
            border-radius: 4px;
            padding: 6px 0 0 12px;
            > p:nth-child(1) {
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #694b2f;
            }
            > p:nth-child(2) {
                margin-top: 4px;
                font-size: 11px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #6f500d;
            }
        }
        > div:not(:nth-child(2n)) {
            margin-right: 13px;
        }
    }
}
.vip-user-icon{
    width: 22px;
    height: 22px;
    margin-left: 10px;
}
</style>