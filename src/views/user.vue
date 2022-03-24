<template>
    <div class="user">
        <div class="user-bg flex row-center">
            <img
                :src="userinfo.avatar"
                alt
                class="avatar"
                v-if="userid && userinfo && userinfo.avatar"
            />
            <img src="../assets/avatar.png" alt class="avatar" v-else />
            <p
                class="f30 c333 Qomolangma"
                v-if="userid"
                @click="$router.push('/userMsg')"
            >{{ userinfo.nickName || 'དྲ་མིང་འགོད་པ།' }}</p>
            <p class="f30 c333 Qomolangma" v-else @click="$router.push('/login')">ཐོ་འགོད་བྱེད་པ།</p>
            <img
                src="../assets/vip-user.png"
                alt
                class="vip-user"
                v-if="userinfo && userinfo.level == 1"
            />
        </div>
        <div class="flex area-between vipMsg">
            <div class="flex row-center">
                <img src="../assets/vip-icon.png" alt class="icon48" />
                <span class="Qomolangma f28 c6f5">རྒྱུན་མི།</span>
            </div>
            <div class="flex row-center" v-if="userinfo && userinfo.level == 1">
                <p class="Qomolangma f26 c6f5">
                    <span class="marginr">{{ userinfo.vipValidTime?userinfo.vipValidTime.slice(0,10):'' }}</span>
                    <span>རིན་གཅོག་དུས་ཚོད་ལོངས་པ།</span>
                </p>
                <img src="../assets/user-block.png" alt class="icon40" />
            </div>
        </div>
        <!-- 个人资料 -->
        <router-link :to="userid ? '/userMsg' : '/login'" class="flex area-between toItem">
            <p class="flex row-center f26 c333 Qomolangma">
                <img src="../assets/user-01.png" alt class="icon44" />{{$t('users.personaldata')}}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 我的收藏 -->
        <router-link :to="userid ? '/userCollect' : '/login'" class="flex area-between toItem">
            <p class="flex row-center f26 c333 Qomolangma">
                <img src="../assets/user-02.png" alt class="icon44" />{{$t('users.mycollection')}}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 学习记录 -->
        <router-link :to="userid ? '/userLean' : '/login'" class="flex area-between toItem">
            <p class="flex row-center f26 c333 Qomolangma">
                <img src="../assets/user-03.png" alt class="icon44" />{{$t('users.records')}}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 关于我们 -->
        <router-link class="flex area-between toItem" to="/asidePage/3">
            <p class="flex row-center f26 c333 Qomolangma">
                <img src="../assets/usere-04.png" alt class="icon44" />{{$t('users.about')}}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </router-link>
        <!-- 联系我们 -->
        <div class="flex area-between toItem" @click="show = true">
            <p class="flex row-center f26 c333 Qomolangma">
                <img src="../assets/user-04.png" alt class="icon44" />{{$t('users.contact')}}
            </p>
            <img src="../assets/user-gray.png" alt class="icon44" />
        </div>
        <!-- 退出登录 -->
        <div class="flex area-between toItem" @click="outlogin">
            <p class="flex row-center f26 c333 Qomolangma">
                <img src="../assets/user-05.png" alt class="icon44" />{{$t('users.signout')}}
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
            <p class="f32 cffa Qomolangma item" @click="show = false">ཕྱིར་འཐེན།</p>
        </div>
    </van-overlay>
</template>

<script>
import { Overlay } from 'vant';
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
    name: 'user',
    props: {

    },
    components: {
        vanOverlay: Overlay
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();
        const state = reactive({
            show: false,
            userid: store.state.userid,
            userinfo: store.state.userinfo,
        });
        if(store.state.userid){
            getuserinfo();
        }
        function getuserinfo() {
            proxy.$post(proxy.Apis.selectJyspUserById, {
                userId: state.userid
            }).then(res => {
                if(res.code==0){
                    state.userinfo=res.data;
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
                proxy.$toast('ཕྱིར་འཐེན་ལེགས་འགྲུབ་བྱུང་བ།')
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
.user-bg {
    width: 100%;
    height: 121px;
    background: url(../assets/user-bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 32px 0 0 32px;
    .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 16px;
        object-fit: cover;
    }
    .vip-user {
        margin-left: 8px;
        width: 18px;
        height: 18px;
    }
}
.vipMsg {
    margin: 4px 16px 0;
    background: url(../assets/user-vip-bg.png) no-repeat;
    background-size: 100% 100%;
    padding: 0 16px;
    height: 56px;
    margin-bottom: calc(50px - 17px);
    .icon48 {
        margin-right: 8px;
    }
    .icon40 {
        margin-left: 19px;
    }
}
</style>