<template>
  <div class="vip">
    <div class="user-vip flex">
      <div class="c845 f30 Qomolangma flex">
        <img :src="userinfo.avatar" alt class="avatar" v-if="userid && userinfo && userinfo.avatar" />
        <img src="../assets/avatar.png" alt class="avatar" v-else />
        <p v-if="userid" class="flex Qomolangma usernick">
          {{ userinfo.nickName || $t('nicheng') }}
          <img
            src="../assets/vip-user.png"
            alt
            class="vip-user-icon"
            v-if="userid && userinfo && userinfo.level == 1"
          />
        </p>
        <!-- 立即登录 -->
        <p class="c845 f30 Qomolangma usernick" v-else @click="$router.push('/login')">{{ $t('loginname') }}</p>
      </div>
      <div class="flex uservip">
        <div v-for="(item, index) in listUserVipContent" :key="index">
          <p>{{ lang == 'zh' ? item.name : item.nameTibetan }}</p>
          <p>{{ item.vipValidTime ? item.vipValidTime.split(' ')[0] : '' }}{{ $t('daoqi') }}</p>
        </div>
      </div>
    </div>
    <p class="title f32 c333 Qomolangma">{{ $t('viptitle') }}</p>
    <div class="list flex">
      <div
        v-for="(item, index) in vipCardList"
        :key="item.id"
        class="flex area-center"
        :class="choosed == index ? 'choosed' : ''"
        @click="choosed = index"
      >
        <p class="c845 Qomolangma title-item">{{ lang == 'zh' ? item.name : item.nameTibetan }}</p>
        <p class="c845 FZLTTHJWBOLD">
          <span class="f20">￥</span>
          <span class="f36">{{ item.price }}</span>
        </p>
        <p class="c845 Qomolangma tip f22">{{ lang == 'zh' ? item.intro : item.introTibetan }}</p>
      </div>
    </div>
    <!-- <p class="title f32 c333 Qomolangma">རྒྱུན་མི།</p>
    <div class="f13 c333 Qomolangma rule" v-html="VipExplain"></div>-->

    <div class="fixedbottom flex area-center" @click="openpay" :style="{ bottom: tabbarHeight }">
      <div class="button-bottom bglinear">
        <span class="c333 f32 Qomolangma">{{ $t('kaitong') }}</span>
      </div>
    </div>
  </div>
  <paytype :showModel="showModel" :noClick="noClick" @buyCourse="buyVip" @closeModel="oncloseModel"></paytype>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
import paytype from '../components/paytype.vue';
import { getwxConfig, bindwx, getConfig, getCode } from "../utils/wxJs.js";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: 'vip',
  props: {
  },
  components: {
    paytype
  },
  setup() {
    const { t, locale } = useI18n();
    document.title = t('tabbar.vip')
    console.log(sessionStorage.getItem('tabbarHeight'))
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      userid: store.state.userid,
      userinfo: store.state.userinfo,
      choosed: 0,
      noClick: false,
      showModel: false,
      // VipExplain: '',
      vipCardList: [],
      tabbarHeight: sessionStorage.getItem('tabbarHeight') || '50px',
      listUserVipContent: [],
      lang: locale.value
    });
    onMounted(() => {
      getCode();
      getwxConfig();
      // getVipExplain();
      getlistVipCard();
      if (store.state.userid) {
        listUserVip()
      }
    })
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
    // function getVipExplain() {
    //   proxy.$post(proxy.Apis.getVipExplain).then(res => {
    //     if (res.code == 0) {
    //       state.VipExplain = res.data.content
    //     }
    //   })
    // }
    function getlistVipCard() {
      proxy.$post(proxy.Apis.listVipCard).then(res => {
        if (res.code == 0) {
          state.vipCardList = res.data
        }
      })
    }
    function openpay() {
      if (!state.userid) {
        proxy.$router.push('/login');
        return;
      }
      state.showModel = true;
    }
    function buyVip(data) {
      if (data == 1 && !store.state.userinfo.openid) {
        //判断是否已绑定微信
        bindwx();
      } else {
        buyVipPost(data)
      }
    }
    function buyVipPost(data) {
      state.noClick = true;
      proxy.$post(proxy.Apis.buyVip, {
        vipId:state.vipCardList[state.choosed].id,//会员卡id
        userId: state.userid,
        payMethod: data,//支付方式：1微信，2支付宝
        money: state.vipCardList[state.choosed].price
      }).then(res => {
        if (res.code == 0) {
          console.log(res)
          if (data == 2) {
            //支付宝支付
            let htmls = res.orderString; //打开新页面
            const div = document.createElement("div");
            div.innerHTML = htmls;
            document.body.appendChild(div);
            document.forms[0].submit();
          } else {
            // 微信支付
            getConfig(res.orderString).then(res => {
              console.log(res)
              proxy.$toast(t('zhifuchengg'))
              // 重置用户信息
              proxy.$post(proxy.Apis.selectJyspUserById, {
                userId: store.state.userid
              }).then(res => {
                if (res.code == 0) {
                  state.userinfo = res.data;
                  store.commit('setUserinfo', res.data);
                }
              });
            }).catch(err => {
              console.log(err)
              proxy.$toast(t('zhifushibai'))
            });
          }
        } else {
          state.showModel = false;
          state.noClick = false;
        }
      });
    }
    function oncloseModel() {
      state.showModel = false;
      state.noClick = false;
    }
    return {
      ...toRefs(state),
      openpay,
      oncloseModel,
      buyVip,
    }
  },
})
</script>

<style lang='scss' scope>
.vip {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 16px 16px 150px;
  .user-vip {
    min-height: 144px;
    background: url(../assets/vipbg.png) no-repeat;
    background-size: 100% 100%;
    padding: 12px 16px;
    margin: 0 auto;
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 18px;
    }
    .usernick {
      padding-top: 12px;
    }
  }
  .marginr {
    margin-right: 4px;
  }
  .title {
    margin: 32px 0 0;
  }
  .rule {
    margin: 16px 0 0;
  }
  .list {
    > div {
      background: url(../assets/choosedvip.png);
      background-size: 100% 100%;
      width: 165px;
      height: 120px;
      flex-direction: column;
      margin: 15px 0 0;
      border-radius: 6px;
      .title-item {
        margin-bottom: 8px;
      }
      .tip {
        margin-top: 20px;
      }
    }
    .choosed {
      border: 2px solid #ed9b23;
    }
    > div:not(:nth-child(2n)) {
      margin-right: 13px;
    }
  }
  .fixedbottom {
    width: calc(100% - 32px);
    padding-bottom: 24px !important;
    background: #f8f8f8 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .vip-user-icon {
    width: 18px;
    height: 18px;
    margin-left: 12px;
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
</style>