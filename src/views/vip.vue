<template>
  <div class="vip">
    <div class="user-vip flex row-center">
      <img :src="userinfo.avatar" alt class="avatar" v-if="userid && userinfo && userinfo.avatar" />
      <img src="../assets/avatar.png" alt class="avatar" v-else />
      <div>
        <p class="c845 f30 Qomolangma" v-if="userid">{{ userinfo.nickName || 'དྲ་མིང་འགོད་པ།' }}</p>
        <!-- 立即登录 -->
        <p
          class="c845 f30 Qomolangma"
          v-else
          @click="$router.push('/login')"
        >མྱུར་ཏུ་ཐོ་འགོད་བྱེད་པ།</p>
        <p v-if="userid && userinfo && userinfo.level == 1">
          <span class="ca06 f24 marginr">{{ userinfo.vipValidTime }}</span>
          <!-- vip展示 -->
          <span class="c845 f26 Qomolangma">རིན་གཅོག་དུས་ཚོད་ལོངས་པ།</span>
        </p>
      </div>
    </div>
    <p class="title f32 c333 Qomolangma">ཟུར་གཅོག་བྱང་བུའི་རིགས།</p>
    <div class="list flex">
      <div
        v-for="(item,index) in vipCardList"
        :key="item.id"
        class="flex area-center"
        :class="choosed == index ? 'choosed' : ''"
        @click="choosed = index"
      >
        <p class="c845 Qomolangma title-item">{{ item.type == 1 ? 'ཟླ་བྱང་།' : 'ལོ་བྱང་།' }}</p>
        <p class="c845 FZLTTHJWBOLD">
          <span class="f20">￥</span>
          <span class="f32">{{ item.price }}</span>
        </p>
      </div>
    </div>
    <p class="title f32 c333 Qomolangma">རྒྱུན་མི།</p>
    <div class="f13 c333 Qomolangma rule" v-html="VipExplain"></div>

    <div class="fixedbottom flex area-center" @click="openpay" :style="{ bottom: tabbarHeight }">
      <div class="button-bottom bglinear">
        <span class="c333 f32 Qomolangma">ཟུར་གཅོག་བྱང་བུ་ཉོ་བ།</span>
      </div>
    </div>
  </div>
  <paytype :showModel="showModel" :noClick="noClick" @buyCourse="buyVip" @closeModel="oncloseModel"></paytype>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
import paytype from '../components/paytype.vue';
import { getwxConfig, bindwx, getConfig,getCode } from "../utils/wxJs.js";
export default defineComponent({
  name: 'vip',
  props: {
  },
  components: {
    paytype
  },
  setup() {
    console.log(sessionStorage.getItem('tabbarHeight'))
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const state = reactive({
      userid: store.state.userid,
      userinfo: store.state.userinfo,
      choosed: 0,
      noClick: false,
      showModel: false,
      VipExplain: '',
      vipCardList: [],
      tabbarHeight: sessionStorage.getItem('tabbarHeight') || '50px'
    });
    // if (store.state.userid) {
      getCode();
      getwxConfig();
    // }
    getVipExplain();
    getlistVipCard();
    function getVipExplain() {
      proxy.$post(proxy.Apis.getVipExplain).then(res => {
        if (res.code == 0) {
          state.VipExplain = res.data.content
        }
      })
    }
    function getlistVipCard() {
      proxy.$post(proxy.Apis.listVipCard).then(res => {
        if (res.code == 0) {
          state.vipCardList = res.data
        }
      })
    }
    function openpay() {
      if(!state.userid){
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
        userId: state.userid,
        payMethod: data,//支付方式：1微信，2支付宝
        vipType: state.vipCardList[state.choosed].type,//会员卡类型：1月卡、2年卡	
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
              proxy.$toast('རིན་སྤྲོད་ལེགས་འགྲུབ་བྱུང་བ།')
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
              proxy.$toast('རིན་སྤྲོད་ལེགས་འགྲུབ་མ་བྱུང་བ།')
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
    height: 92px;
    background: url(../assets/vipbg.png) no-repeat;
    background-size: 100% 100%;
    padding: 0 0 0 32px;
    margin: 0 auto;
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 18px;
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
      background: #feffff;
      flex: 1;
      min-width: 100px;
      max-width: 163px;
      height: 136px;
      border-radius: 5px;
      flex-direction: column;
      margin: 15px 0 0;
      .title-item {
        margin-bottom: 24px;
      }
    }
    .choosed {
      background: url(../assets/choosedvip.png) no-repeat;
      background-size: 100% 100%;
    }
    > div:not(:nth-child(3n)) {
      margin-right: 16px;
    }
  }
  .fixedbottom {
    width: calc(100% - 32px);
    padding-bottom: 24px !important;
    background: #f8f8f8 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>