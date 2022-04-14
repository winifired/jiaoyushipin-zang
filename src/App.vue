<template>
 <!-- -->
  <div class="pageContent" :class="$i18n.locale=='zh'?'pingfangF':'QomolangmaF'">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['login', 'loginCode']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <tabbar :currentPage="$route.meta.currentPage || ''" :showTabar="$route.meta.showTabar"></tabbar>
  </div>
</template>
<script>
import tabbar from "@/components/tabbar.vue";
import { onMounted, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';
export default {
  components: { tabbar },
  setup() {
    const store = useStore();
    onMounted(() => {
      console.log(store)
      window.addEventListener('unload', saveState);
      sessionStorage.setItem('innerHeight', document.documentElement.clientHeight);
      if (!store.state.userinfo && localStorage.getItem('state')) {
        store.commit('setState', localStorage.getItem('state'))
      }
    });
    watch(()=>store.state,(newDate)=>{
      saveState()
    },{
      deep:true
    })
    const saveState = () => {
      localStorage.setItem('state', JSON.stringify(store.state))
    };
    // function isWeiXin() {
    //   var ua = window.navigator.userAgent.toLowerCase();
    //   console.log(ua);
    //   if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
  },
}
</script>
<style lang="scss">
@import "@/common/public.scss";
* {
  margin: 0;
  padding: 0;
}
.pageContent {
  min-height: 100vh;
  background: #fff;
}
.detail-content {
  video,
  img {
    display: block!important;
    width: 100%!important;
  }
}
@font-face {
  // 苹方-简
  font-family: "pingfang";
  src: url('./assets/font/pingfang.TTF') format("truetype");
  // src: url('./assets/font/PINGFANG\ MEDIUM_1.TTF') format("truetype");
}

@font-face {
  // 方正兰亭特黑简体
  font-family: "FZLTTHJW";
  src: url("./assets/font/FZLTTHJW.TTF") format("truetype");
}

@font-face {
  // 方正兰亭纤黑简体
  font-family: "fangzhenglanting";
  src: url("./assets/font/fangzhenglanting.TTF") format("truetype");
}
@font-face {
  // 珠穆朗玛-小标题
  font-family: "Qomolangma";
  src: url("./assets/font/Qomolangma-Subtitle.ttf") format("truetype");
}
.pingfangF {
  font-family: "pingfang";
  font-weight: 500;
}
.QomolangmaF {
  font-family: "Qomolangma";
}
.fangzhenglantingF {
  font-family: "fangzhenglanting";
}
.FZLTTHJWF {
  font-family: "FZLTTHJW";
}
.detail-content {
  img {
    width: 100%;
  }
}
.bold{
  font-weight: bold;
}
.fixedbottom {
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
}
.button-bottom {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  text-align: center;
}
.bgeee {
  background: #eee;
}
.bgf9d {
  background: #f9dc39;
}
.bglinear {
  background: linear-gradient(90deg, #fde9c3 0%, #e8c087 100%);
}
</style>
